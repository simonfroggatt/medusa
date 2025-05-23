import logging
import os
from django.shortcuts import render, get_object_or_404
import apps.xero_api.config as xero_config
from django.contrib import messages
from django.template.loader import render_to_string

from django.conf import settings
import apps.xero_api.config as xeromanager_constants
from apps.xero_api.xero_objects.contact import XeroContact
from apps.xero_api.xero_objects.xero_base import XeroItem
from apps.xero_api.xero_objects.invoices import XeroInvoice
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse
from cryptography.fernet import Fernet
from nameparser import HumanName

from apps.orders.models import OcOrder, OcOrderTotal, OcTsgPaymentHistory
from apps.customer.models import OcCustomer
from apps.company.models import OcTsgCompany
import threading

import json
import requests
import webbrowser
import base64
import hmac
import hashlib
import datetime
import os
from apps.xero_api.xero_auth_manager import XeroAuthManager
import base64

from collections import namedtuple

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect

import logging
logger = logging.getLogger('apps')



def XeroFirstLogin(request):
    template_name = 'xero_api/xero_onetime.html'

    auth_url = ('''https://login.xero.com/identity/connect/authorize?''' +
                '''response_type=code''' +
                '''&client_id=''' + settings.XERO_CLIENT_ID +
                '''&redirect_uri=''' + xeromanager_constants.XERO_REDIRECT_URL +
                '''&scope=''' + xeromanager_constants.XERO_SCOPES +
                '''&state=123''')

    logger.debug(auth_url)
    webbrowser.open_new(auth_url)

    return render(request, template_name)

def do_refesh_token(request):
    template_name = 'xero_api/xero_onetime.html'
    auth_code = request.GET['code']

    client_id = settings.XERO_CLIENT_ID
    client_secret = settings.XERO_CLIENT_SECRET
    redirect_uri = xeromanager_constants.XERO_REDIRECT_URL;
    code = auth_code

    # Encode credentials
    b64_creds = base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()

    response = requests.post(
        'https://identity.xero.com/connect/token',
        headers={
            'Authorization': f'Basic {b64_creds}',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri
        }
    )


    context = {}
    context['response'] = response.json()
    return render(request, template_name, context)

def xero_passback(request):
    template_name = 'xero_api/passback.html'
    #logger.debug(f"xero_passback - request = {request}")
    auth_code = request.GET['code']
    xero_auth = XeroAuthManager()
    xero_auth.xero_setup_token_info(auth_code)
    context = {}
    context['json_return'] = xero_auth.refresh_token

    return render(request, template_name, context)


def xero_tenants_check(request):
    xero_auth = XeroAuthManager()
    template_name = 'xero_api/tenant_check.html'
    tenant_id = xero_auth.tenant_id
    context = {}

    if xero_auth.get_company_name():
        xero_company_data = xero_auth.get_xero_response()
        company_data = xero_company_data['Organisations'][0]
        context = {'tenant_id': tenant_id, 'company': company_data }

    return render(request, template_name, context)


def xero_contact(request):
    #xero_auth = XeroAuthManager()
    template_name = 'xero_api/tenant_check.html'
    context = {}
    #tenant_id = xero_auth.tenant_id
    #
    #xero_auth.get_contact_details(contact_id)
    #xero_company_data = xero_auth.get_xero_response()
    #contact_data = xero_company_data['Contacts']

    contact_id = 'c6d85815-0c41-4d7d-961a-90f099d016ee'

    xero_item = XeroItem()
    tennant_id = xero_item.get_tenant_id()

    contact_obj = XeroContact()
    contact_data = contact_obj.get_contact(contact_id)

    context = {'tenant_id': tennant_id, 'contact': contact_data }

    return render(request, template_name, context)


#############################################   CUSTOMER   ########################################################

