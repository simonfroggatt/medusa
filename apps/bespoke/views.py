from django.shortcuts import render
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from django.conf import settings
from django.http import JsonResponse

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
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        pdf_filename = os.path.join(project_root, settings.BESPOKE_TMP_PATH, filename)

        file_metadata = {"name": filename, "mimeType": "application/pdf", "parents": [settings.GDRIVE_BESPOKE_FOLDER]}
        #file_metadata = {"name": filename, "mimeType": "application/pdf"}

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
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    tmp_filename = os.path.join(project_root, settings.BESPOKE_TMP_PATH, pdf_filename)
    svg_string = json.loads(svg_bytes)
    svg2pdf(bytestring=svg_string, write_to=tmp_filename)
   # tmp = json.dumps(svg_bytes)
    #now check the file exists
    if os.path.exists(tmp_filename):
        return True
    else:
        return False


def get_last_five_files(service):
    # Query to get the last 5 files ordered by created time
    query = "trashed = false"  # Exclude trashed files
    results = service.files().list(
        q=query,
        orderBy='createdTime desc',
        pageSize=5,
        fields="files(id, name, createdTime)"
    ).execute()

    items = results.get('files', [])

    return items



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
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    directory_to_test = os.path.join(project_root, settings.BESPOKE_TMP_PATH)
    #directory_to_test = '/path/to/your/tmp_directory'  # Update this path
    if test_write_permission(directory_to_test):
        return JsonResponse({'message': 'Write permission is granted.'})
    else:
        return JsonResponse({'message': 'Write permission is denied.'})