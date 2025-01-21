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

from apps.orders.models import OcOrder, OcOrderProduct, OcTsgOrderBespokeImage
from cairosvg import svg2pdf
import json
from django.views.decorators.csrf import csrf_exempt


def _google_auth():
    SCOPES = ['https://www.googleapis.com/auth/drive']
    SCOPES = ["https://www.googleapis.com/auth/drive.file"]
    creds = None

    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
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
    creds = _google_auth()
    fileid = '';

    try:
        # create drive api client
        service = build("drive", "v3", credentials=creds)
        pdf_filename = os.path.join(settings.BESPOKE_TMP_PATH, filename)
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
        os.remove(pdf_filename)


    except HttpError as error:
        file = None
        fileid = ''

    return fileid


def _convert_svg_to_pdf(svg_bytes, pdf_filename):
    #add the tmp path to the filename
    tmp_filename = os.path.join(settings.BESPOKE_TMP_PATH, pdf_filename)
    svg_string = json.loads(svg_bytes)
    svg2pdf(bytestring=svg_string, write_to=tmp_filename)
   # tmp = json.dumps(svg_bytes)
    #now check the file exists
    if os.path.exists(tmp_filename):
        return True
    else:
        return False

