from django.shortcuts import render
import os
import os.path
import re
import tempfile
from django.http import FileResponse, HttpResponse, JsonResponse, HttpResponseServerError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from lxml import etree
from io import BytesIO
from urllib.parse import quote
import json
import logging
logger = logging.getLogger('apps')

from google.oauth2 import service_account
from googleapiclient.discovery import build

from apps.orders.models import OcOrder, OcOrderProduct, OcTsgOrderBespokeImage
from cairosvg import svg2pdf
import json
from django.views.decorators.csrf import csrf_exempt

def test_google(request):

    filename = 'bespoke_image-18.png'
    file_id = _googledrive_upload(filename)
    return JsonResponse(file_id, safe=False)


def test_list(request):
    service = _google_auth()
    items = get_last_five_files(service)
    return JsonResponse(items, safe=False)

def _google_auth():
    SCOPES = ['https://www.googleapis.com/auth/drive']
    SCOPES = ["https://www.googleapis.com/auth/drive.file"]

    # Use the service account file
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    #service_account_file = os.path.join(project_root, 'ssan-bespoke-95dbf1ea28e6.json')
    service_account_file = os.path.join(project_root, 'ssan-bespoke-88bccd81c643.json')
    #service_account_file = 'path/to/your/service_account.json'  # Update this path
    creds = service_account.Credentials.from_service_account_file(
        service_account_file, scopes=SCOPES)

    # Use the credentials to access the API
    service = build('drive', 'v3', credentials=creds)

    return service


