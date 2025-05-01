from django.shortcuts import render
import os.path
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from lxml import etree
from io import BytesIO
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

def convert_order_product(request, pk):
    return render(request, 'convert_order_product.html')


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
        logger.info('svg_bytes before: {}'.format(svg_bytes))

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
        logger.info('svg_bytes after: {}'.format(cleaned_svg))
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