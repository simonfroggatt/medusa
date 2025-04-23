
from sqlparse import split

from apps.orders.models import OcOrder, OcTsgOrderShipment
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from apps.templating.models import OcTsgTemplates
from apps.shipping.models import OcTsgCourier
from django.conf import settings
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from django.core.mail import EmailMessage
import base64
import os
from apps.paperwork.views import gen_invoice_for_emails

import logging
logger = logging.getLogger('apps')


# Create your views here.


def customer_invoice(request, order_id):
    enum_type = 'TEMPLATE_CUSTOMER_INVOICE'
    template_title = 'Customer Invoice Copy'
    data = dict()
    data['html_form'] = load_email_template(request, order_id, enum_type, template_title)
    return JsonResponse(data)

def customer_proforma(request, order_id):
    enum_type = 'TEMPLATE_CUSTOMER_PROFORMA'
    template_title = 'Customer Proforma'
    data = dict()
    data['html_form'] = load_email_template(request, order_id, enum_type, template_title)
    return JsonResponse(data)

def customer_tracking(request, order_id):
    enum_type = 'TEMPLATE_CUSTOMER_TRACKING'
    template_title = 'Send Customer Tracking'
    data = dict()
    shipping_obj = OcTsgOrderShipment.objects.filter(order_id=order_id).order_by('-date_added').first()
    if not shipping_obj:
        data['html_form'] = "No shipping information available"
        data['error'] = "No shipping information available"
        return JsonResponse(data)

    tracking_number = shipping_obj.tracking_number
    courier_obj = get_object_or_404(OcTsgCourier, pk=shipping_obj.shipping_courier_id)
    courier_name = courier_obj.courier_title
    tracking_url = courier_obj.courier_tracking_url
    courier_email_img = f"{settings.MEDIA_URL}{courier_obj.courier_email_image.name}"

    additional_replacements = {
        '{{tracking_number}}': tracking_number,
        '{{courier_name}}': courier_name,
        '{{tracking_url}}': tracking_url,
        '{{courier_email_img}}': courier_email_img,
    }


    data['html_form'] = load_email_template(request, order_id, enum_type, template_title, additional_replacements)
    return JsonResponse(data)


def customer_failed_payment(request, order_id):
    enum_type = 'TEMPLATE_CUSTOMER_FAILED'
    template_title = 'Customer FAILED Order'
    data = dict()

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    store_obj = order_obj.store

    failed_link_raw = '{{store_website}}/index.php?route=extension/payment/tsg_stripe/paymentfailed&order_id={{order_id}}&order_hash={{order_hash}}'
    replacements = {
        '{{store_website}}': store_obj.website,
        '{{order_id}}': order_id,
        '{{order_hash}}': order_obj.order_hash,
    }

    failed_link = apply_template_replacements(failed_link_raw, replacements)
    replacements = { '{{payment_link}}' : failed_link}

    data['html_form'] = load_email_template(request, order_id, enum_type, template_title, replacements)
    return JsonResponse(data)



def load_email_template(request, order_id, email_enum, template_title, additional_replacements=None):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    to_email = order_obj.payment_email
    store_obj = order_obj.store
    template_name = 'emails/customer_email_template.html'

    context = {'order_obj': order_obj}
    context['email_to'] = to_email
    context['email_from'] = store_obj.accounts_email_address
    context['email_template_title'] = template_title
    context['enum_type'] = email_enum

    # now get the template stuff
    template_obj = OcTsgTemplates.objects.filter(store_id=store_obj.store_id,
                                                 template_type__enum_val=email_enum).first()
    template_raw_header = template_obj.subject

    fullname = order_obj.payment_fullname
    firstname = fullname.split(' ')[0]

    replacements = {
        '{{order_number}}': f"{store_obj.prefix}-{order_obj.order_id}",
        '{{store_name}}': store_obj.name,
        '{{store_website}}': store_obj.website,
        '{{company_name}}': store_obj.company_name,
        '{{firstname}}': firstname,  # example of adding more replacements
        '{{order_date}}': order_obj.date_added.strftime('%Y-%m-%d'),
        '{{accounts_email}}': store_obj.accounts_email_address,
        '{{store_address}}': store_obj.address,
        '{{sales_email}}': store_obj.email_address
    }

    # Merge additional replacements if provided
    if additional_replacements:
        replacements.update(additional_replacements)

    template_header = apply_template_replacements(template_raw_header, replacements)
    template_footer = apply_template_replacements(store_obj.email_footer_text, replacements)
    replacements['{{store_email_footer}}'] = template_footer
    template_content = apply_template_replacements(template_obj.main, replacements)

    context['email_subject'] = template_header
    context['email_content'] = template_content
    data =  render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return data