def _google_auth_old():
    SCOPES = ['https://www.googleapis.com/auth/drive']
    SCOPES = ["https://www.googleapis.com/auth/drive.file"]
    creds = None

    # Get the project's root directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

    # Construct the path to client_secret.json
    client_secret_path = os.path.join(project_root, 'client_secret.json')
    token_path = os.path.join(project_root, 'token.json')

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(client_secret_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    return creds

# Create your views here.
@csrf_exempt
def convert_order(request, pk):
    data = []

    bespoke_product_svg_obj = OcTsgOrderBespokeImage.objects.filter(order_product__order__order_id=pk)
    for product_bespoke in bespoke_product_svg_obj:
        file_uploaded = {}
        filename = f"{pk}-{product_bespoke.id}.pdf"
        file_uploaded = {'name': filename}
        file_uploaded['status'] = 'error'

        # Signs drawn with the sign designer arrive with their text already as
        # outlines, so svg_export needs no font and goes straight through.
        # Any line whose artwork still has live text is left for a person: a
        # PDF with a substituted font is worse than none.
        if (product_bespoke.version or 0) >= OcTsgOrderBespokeImage.DESIGNER_VERSION:
            export = product_bespoke.svg_export
            export = export.tobytes() if isinstance(export, memoryview) else export
            if not export or b'<text' in bytes(export):
                file_uploaded['status'] = 'skipped'
                file_uploaded['reason'] = 'Artwork has live text; made before outlining.'
                data.append(file_uploaded)
                continue

        bl_converted = _convert_svg_to_pdf(product_bespoke.svg_export, filename)
        if bl_converted:
        #now upload the file to google drive
            file_id = _googledrive_upload(filename)
            if file_id:
                product_bespoke.google_id = file_id
                file_uploaded['file_id'] = file_id
                file_uploaded['status'] = 'converted'
                product_bespoke.save()
            else:
                file_uploaded['status'] = 'error'

        data.append(file_uploaded)

    return JsonResponse(data, safe=False)

def _pdf_filename(asked, fallback):
    """A name for the PDF, from the person making it.

    It becomes a filename on this server and on the Drive, so it keeps to
    letters, digits, spaces and the plainest punctuation — nothing that could
    walk out of the folder it belongs in."""
    name = (asked or '').strip()
    if name.lower().endswith('.pdf'):
        name = name[:-4]
    name = re.sub(r'[^A-Za-z0-9 ._-]', '', name).strip(' .')
    return f'{name[:80] or fallback}.pdf'


@require_POST
@login_required
def convert_order_product(request, pk):
    """Make the print PDF for one order line, and put it on the Drive.

    Used from the order's artwork page: after a sign is corrected its old PDF
    is no longer what will be printed, so a new one has to be made."""
    row = get_object_or_404(OcTsgOrderBespokeImage, pk=pk)
    export = row.svg_export
    export = export.tobytes() if isinstance(export, memoryview) else export
    if isinstance(export, str):
        export = export.encode('utf-8')
    if not export or b'<svg' not in export:
        return JsonResponse({'error': 'This line has no artwork to convert.'}, status=400)
    if b'<text' in export:
        return JsonResponse({
            'error': 'The artwork still has live text, so the PDF would use whatever '
                     'font this server has. Open it in the designer and save it again.',
        }, status=400)

    filename = _pdf_filename(request.POST.get('name'), f'{row.order_product.order_id}-{row.pk}')
    if not _convert_svg_to_pdf(export, filename):
        return JsonResponse({'error': 'The PDF could not be made from this artwork.'}, status=500)

    # The PDF exists either way. The Drive is where it is kept, and a machine
    # without the service account key — a developer's, typically — cannot reach
    # it; that is no reason to lose the file or to answer with a 500.
    try:
        file_id = _googledrive_upload(filename)
    except Exception as e:
        logger.warning('bespoke %s: Drive upload failed: %s', row.pk, e)
        file_id = ''

    local = reverse('orderproductbespoke-pdf', args=[row.pk]) + f'?name={quote(filename)}'
    if not file_id:
        return JsonResponse({
            'name': filename,
            'url': local,
            'uploaded': False,
            'warning': 'Made, but not saved to the Drive — this server cannot reach it.',
        })

    row.google_id = file_id
    row.save()
    return JsonResponse({
        'google_id': file_id,
        'name': filename,
        'url': reverse('download_file', args=[file_id]),
        'uploaded': True,
    })


@login_required
def order_product_pdf(request, pk):
    """The print PDF for one line, made now and sent straight back.

    Always current, because it is made from the line's artwork as it stands,
    and it needs nothing but this server — no Drive, and no font."""
    row = get_object_or_404(OcTsgOrderBespokeImage, pk=pk)
    export = row.svg_export
    export = export.tobytes() if isinstance(export, memoryview) else export
    if isinstance(export, str):
        export = export.encode('utf-8')
    if not export or b'<svg' not in export:
        return HttpResponseServerError('This line has no artwork.')

    name = _pdf_filename(request.GET.get('name'), f'{row.order_product.order_id}-{row.pk}')

    # To a path, not a stream: cairosvg only needs a cffi callback when it
    # writes to a file-like object, and a venv whose cffi and libffi disagree
    # fails there while every other conversion carries on working.
    handle, tmp_path = tempfile.mkstemp(suffix='.pdf', dir=settings.REPORT_PATH_CACHE)
    os.close(handle)
    try:
        svg2pdf(bytestring=clean_svg_bytes(export), write_to=tmp_path)
        with open(tmp_path, 'rb') as made:
            pdf = made.read()
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return FileResponse(BytesIO(pdf), as_attachment=True, filename=name,
                        content_type='application/pdf')


def _googledrive_upload(filename):

    fileid = '';

    try:
        # create drive api client
        service = _google_auth()
        pdf_filename = os.path.join(settings.REPORT_PATH_CACHE, filename)
        file_metadata = {"name": filename, "mimeType": "application/pdf", "parents": [settings.GDRIVE_BESPOKE_FOLDER]}

        media = MediaFileUpload(pdf_filename, mimetype="application/pdf")
        # pylint: disable=maybe-no-member
        file = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id")
            .execute()
        )
        fileid = file.get("id")
        #now delete the temp file
        #os.remove(pdf_filename)


    except HttpError as error:
        file = None
        fileid = ''

    return fileid


