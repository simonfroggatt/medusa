from django.shortcuts import render
from apps.orders.models import OcOrder
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from apps.templating.models import OcTsgTemplates
# Create your views here.


def customer_invoice(request, order_id):
    template_name = 'emails/customer_invoice.html'
    enum_type = 'TEMPLATE_CUSTOMER_INVOICE'
    data = dict()
    data['html_form'] = load_email_template(request, order_id, enum_type, template_name)
    return JsonResponse(data)

def customer_proforma(request, order_id):
    template_name = 'emails/customer_proforma.html'
    enum_type = 'TEMPLATE_CUSTOMER_PROFORMA'
    data = dict()
    data['html_form'] = load_email_template(request, order_id, enum_type, template_name)
    return JsonResponse(data)

def customer_tracking(request, order_id):
    template_name = 'emails/customer_tracking.html'
    enum_type = 'TEMPLATE_CUSTOMER_TRACKING'
    data = dict()
    data['html_form'] = load_email_template(request, order_id, enum_type, template_name)
    return JsonResponse(data)


def customer_failed_payment(request, order_id):
    template_name = 'emails/customer_failed.html'
    enum_type = 'TEMPLATE_CUSTOMER_FAILED'
    data = dict()
    data['html_form'] = load_email_template(request, order_id, enum_type, template_name)
    return JsonResponse(data)

def load_email_template(request, order_id, email_enum, template_name):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    to_email = order_obj.payment_email
    store_obj = order_obj.store

    context = {'order_obj': order_obj}
    context['email_to'] = to_email
    context['email_from'] = store_obj.accounts_email_address

    # now get the template stuff
    template_obj = OcTsgTemplates.objects.filter(store_id=store_obj.store_id,
                                                 template_type__enum_val=email_enum).first()
    template_raw_header = template_obj.header

    fullname = order_obj.payment_fullname
    firstname = fullname.split(' ')[0]

    replacements = {
        '{{order_number}}': f"{store_obj.prefix}-{order_obj.order_id}",
        '{{store_name}}': store_obj.name,
        '{{firstname}}': firstname,  # example of adding more replacements
        '{{order_date}}': order_obj.date_added.strftime('%Y-%m-%d'),
        '{{accounts_email}}': store_obj.accounts_email_address,
        '{{store_email_footer}}': store_obj.email_footer_text,
        '{{payment_link}}': '',
    }
    template_header = apply_template_replacements(template_raw_header, replacements)

    template_content_raw = template_obj.main
    template_content = apply_template_replacements(template_content_raw, replacements)

    context['email_subject'] = template_header
    context['email_content'] = template_content
    data =  render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return data


def apply_template_replacements(template_string, replacements):
    """
    Apply multiple replacements to a template string using a dictionary of replacements.
    
    Args:
        template_string (str): The template string containing placeholders
        replacements (dict): Dictionary of placeholder:value pairs
        
    Returns:
        str: The template with all replacements applied
    """
    result = template_string
    for placeholder, value in replacements.items():
        result = result.replace(placeholder, str(value))
    return result