def apply_template_replacements(template_string, replacements):
    result = template_string
    for placeholder, value in replacements.items():
        result = result.replace(placeholder, str(value))
    return result


def send_customer_email(request):
    if request.method == 'POST':
        order_id = request.POST['order_id']
        email_to = request.POST['email_address']
        email_from = request.POST['email_address_reply']
        email_subject = request.POST['email_subject']
        email_content = request.POST['email_message']
        enum_type = request.POST['enum_type']

        order_obj = get_object_or_404(OcOrder, pk=order_id)
        store_obj = order_obj.store

        attachments = []
        #depending on the email type, we may need to add attachments
        if enum_type == 'TEMPLATE_CUSTOMER_INVOICE':
            invoice_pdf = gen_invoice_for_emails(order_id)
            if invoice_pdf:
                pdf_filename = f'{store_obj.prefix}-{order_obj.order_id}-invoice.pdf'
                attachments.append((pdf_filename, invoice_pdf, 'application/pdf'))

        #convert the email to a list
        email_to = [email_to]

        # Format the from_email with a display name
        from_email_with_name = f"Total Safety Group <{email_from}>"

        send_status = send_email(email_to, email_from, email_subject, email_content, attachments)
        data = dict()
        if send_status['success']:
            data['message'] = 'Email sent successfully'
            data['success'] = True
            return JsonResponse(data)
        else:
            data['message'] = f'Email failed to send: {send_status["message"]}'
            data['success'] = False
            return JsonResponse(data)