def _convert_svg_to_pdf(svg_bytes, pdf_filename):
    #add the tmp path to the filename


    tmp_filename = os.path.join(settings.REPORT_PATH_CACHE, pdf_filename)

    # If svg_bytes is a string (not bytes), encode it
    if isinstance(svg_bytes, str):
        svg_bytes = svg_bytes.encode('utf-8')

    try:
        # Fix common font fallback issues
        #logger.info('svg_bytes before: {}'.format(svg_bytes))

        """svg_bytes = svg_bytes.replace(
            b'font-family="Arial-BoldMT, Arial, sans-serif"',
            b'font-family="Arial" font-weight="bold"'
        )
        svg_bytes = re.sub(
            rb'\s+(family|size|weight|anchor)="[^"]+"', b'', svg_bytes
        )
        svg_bytes = svg_bytes.strip()
        """


        cleaned_svg = clean_svg_bytes(svg_bytes)
        #logger.info('svg_bytes after: {}'.format(cleaned_svg))
        svg2pdf(bytestring=cleaned_svg, write_to=tmp_filename)

        if os.path.exists(tmp_filename):
            return True
        else:
            return False
    except Exception as e:
        # Optional: log the error
        print(f"Error converting SVG to PDF: {e}")
        return False

    #svg_string = json.loads(svg_bytes)
    #svg_string = svg_bytes
    #svg2pdf(bytestring=svg_string, write_to=tmp_filename)
   # tmp = json.dumps(svg_bytes)
    #now check the file exists
    #if os.path.exists(tmp_filename):
    #    return True
    #else:
    #    return False
        