def xero_customer_add(request, contact_id, encrypted):
    data = {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(contact_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    contact_obj = get_object_or_404(OcCustomer, pk=contact_id)
    #check if the customer has had any orders that have been pushed to xero
    orders_obj = OcOrder.objects.filter(customer_id=contact_id)
    xero_order_id = ''
    if orders_obj:
        for order in orders_obj:
            if order.xero_id:
                data['xero_call_type'] = 'CUSTOMER'
                xero_contact_data = _get_order_contact_id(order)
                if xero_contact_data['status'] == 'OK':
                    data['status'] = 'OK'
                    data['contactID'] = xero_contact_data['contactID']
                    return JsonResponse(data)


    #if this contact belongs to a company then we need to be adding the company and not the contact
    if contact_obj.parent_company:
        company_obj = contact_obj.parent_company
        xero_contact_data = _create_new_company(company_obj)
    else:
        xero_contact_data = _create_new_contact(contact_obj)

    if xero_contact_data['status'] == 'OK':
        data['status'] = 'OK'
        data['contactID'] = xero_contact_data['contactID']
    else:
        data['status'] = xero_contact_data['status']
        data['error'] = xero_contact_data['error']

    data['xero_call_type'] = 'CUSTOMER'

    return JsonResponse(data)

def xero_customer_update(request, contact_id, encrypted):
    data = {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(contact_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    contact_obj = get_object_or_404(OcCustomer, pk=contact_id)
    xero_contact_data = _update_contact(contact_obj)
    if xero_contact_data['status'] == 'OK':
        data['status'] = 'OK'
        data['contactID'] = xero_contact_data['contactID']
    else:
        data['status'] = xero_contact_data['status']
        data['error'] = xero_contact_data['error']

    data['xero_call_type'] = 'CUSTOMER'
    return JsonResponse(data)


def xero_customer_account(request, contact_id, encrypted):
    data = {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(contact_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    contact_obj = get_object_or_404(OcCustomer, pk=contact_id)
    return JsonResponse(data)

def xero_add_new_contact(customer_obj, order_obj):
    contact_id = ''
    data = {}
    data['status'] = 'OK'
    customer_names = HumanName(order_obj.payment_fullname)

    xero_item = XeroItem()
    tennant_id = xero_item.get_tenant_id()

    xero_contact_obj = XeroContact()

    customer_contact = {
        'company': order_obj.payment_company,
        'firstname': customer_names.first,
        'lastname': customer_names.surnames,
        'email': order_obj.payment_email,
        'fullname': order_obj.payment_fullname
    }

    xero_contact_obj.add_contact_details(customer_contact)
    xero_contact_obj.add_telephone(order_obj.payment_telephone)

    customer_address = {
        'address_1': order_obj.payment_address_1,
        'city': order_obj.payment_city,
        'region': order_obj.payment_area,
        'postcode': order_obj.payment_postcode,
        'country' : order_obj.payment_country
    }
    xero_contact_obj.add_address(customer_address)

    #is the customer a company - set the terms
    payment_type = xero_config.CONTACT_PAYMENT_TERMS_TYPE
    payment_days = xero_config.CONTACT_PAYMENT_TERMS_DAYS

    if customer_obj.parent_company:
        company = customer_obj.parent_company
        if company.account_type_id == 3:
            payment_type = company.payment_terms.shortcode
            payment_days = company.payment_days

    xero_contact_obj.add_payment_terms(payment_type, payment_days)

    contact_id = xero_contact_obj.save_contact()
    errors = xero_contact_obj.xero_api.get_error()
    if not errors:
        customer_obj.xero_id = contact_id
        customer_obj.save()
        if customer_obj.parent_company:
            customer_obj.parent_company.xero_id = contact_id
            customer_obj.parent_company.save()
        data['status'] = 'OK'
        data['contactID'] = contact_id
    else:
        data['status'] = 'ERROR'
        data['error'] = errors

    data['xero_call_type'] = 'CUSTOMER'
    return data



#############################################   COMPANY   ########################################################


def xero_company_add(request, company_id, encrypted):
    data = {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(company_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    company_obj = get_object_or_404(OcTsgCompany, pk=company_id)
    xero_contact_data = _create_new_company(company_obj)
    if xero_contact_data['status'] == 'OK':
        data['status'] = 'OK'
        data['contactID'] = xero_contact_data['contactID']
    else:
        data['status'] = xero_contact_data['status']
        data['error'] = xero_contact_data['error']

    data['xero_call_type'] = 'COMPANY'
    return JsonResponse(data)

def xero_company_update(request, company_id, encrypted):
    data = {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(company_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    company_obj = get_object_or_404(OcTsgCompany, pk=company_id)
    xero_contact_data = _update_company(company_obj)
    if xero_contact_data['status'] == 'OK':
        data['status'] = 'OK'
        data['contactID'] = xero_contact_data['contactID']
    else:
        data['status'] = xero_contact_data['status']
        data['error'] = xero_contact_data['error']

    data['xero_call_type'] = 'COMPANY'
    return JsonResponse(data)

def xero_company_account(request, company_id, encrypted):
    data = {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(company_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    company_obj = get_object_or_404(OcTsgCompany, pk=company_id)
    xero_contact_data = _get_company_accounts(company_obj)
    if xero_contact_data['status'] == 'OK':
        data['status'] = 'OK'
        data['account_details'] = xero_contact_data['account_balance']
    else:
        data['status'] = xero_contact_data['status']
        data['error'] = xero_contact_data['error']

    data['xero_call_type'] = 'COMPANY'
    return JsonResponse(data)

def xero_company_accounts(company_id):
    data = {}
    company_obj = get_object_or_404(OcTsgCompany, pk=company_id)
    xero_contact_data = _get_company_accounts(company_obj)
    if xero_contact_data['status'] == 'OK':
        data['status'] = 'OK'
        data['account_details'] = xero_contact_data['account_balance']
    else:
        data['status'] = xero_contact_data['status']
        data['error'] = xero_contact_data['error']
        data['account_details'] = xero_contact_data['account_balance']

    data['xero_call_type'] = 'COMPANY'
    return data

#############################################   ORDER   ########################################################

@csrf_exempt
def xero_order_add(request, order_id, encrypted):
    data = {}

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    logger.debug(f'xero_order_add - start: Order payment method {order_obj.payment_method}')
    #don't do the encryption for now
    #TODO - make this more secure
    #f = Fernet(settings.XERO_TOKEN_FERNET)
    #decrypted = f.decrypt(encrypted).decode()
    #if decrypted != str(order_id):
    #    data['error'] = 'API TSG decryption failed'
    #    return JsonResponse(data)


    order_obj = get_object_or_404(OcOrder, pk=order_id)
    if order_obj.order_hash != encrypted:
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    #need to do several checks and tests

    xero_customer_data = _get_order_contact_id(order_obj)
    if xero_customer_data['status'] == 'OK':
        xero_customer_id = xero_customer_data['contactID']
        data['status'] = 'OK'
    else:
        data['status'] = xero_customer_data['status']
        data['error'] = xero_customer_data['error']
        return data

    xero_order_data = _create_new_order(order_obj, xero_customer_id)
    logger.debug(f'xero_order_add - end: Order payment method {order_obj.payment_method}')
    xero_order_data['xero_call_type'] = 'ORDER'
    return JsonResponse(xero_order_data)


def xero_order_update(request, order_id, encrypted):

    data = {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(order_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    logger.debug(f"xero_order_update payment method: {order_obj.payment_method}")
    customer_obj = order_obj.customer
    xero_customer_data = _get_order_contact_id(order_obj)
    if xero_customer_data['status'] == 'OK':
        xero_customer_id = xero_customer_data['contactID']
        data['status'] = 'OK'
    else:
        data['status'] = xero_customer_data['status']
        data['error'] = xero_customer_data['error']
        return data

    xero_order_data = _update_order(order_obj, xero_customer_id)
    if xero_order_data['status'] == 'OK':
        data['status'] = 'OK'
        data['orderID'] = xero_order_data
        data['alert'] = 'Order updated'
    else:
        data['status'] = xero_order_data['status']
        data['error'] = xero_order_data['error']

    data['xero_call_type'] = 'ORDER'

    return JsonResponse(data)


def xero_order_link(request, order_id, encrypted):
    data = {}
    context= {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(order_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    xero_id = order_obj.xero_id
    xero_order_obj = XeroInvoice()
    invoice_URL = xero_order_obj.get_order_link(xero_id)
    errors = xero_order_obj.xero_api.get_error()
    if not errors:
        data['status'] = 'OK'
        context['invoiceURL'] = invoice_URL
        template_name = 'xero_api/invoice_link.html'
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    else:
        data['status'] = 'ERROR'
        context['errors'] = errors
        template_name = 'xero_api/error_dlg.html'
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    data['xero_call_type'] = 'ORDER'
    return JsonResponse(data)


def xero_get_order_customer(request, xero_id, encrypted):
    data = {}
    context= {}
    f = Fernet(settings.XERO_TOKEN_FERNET)
    decrypted = f.decrypt(encrypted).decode()
    if decrypted != str(xero_id):
        data['error'] = 'API TSG decryption failed'
        return JsonResponse(data)

    xero_order_obj = XeroInvoice()
    xero_contact_id = xero_order_obj.get_order_contact_id(xero_id)
    errors = xero_order_obj.xero_api.get_error()
    if not errors:
        data['status'] = 'OK'
        data['customer_ref'] = xero_contact_id
    else:
        data['status'] = 'ERROR'
        context['errors'] = errors

    data['xero_call_type'] = 'ORDER'
    return data






#############################################   PRIVATE  -   ORDER   ########################################################

def _create_new_order(order_obj, customer_id, xero_id = None):
    data = {}
    logger.debug(f'_create_new_order - start: Order payment method {order_obj.payment_method}')
    xero_order_obj = XeroInvoice()

    #set the invoice details
    xero_order_obj.add_invoice_details(order_obj, customer_id)

    #add the order lines
    xero_order_obj.add_order_lines(order_obj.order_products.all())

    #add the shipping
    order_totals_obj = OcOrderTotal.objects.filter(order_id=order_obj.order_id)


    # add the discount
    discount_data = order_totals_obj.filter(code='discount')
    if discount_data:
        if discount_data[0].value > 0:
            discount_line = {
                'quantity': 1,
                'price': discount_data[0].value * -1,
                'description': 'Discount',
                'account_code': xero_config.ACCOUNT_CODE_SALES
            }
            xero_order_obj.add_line(discount_line)

    shipping_data = order_totals_obj.filter(code='shipping')
    if shipping_data:
        shipping_line = {
            'quantity': 1,
            'price': shipping_data[0].value,
            'description': 'Shipping on order: ' +shipping_data[0].title,
            'account_code': xero_config.ACCOUNT_CODE_SHIPPING
        }
        xero_order_obj.add_line(shipping_line)

    #save the invoice
    #if we havw an existing xero_id then update the invoice
    if xero_id:
        xero_order_obj.set_existing_id(xero_id)
    new_xero_invoice_id = xero_order_obj.save_invoice()
    errors = xero_order_obj.xero_api.get_error()
    if not errors:
        order_obj.xero_id = new_xero_invoice_id
        logger.debug(f'_create_new_order - before save: Order payment method {order_obj.payment_method}')
        order_obj.save()
        logger.debug(f'_create_new_order - after save: Order payment method {order_obj.payment_method}')
        #now check for rounding
        data['status'] = 'OK'
        data['orderID'] = new_xero_invoice_id

#fix and rounding errors between wedbiste and xero
        bl_fixed = _xero_invoice_check_rounding(order_obj, xero_order_obj)
        if bl_fixed['status'] == 'OK':
            data['status'] = 'OK'
        else:
            data['status'] = 'ERROR'
            data['error'] = bl_fixed['errors']

        if order_obj.payment_status_id == 2:
            xero_order_obj.add_invoice_payment(order_obj)
            payment_id = xero_order_obj.create_payment()
            errors = xero_order_obj.xero_api.get_error()
            if errors:
                data['status'] = 'ERROR'
                data['error'] = errors
            else:
                data['paymentID'] = payment_id

    else:
        data['status'] = 'ERROR'
        data['error'] = errors

    return data

def _update_order(order_obj, customer_id):
    order_id = order_obj.xero_id
    data = _create_new_order(order_obj, customer_id, order_id)
    return data

    #check the totals and add a rounding if needed

def _xero_invoice_check_rounding(order_obj, xero_order_obj):
    data = {}
    order_totals_obj = OcOrderTotal.objects.filter(order_id=order_obj.order_id)
    order_total = order_totals_obj.filter(code='total')
    xero_total = xero_order_obj.get_total()

    order_total_value = order_total[0].value
    if order_total_value != xero_total:
        rounding = order_total_value - xero_total
        rounding_line = {
            'quantity': 1,
            'price': rounding,
            'description': 'Rounding',
            'account_code': xero_config.ACCOUNT_CODE_ROUNDING
        }
        #logger.debug('rounding line: ' + str(rounding_line))
        xero_order_obj.add_line(rounding_line)
        xero_order_obj.save_invoice()
        errors = xero_order_obj.xero_api.get_error()
        if errors:
            data['status'] = 'ERROR'
            data['error'] = errors
        else:
            data['status'] = 'OK'
    else:
        data['status'] = 'OK'
    return data

def _get_order_contact_id(order_obj):
    data = {}
    data['status'] = 'OK'
    contact_id = None
    data['contactID'] = None

    #does this order have a customer or is it a guest checkout
    #logger.debug(f"in _get_order_contact_id")
    if order_obj.customer:
        #logger.info(f"in _get_order_contact_id - there is a customer")
        if order_obj.customer.xero_id:
            #logger.debug(f"in _get_order_contact_id XERO_ID = {order_obj.customer.xero_id}")
            contact_id = order_obj.customer.xero_id
        else:
            #logger.info(f"in _get_order_contact_id no XERO_ID")
            if order_obj.customer.parent_company:
                if order_obj.customer.parent_company.xero_id:
                    contact_id = order_obj.customer.parent_company.xero_id
                else:
                    return_contact = _create_new_company(order_obj.customer.parent_company)
                    if return_contact['status'] == 'OK':
                        contact_id = return_contact['contactID']
                        data['status'] = 'OK'
                    else:
                        data['status'] = return_contact['status']
                        data['error'] = return_contact['error']
            else:
                #logger.info(f"in _get_order_contact_id no parent company, so adding a new contact")
                #logger.debug(f"in _get_order_contact_id customer = {order_obj.customer}")
                return_contact = _create_new_contact(order_obj.customer)
                if return_contact['status'] == 'OK':
                    contact_id = return_contact['contactID']
                    data['status'] = 'OK'
                else:
                    data['status'] = return_contact['status']
                    data['error'] = return_contact['error']
    else:
        #there is no customer associated with this order
        # Define namedtuple classes
        CustomerDetail = namedtuple('CustomerDetail', 'company firstname lastname email fullname telephone')
        CustomerAddress = namedtuple('CustomerAddress', 'address_1 city area postcode country')

        # Create instances using the constructor
        customer_details_obj = CustomerDetail(
            company=order_obj.payment_company,
            firstname=order_obj.payment_firstname,
            lastname=order_obj.payment_lastname,
            email=order_obj.payment_email,
            fullname=order_obj.payment_fullname,
            telephone=order_obj.payment_telephone
        )

        customer_address_obj = CustomerAddress(
            address_1=order_obj.payment_address_1,
            city=order_obj.payment_city,
            area=order_obj.payment_area,
            postcode=order_obj.payment_postcode,
            country=order_obj.payment_country
        )

        #logger.debug(f"in _get_order_contact_id - customer_details_obj = {customer_details_obj}")
        #logger.debug(f"in _get_order_contact_id - customer_address_obj = {customer_address_obj}")

        return_contact = _create_new_contact(customer_details_obj, None, customer_address_obj, True)
        if return_contact['status'] == 'OK':
            contact_id = return_contact['contactID']
            data['status'] = 'OK'
        else:
            data['status'] = return_contact['status']
            data['error'] = return_contact['error']

    data['contactID'] = contact_id
    return data

#############################################   PRIVATE  -   CONTACT   ########################################################

def _create_new_contact(customer_obj, xero_id = None, billing_address_guest = None, guest_customer = False):
    contact_id = ''
    data = {}

    data['status'] = 'OK'
    customer_names = HumanName(customer_obj.fullname)
    #logger.debug(f"in _create_new_contact - customer_obj = {customer_obj}")
    #logger.debug(f"in billing_address_guest - customer_obj = {billing_address_guest}")
    #logger.debug(f"guestCustoemr = {guest_customer}")

   # xero_item = XeroItem()
    # tennant_id = xero_item.get_tenant_id()

    xero_contact_obj = XeroContact()

    customer_contact = {
        'company': customer_obj.company,
        'firstname': customer_names.first,
        'lastname': customer_names.surnames,
        'email': customer_obj.email,
        'fullname': customer_obj.fullname
    }

    xero_contact_obj.add_contact_details(customer_contact)
    xero_contact_obj.add_telephone(customer_obj.telephone)

    if guest_customer:
        billing_address = billing_address_guest
    else:
        if customer_obj.address_customer:
            def_billing = customer_obj.address_customer.filter(default_billing=1).order_by('address_id').first()
            if def_billing is None:
                billing_address = customer_obj.address_customer.order_by('address_id').first()
            else:
                billing_address = def_billing



    customer_address = {
        'address_1': billing_address.address_1,
        'city': billing_address.city,
        'region': billing_address.area,
        'postcode': billing_address.postcode,
        'country' : billing_address.country
    }
    xero_contact_obj.add_address(customer_address)

    #is the customer a company - set the terms
    payment_type = xero_config.CONTACT_PAYMENT_TERMS_TYPE
    payment_days = xero_config.CONTACT_PAYMENT_TERMS_DAYS

    if not guest_customer:
        if customer_obj.parent_company:
            company = customer_obj.parent_company
            if company.account_type_id == 3:
                payment_type = company.payment_terms.shortcode
                payment_days = company.payment_days

    xero_contact_obj.add_payment_terms(payment_type, payment_days)

    if xero_id:
        xero_contact_obj.set_existing_id(xero_id)

    contact_id = xero_contact_obj.save_contact()
    errors = xero_contact_obj.xero_api.get_error()

    if not guest_customer:
        if not errors:
            customer_obj.xero_id = contact_id
            customer_obj.save()
            if customer_obj.parent_company:
                customer_obj.parent_company.xero_id = contact_id
                customer_obj.parent_company.save()
            data['status'] = 'OK'
            data['contactID'] = contact_id
        else:
            data['status'] = 'ERROR'
            data['error'] = errors
    else:
        if not errors:
            data['status'] = 'OK'
            data['contactID'] = contact_id
        else:
            data['status'] = 'ERROR'
            data['error'] = errors
    return data

def _update_contact(customer_obj):
    data = {}
    xero_contact_id = customer_obj.xero_id
    data = _create_new_contact(customer_obj, xero_contact_id)
    return data


#############################################   PRIVATE  -   COMPANY   ########################################################
def _create_new_company(company_obj, xero_contact_id = None):
    contact_id = ''
    data = {}
    data['status'] = 'OK'
    #contact_names = HumanName(company_obj.fullname)

    xero_contact_obj = XeroContact()

    company_contact = {
        'company': company_obj.company_name,
        'firstname': company_obj.accounts_contact_firstname,
        'lastname': company_obj.accounts_contact_lastname,
        'email': company_obj.accounts_email,
        'fullname': f"{company_obj.accounts_contact_fullname}"
    }
    #if company_obj.website:
    #    company_contact['website'] = company_obj.website

    xero_contact_obj.add_contact_details(company_contact)
    xero_contact_obj.add_telephone(company_obj.accounts_telephone)

    company_address = {
        'address_1': company_obj.accounts_address,
        'city': company_obj.accounts_city,
        'region': company_obj.accounts_area,
        'postcode': company_obj.accounts_postcode,
        'country' : company_obj.accounts_country.name
    }
    xero_contact_obj.add_address(company_address)

    #is the customer a company - set the terms
    payment_type = xero_config.CONTACT_PAYMENT_TERMS_TYPE
    payment_days = xero_config.CONTACT_PAYMENT_TERMS_DAYS

    if company_obj.account_type_id == 3:
        payment_type = company_obj.payment_terms.shortcode
        payment_days = company_obj.payment_days

    xero_contact_obj.add_payment_terms(payment_type, payment_days)
    if xero_contact_id:
        xero_contact_obj.set_existing_id(xero_contact_id)

    contact_id = xero_contact_obj.save_contact()
    errors = xero_contact_obj.xero_api.get_error()
    if not errors:
        company_obj.xero_id = contact_id
        company_obj.save()
        data['status'] = 'OK'
        data['contactID'] = contact_id
    else:
        data['status'] = 'ERROR'
        data['error'] = errors

    return data

def _update_company(company_obj):
    data = {}
    xero_contact_id = company_obj.xero_id
    data = _create_new_company(company_obj, xero_contact_id)
    return data

def _get_company_accounts(company_obj):
    data = {}
    data['status'] = 'OK'

    xero_contact_id = company_obj.xero_id
    if xero_contact_id:
        xero_contact_obj = XeroContact()
        xero_contact_obj.set_existing_id(xero_contact_id)
        xero_balance = xero_contact_obj.get_account_balance()
        errors = xero_contact_obj.xero_api.get_error()
        if not errors:
            data['status'] = 'OK'
            data['account_balance'] = xero_balance
        else:
            data['status'] = 'ERROR'
            data['error'] = errors
            data['account_balance'] = {'outstanding': 0,'overdue': 0 }
    else:
        data['status'] = 'OK'
        data['account_balance'] = {'outstanding': 0,'overdue': 0 }

    return data




#############################################   WEBHOOK   ########################################################
@csrf_protect
@csrf_exempt
def xero_web_hook(request):
    #logger.debug('XERO WEBHOOK')

    key = xero_config.XERO_WEBHOOK_KEY
    provided_signature = request.headers.get('X-Xero-Signature')

    payload_data = request.body.strip()
    byte_key = key.encode('UTF-8')
    message = payload_data

    hashed = hmac.new(byte_key, message, hashlib.sha256)
    generated_signature = base64.b64encode(hashed.digest()).decode('UTF-8')

    if provided_signature != generated_signature:
        return HttpResponse(status=401)

    #logger.debug('Signature match')

    # Respond immediately
    response = HttpResponse(status=200)

    # Background processing
    threading.Thread(target=_xero_webhook_payload, args=(payload_data.decode('UTF-8'),)).start()

    return response


def _xero_webhook_payload(payload):
    webhook_data = json.loads(payload)
    events = webhook_data['events']
    #logger.debug(f'_xero_webhook_payload - events = {events}')
    for event in events:
        if event['eventCategory'] == 'INVOICE':
            if event['eventType'] == 'UPDATE':
                _xero_webhook_invoice_update(event['resourceId'])

def _xero_webhook_invoice_update(invoice_id):
    xero_invoice = XeroInvoice()
    returned_invoice_id = xero_invoice.get_invoice(invoice_id)
    if returned_invoice_id:
        try:
            order_obj = OcOrder.objects.get(xero_id=invoice_id)
        except OcOrder.DoesNotExist:
            #logger.warning(f'OcOrder with xero_id={invoice_id} not found.')
            return False

        if order_obj.payment_status_id == settings.TSG_PAYMENT_STATUS_PAID:
            return False

        logger.debug(f'_xero_webhook_invoice_update - payment_method_id = {order_obj.payment_method}')
        invoice_payments = xero_invoice.get_payments()
        if invoice_payments:
            order_obj.payment_status_id = settings.TSG_PAYMENT_STATUS_PAID
            payment_details = invoice_payments[0]
            order_obj.payment_date = payment_details.get('Date')
            logger.debug(f'_xero_webhook_invoice_update - Order {order_obj.order_id} current payment_method_id = {order_obj.payment_method}')
            #order_obj.payment_method_id = settings.TSG_PAYMENT_TYPE_XERO
            order_obj.save()
            #add this to the payment history - this is done automatically now by the order class
            #new_history_obj = OcTsgPaymentHistory()
            #new_history_obj.order_id = order_obj.order_id
            #new_history_obj.payment_method_id = order_obj.payment_method_id
            #new_history_obj.payment_status_id = order_obj.payment_status_id
            #new_history_obj.comment = 'XERO - Automated update - Payment'
            #new_history_obj.save()

            #logger.debug(f'Order {order_obj.order_id} marked as paid.')
    return True