def send_email(email_to, email_from, email_subject, email_content, attachments=None):
    load_dotenv()

    SCOPES = ['https://www.googleapis.com/auth/gmail.send']

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    # service_account_file = os.path.join(project_root, 'ssan-bespoke-95dbf1ea28e6.json')
    SERVICE_ACCOUNT_FILE = os.path.join(project_root, 'medusa-gmail-442210-6eee10050ccf.json')

    logger.debug(f"SERVICE_ACCOUNT_FILE information = {SERVICE_ACCOUNT_FILE}")

   # SERVICE_ACCOUNT_FILE = os.path.join(settings.BASE_DIR, "medusa-gmail-442210-6eee10050ccf.json")

    credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    delegated_credentials = credentials.with_subject(email_from)

    # Format the from_email with a display name

    data = dict()
    try:
        service = build('gmail', 'v1', credentials=delegated_credentials)
        email = EmailMessage(
            subject=email_subject,
            body=email_content,
            from_email=email_from,  # Use the formatted from_email
            to=email_to,
        )
        # Set the content type to HTML
        email.content_subtype = "html"

        # Add any attachments
        if attachments:
            for filename, content, mimetype in attachments:
                email.attach(filename, content, mimetype)


        # encoded message
        message = email.message()
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {"raw": encoded_message}
        # pylint: disable=E1101
        send_message = (
            service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
        data['success'] = True
        data['message'] = 'Email sent successfully'
    except HttpError as error:
        data['success'] = False
        data['message'] = error.reason

    return data


def send_invoice_email(order_id, to_email):
    enum_type = 'TEMPLATE_CUSTOMER_INVOICE'
    data = dict()

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    store_obj = order_obj.store
    email_from = store_obj.accounts_email_address

    replacements = {
        '{{payment_link}}': '',
    }

    email_data = _setup_medusa_email(order_id, enum_type, replacements)
    mail_to_list = [to_email]

    attachments = []
    # get the invoice

    invoice_pdf = gen_invoice_for_emails(order_id)
    if invoice_pdf:
        pdf_filename = f'{store_obj.prefix}-{order_obj.order_id}-invoice.pdf'
        attachments.append((pdf_filename, invoice_pdf, 'application/pdf'))



    send_status = send_email(mail_to_list, email_from, email_data['subject'], email_data['body'], attachments)
    data = dict()
    if send_status['success']:
        data['message'] = 'Email sent successfully'
        data['success'] = True
        return JsonResponse(data)
    else:
        data['message'] = f'Email failed to send: {send_status["message"]}'
        data['success'] = False
        return JsonResponse(data)


def send_shipped_email(order_id, to_email):
    enum_type = 'TEMPLATE_CUSTOMER_TRACKING'
    data = dict()

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    store_obj = order_obj.store
    email_from = store_obj.accounts_email_address

    shipping_obj = OcTsgOrderShipment.objects.filter(order_id=order_id).order_by('-date_added').first()
    if not shipping_obj:
        data['html_form'] = "No shipping information available"
        data['error'] = "No shipping information available"
        return JsonResponse(data)

    tracking_number = shipping_obj.tracking_number
    courier_obj = get_object_or_404(OcTsgCourier, pk=shipping_obj.shipping_courier_id)
    courier_name = courier_obj.courier_title
    tracking_url = courier_obj.courier_tracking_url
    courier_email_img = f"{settings.MEDIA_URL}{courier_obj.courier_email_image.name}"

    replacements = {
        '{{tracking_number}}': tracking_number,
        '{{courier_name}}': courier_name,
        '{{tracking_url}}': tracking_url,
        '{{courier_email_img}}': courier_email_img,
    }

    email_data = _setup_medusa_email(order_id, enum_type, replacements)
    mail_to_list = [to_email]
    attachments = []
    send_status = send_email(mail_to_list, email_from, email_data['subject'], email_data['body'], attachments)
    data = dict()
    if send_status['success']:
        data['message'] = 'Email sent successfully'
        data['success'] = True
        return JsonResponse(data)
    else:
        data['message'] = f'Email failed to send: {send_status["message"]}'
        data['success'] = False
        return JsonResponse(data)

def _setup_medusa_email(order_id, enum_type, additional_replacements=None):
    data = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    store_obj = order_obj.store

    template_obj = OcTsgTemplates.objects.filter(store_id=store_obj.store_id,
                                                 template_type__enum_val=enum_type).first()

    template_raw_header = template_obj.subject
    template_content_raw = template_obj.main
    template_footer_raw = store_obj.email_footer_text

    fullname = order_obj.payment_fullname
    firstname = fullname.split(' ')[0]

    replacements = {
        '{{order_number}}': f"{store_obj.prefix}-{order_obj.order_id}",
        '{{store_name}}': store_obj.name,
        '{{store_website}}': store_obj.website,
        '{{company_name}}': store_obj.company_name,
        '{{firstname}}': firstname,  # example of adding more replacements
        '{{order_date}}': order_obj.date_added.strftime('%Y-%m-%d'),
        '{{accounts_email}}': store_obj.accounts_email_address,
        '{{store_address}}': store_obj.address,
        '{{sales_email}}': store_obj.email_address
    }

    # Merge additional replacements if provided
    if additional_replacements:
        replacements.update(additional_replacements)

    template_header = apply_template_replacements(template_raw_header, replacements)
    template_footer = apply_template_replacements(template_footer_raw, replacements)
    replacements['{{store_email_footer}}'] = template_footer
    template_content = apply_template_replacements(template_content_raw, replacements)


    data = {'subject': template_header, 'body': template_content}
    return data