def download_google_drive_file(request, file_id):
    """Download a file from Google Drive using its file ID.
    
    Args:
        request: The HTTP request
        file_id: The Google Drive file ID
        
    Returns:
        HttpResponse with the file content or error response
    """
    try:
        # create drive api client
        service = _google_auth()
        
        # Get the file metadata first to get the filename
        file_metadata = service.files().get(fileId=file_id, fields="name").execute()
        filename = file_metadata.get('name', 'download.pdf')
        
        # Download the file content
        request = service.files().get_media(fileId=file_id)
        file_content = request.execute()

        # Create the response with the file content
        response = HttpResponse(file_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response

    except HttpError as error:
        return HttpResponseServerError(f"Error downloading file: {str(error)}")

def download_svg_file(request, pk):
    """Download SVG file for a bespoke product."""

    
    bespoke_obj = get_object_or_404(OcTsgOrderBespokeImage, pk=pk)
    raw_svg = bespoke_obj.svg_export
    
    if not raw_svg:
        return HttpResponseServerError("No SVG content available")

    try:
        # Convert bytes to string and parse JSON
        if isinstance(raw_svg, bytes):
            raw_svg = raw_svg.decode('utf-8')
        
        # Remove any JSON string encoding
        #decoded_svg = json.loads(raw_svg)
        decoded_svg = raw_svg
        
        # Add SVG header if needed
        if not decoded_svg.startswith('<?xml'):
            svg_header = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n'
            if not decoded_svg.startswith('<svg'):
                svg_header += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'
                decoded_svg = svg_header + decoded_svg + '</svg>'
            else:
                decoded_svg = svg_header + decoded_svg
                
    except Exception as e:
        return HttpResponseServerError(f"Error processing SVG: {str(e)}")
    
    filename = f"bespoke-{bespoke_obj.order_product.order.store.prefix}-{bespoke_obj.order_product.order.order_id}-{pk}.svg"
    
    response = HttpResponse(decoded_svg, content_type='image/svg+xml')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response


def test_write_permission(directory):
    # Create a temporary file name
    test_file_path = os.path.join(directory, 'test_write_permission.txt')

    try:
        # Try to write to the file
        with open(test_file_path, 'w') as test_file:
            test_file.write('This is a test file to check write permissions.')

        # If successful, return True
        return True
    except Exception as e:
        # If an error occurs, print the error and return False
        print(f'Error writing to file: {e}')
        return False
    finally:
        # Clean up by removing the test file if it was created
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

def test_write(request):
    directory_to_test = settings.REPORT_PATH_CACHE
    #directory_to_test = '/path/to/your/tmp_directory'  # Update this path
    if test_write_permission(directory_to_test):
        return JsonResponse({'message': 'Write permission is granted.', 'directory': directory_to_test})
    else:
        return JsonResponse({'message': 'Write permission is denied.', 'directory': directory_to_test})


def clean_svg_bytes(svg_bytes):
    # Parse the SVG from bytes
    parser = etree.XMLParser(remove_comments=True)
    tree = etree.parse(BytesIO(svg_bytes), parser)
    root = tree.getroot()

    # Strip invalid attributes from all elements
    for elem in root.iter():
        for attr in ['family', 'size', 'weight', 'anchor']:
            if attr in elem.attrib:
                del elem.attrib[attr]

        # Fix font-family
        if "font-family" in elem.attrib and "Arial-BoldMT" in elem.attrib["font-family"]:
            elem.attrib["font-family"] = "Arial"
            elem.attrib["font-weight"] = "bold"

    # Return cleaned SVG as bytes
    return etree.tostring(tree, pretty_print=True, xml_declaration=True, encoding="UTF-8")

# ── The drawer: signs drawn in Medusa that belong to nobody ──────────────────
#
# Everything else hangs off a product, a basket line or an order line. This is
# somewhere to just draw a sign — for a customer who rang, for a quote, or to
# try a layout — and keep it.

from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.utils.text import get_valid_filename
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.templatetags.static import static
from medusa.decorators import group_required
from apps.bespoke.models import OcTsgBespokeDesigns as Design
from apps.recreate import services as recreate_services

DESIGN_STAFF = ('superuser', 'sales', 'webmaster')
MAX_DESIGN_BYTES = 5_000_000


def design_view(view):
    return login_required(group_required(*DESIGN_STAFF)(view))


@design_view
def design_list(request):
    rows = list(Design.objects.all())
    who = {u.pk: (u.get_full_name() or u.username) for u in User.objects.all()}
    for row in rows:
        row.drawn_by = who.get(row.created_by_id, '')
    context = {'heading': 'Sign drawer', 'designs': rows, 'kinds': Design.KINDS}
    return render(request, 'bespoke/design_list.html', context)


@require_POST
@design_view
def design_create(request):
    """Start a new sign of the chosen kind and open it."""
    kind = request.POST.get('kind')
    if kind not in Design.KINDS:
        kind = 'standard'
    row = Design.objects.create(
        name=(request.POST.get('name') or '').strip()[:160] or 'Untitled sign',
        kind=kind,
        created_by_id=request.user.id,
    )
    return redirect('design-edit', design_id=row.pk)


@design_view
def design_edit(request, design_id):
    row = get_object_or_404(Design, pk=design_id)
    context = {
        'heading': row.name or f'Design {row.pk}',
        'breadcrumbs': [{'name': 'Sign drawer', 'url': reverse('design-list')}],
        'design': row,
        'frame_url': reverse('design-frame', kwargs={'design_id': row.pk}),
        'save_url': reverse('design-save', kwargs={'design_id': row.pk}),
        'svg_url': reverse('design-svg', kwargs={'design_id': row.pk}),
        'pdf_url': reverse('design-pdf', kwargs={'design_id': row.pk}),
    }
    return render(request, 'bespoke/design_edit.html', context)


@xframe_options_sameorigin
@design_view
def design_frame(request, design_id):
    """The designer itself, in an iframe, opened on this design."""
    row = get_object_or_404(Design, pk=design_id)
    saved = None
    if row.design:
        try:
            saved = json.loads(row.design)
        except ValueError:
            saved = None
    config = {
        'dataUrl': request.build_absolute_uri(
            reverse('recreate-feed', args=['NAME'])).replace('NAME', '{name}'),
        'suggestUrl': None,
        'translateUrl': None,
        'assetBase': static('recreate/designer/'),
        # No shop page here, so the designer offers its own catalogue sizes --
        # but there is no basket to put the sign in either.
        'noBasket': True,
        'product': {'kind': row.kind, 'heading': row.name or 'Sign'},
    }
    if saved:
        config['open'] = {'productName': row.name or 'Sign', 'size': None, 'design': saved}
    return render(request, 'recreate/frame.html', {'config': config})


@require_POST
@design_view
def design_save(request, design_id):
    row = get_object_or_404(Design, pk=design_id)
    if len(request.body) > MAX_DESIGN_BYTES:
        return JsonResponse({'error': 'Design too large'}, status=413)
    try:
        body = json.loads(request.body)
    except ValueError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    design = body.get('svg_json')
    if isinstance(design, str):
        try:
            design = json.loads(design)
        except ValueError:
            design = None
    if not isinstance(design, dict) or (design.get('root') or {}).get('role') != 'sign':
        return JsonResponse({'error': 'Not a sign design'}, status=400)

    export = body.get('svg_export') or ''
    if '<svg' not in export:
        return JsonResponse({'error': 'No print artwork in that save'}, status=400)

    name = (body.get('name') or '').strip()[:160]
    if name:
        row.name = name
    row.design = json.dumps(design, ensure_ascii=False)
    row.svg_raw = body.get('svg_raw') or None
    row.svg_export = export.encode('utf-8')
    root = design.get('root') or {}
    row.width = root.get('width') or None
    row.height = root.get('height') or None
    row.save()
    return JsonResponse({'ok': True, 'name': row.name, 'size': row.size_label})


@require_POST
@design_view
def design_delete(request, design_id):
    """Bin a sign nobody needs. Nothing else points at these, so it just goes."""
    row = get_object_or_404(Design, pk=design_id)
    name = row.name or f'Design {row.pk}'
    row.delete()
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'ok': True, 'name': name})
    return redirect('design-list')


def _design_filename(row, asked, extension):
    stem = get_valid_filename((asked or row.name or f'design-{row.pk}').strip()) or f'design-{row.pk}'
    return f'{stem[:80]}.{extension}'


@design_view
def design_svg(request, design_id):
    """The sign as it looks, for dropping into a quote or an email."""
    row = get_object_or_404(Design, pk=design_id)
    svg = row.svg_raw or _export_text(row)
    if not svg or '<svg' not in svg:
        return HttpResponseServerError('This design has no artwork yet.')
    return FileResponse(BytesIO(svg.encode('utf-8')), as_attachment=True,
                        filename=_design_filename(row, request.GET.get('name'), 'svg'),
                        content_type='image/svg+xml')


@design_view
def design_pdf(request, design_id):
    """The print file, made now from the design as it stands."""
    row = get_object_or_404(Design, pk=design_id)
    export = _export_text(row)
    if not export or '<svg' not in export:
        return HttpResponseServerError('This design has no artwork yet.')
    return _pdf_response(export.encode('utf-8'), _design_filename(row, request.GET.get('name'), 'pdf'))


def _export_text(row):
    """svg_export, whichever way the driver hands it back."""
    export = row.svg_export
    if isinstance(export, memoryview):
        export = export.tobytes()
    if isinstance(export, bytes):
        return export.decode('utf-8', 'replace')
    return export or ''


def _pdf_response(svg_bytes, filename):
    """SVG to PDF and straight back, the same way an order line's print file is made."""
    handle, tmp_path = tempfile.mkstemp(suffix='.pdf', dir=settings.REPORT_PATH_CACHE)
    os.close(handle)
    try:
        svg2pdf(bytestring=clean_svg_bytes(svg_bytes), write_to=tmp_path)
        with open(tmp_path, 'rb') as made:
            pdf = made.read()
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
    return FileResponse(BytesIO(pdf), as_attachment=True, filename=filename,
                        content_type='application/pdf')
