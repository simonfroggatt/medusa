from django.shortcuts import render
from django.urls import reverse_lazy
from apps.shipping.models import OcTsgCourier, OcTsgShippingMethod, OcTsgCourierOptions
from rest_framework import viewsets
from rest_framework.response import Response
from apps.shipping.seriailizers import CourierSerializer, MethodSerializer, CourierOptionsSerializer
from apps.shipping.forms import CourierEditForm, MethodsEditForm, CourierOptionEditForm
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import logging
import json

from apps.orders.models import OcOrder

logger = logging.getLogger(__name__)


class Couriers(viewsets.ModelViewSet):
    queryset = OcTsgCourier.objects.all()
    serializer_class = CourierSerializer

class Methods(viewsets.ModelViewSet):
    queryset = OcTsgShippingMethod.objects.all()
    serializer_class = MethodSerializer

class CourierOptions(viewsets.ModelViewSet):
    queryset = OcTsgCourierOptions.objects.all()
    serializer_class = CourierOptionsSerializer

    def retrieve(self, request, pk=None):
        options_obj = OcTsgCourierOptions.objects.filter(courier_id=pk)
        serializer = self.get_serializer(options_obj, many=True)
        return Response(serializer.data)



def courier_list(request):
    template_name = 'shipping/courier_list.html'
    context = {'pageview': 'All Couriers'}
    return render(request, template_name, context)


def methods_list(request):
    template_name = 'shipping/method_list.html'
    context = {'pageview': 'All Shipping'}
    return render(request, template_name, context)


class CourierCreate(CreateView):
    template_name = 'shipping/courier-create.html'
   #initial = {'size_code': '', 'size_name': '', 'size_width': 0, 'size_height': 0, 'size_units': 'mm', 'orientation': 1 }
    model = OcTsgCourier
    form_class = CourierEditForm
    #['size_id', 'size_code', 'size_name', 'size_width', 'size_height', 'size_units', 'orientation']
    success_message = 'Success: Courier was created.'
    success_url = reverse_lazy('allcouriers')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Shipping"
        context['pageview'] = "NEW Courier"
        context['courier_id'] = 0
        context['submit_text'] = "Create"
        return context


class CourierUpdate(UpdateView):
    template_name = 'shipping/courier-create.html'
    model = OcTsgCourier
    form_class = CourierEditForm
    success_message = 'Success: Courier was created.'
    success_url = reverse_lazy('allcouriers')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = "Couriers"
        context['heading'] = "Update Courier details"
        context['submit_text'] = "Update"
        context['courier_id'] = self.kwargs['pk']
        return context


def courier_delete(request, pk):
    template_name = 'shipping/courier-delete.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_id = request.POST.get('courier_id')
        obj_courier = get_object_or_404(OcTsgCourier, pk=courier_id)
        obj_courier.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def courier_option_add(request, pk):
    template_name = 'shipping/courier_option_add.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_id = request.POST.get('courier_id')
        form = CourierOptionEditForm(request.POST)
        form_instance = form.instance
        new_option_obj = OcTsgCourierOptions()
        new_option_obj.courier_id = courier_id
        new_option_obj.courier_option_title = form_instance.courier_option_title
        new_option_obj.courier_option_description = form_instance.courier_option_description
        new_option_obj.save()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        options_initials = {'courier_id': pk}
        option_obj = OcTsgCourierOptions()
        form_obj = CourierOptionEditForm(instance=option_obj, initial=options_initials)
        context['form'] = form_obj
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def courier_option_edit(request, pk):
    template_name = 'shipping/courier_option_edit.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_option_id = request.POST.get('courier_option_id')
        form = CourierOptionEditForm(request.POST)
        form_instance = form.instance
        new_option_obj = get_object_or_404(OcTsgCourierOptions, pk=courier_option_id)
        new_option_obj.courier_option_title = form_instance.courier_option_title
        new_option_obj.courier_option_description = form_instance.courier_option_description
        new_option_obj.save()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        option_obj = get_object_or_404(OcTsgCourierOptions, pk=pk)
        form_obj = CourierOptionEditForm(instance=option_obj)
        context['form'] = form_obj
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def courier_option_delete(request, pk):
    template_name = 'shipping/courier_option-delete.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_option_id = request.POST.get('courier_option_id')
        obj_courier = get_object_or_404(OcTsgCourierOptions, pk=courier_option_id)
        obj_courier.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


class MethodsCreate(CreateView):
    template_name = 'shipping/method-create.html'
    initial = {'store': 1, 'status': 1}
    model = OcTsgShippingMethod
    form_class = MethodsEditForm
    success_message = 'Success: Shipping method was created.'
    success_url = reverse_lazy('allmethods')


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = "Shipping"
        context['heading'] = "NEW shipping method"
        context['submit_text'] = "Create"
        return context



class MethodsUpdate(UpdateView):
    template_name = 'shipping/method-create.html'
    model = OcTsgShippingMethod
    form_class = MethodsEditForm
    success_message = 'Success: Shipping method was created.'
    success_url = reverse_lazy('allmethods')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = "Shipping"
        context['heading'] = "Update shipping method"
        context['submit_text'] = "Update"
        return context


def methods_delete(request, pk):
    template_name = 'shipping/shipping_method-delete.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        shipping_method_id = request.POST.get('shipping_method_id')
        obj_shipping_method = get_object_or_404(OcTsgShippingMethod, pk=shipping_method_id)
        obj_shipping_method.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)



@csrf_exempt
#@require_http_methods(["POST"])
def royalmail_webhook(request):
        payload = request.body
        logging.info("Royal Mail Webhook received")
        logging.info(f"Received payload: {payload}")
        return HttpResponse(status=200)


# =============================================================================
# ROYAL MAIL — Click & Drop label page
# =============================================================================

def rm_label_page(request, order_id):
    """
    Page to create a Royal Mail Click & Drop label for a given Medusa order.
    Pulls the shipping address, phone and email from the order.
    """
    from apps.shipping.api.rm.clickdrop import SERVICE_CODES
    from apps.orders.models import OcOrderTotal
    order_obj = get_object_or_404(OcOrder, pk=order_id)

    # Order value excluding shipping
    subtotal_row = OcOrderTotal.objects.filter(order=order_obj, code='sub_total').first()
    order_subtotal = float(subtotal_row.value) if subtotal_row else float(order_obj.total)

    # Split address_1 on newlines — the DB often stores lines 2/3 in address_1
    raw_addr1 = (order_obj.shipping_address_1 or '').strip()
    addr_parts = [p.strip() for p in raw_addr1.splitlines() if p.strip()]
    address_line1 = addr_parts[0] if len(addr_parts) > 0 else ''
    address_line2 = addr_parts[1] if len(addr_parts) > 1 else (order_obj.shipping_address_2 or '').strip()
    address_line3 = addr_parts[2] if len(addr_parts) > 2 else ''

    context = {
        'heading':    'Royal Mail — Create Label',
        'pageview':   'Shipping',
        'order':      order_obj,
        'order_id':   order_id,
        'order_subtotal': order_subtotal,
        'services':   SERVICE_CODES,
        'address_line1': address_line1,
        'address_line2': address_line2,
        'address_line3': address_line3,
        'courier':    'rm',
        'breadcrumbs': [
            {'name': 'Orders', 'url': '/orders/'},
            {'name': f'Order #{order_id}', 'url': f'/orders/{order_id}/'},
        ],
    }
    return render(request, 'shipping/rm_label.html', context)


@csrf_exempt
def api_rm_address_lookup(request):
    """AJAX: POST { postcode } → list of RM addresses for that postcode."""
    from apps.shipping.api.rm.clickdrop import lookup_address
    body = json.loads(request.body or '{}')
    postcode = body.get('postcode', '').strip()
    if not postcode:
        return JsonResponse({'ok': False, 'error': 'postcode required'}, status=400)
    try:
        addresses = lookup_address(postcode)
        return JsonResponse({'ok': True, 'addresses': addresses})
    except Exception as exc:
        logger.exception('RM address lookup failed')
        return JsonResponse({'ok': False, 'error': str(exc)}, status=500)


@csrf_exempt
def api_rm_create_order(request):
    """AJAX: POST shipment data → create Click & Drop order, return orderIdentifier + tracking."""
    from apps.shipping.api.rm.clickdrop import create_order
    try:
        body = json.loads(request.body)
        result = create_order(
            recipient_name = body['recipient_name'],
            address_line1  = body['address_line1'],
            address_line2  = body.get('address_line2', ''),
            address_line3  = body.get('address_line3', ''),
            city           = body['city'],
            county         = body.get('county', ''),
            postcode       = body['postcode'],
            country_code   = body.get('country_code', 'GB'),
            weight_grams   = int(body.get('weight_grams', 500)),
            service_key    = body['service_key'],
            package_format = body.get('package_format', 'parcel'),
            reference      = body.get('reference', ''),
            email          = body.get('email', ''),
            phone          = body.get('phone', ''),
            company_name   = body.get('company_name', ''),
            subtotal       = float(body.get('subtotal', 0)),
            total          = float(body.get('total', 0)),
        )
        return JsonResponse({'ok': True, 'data': result})
    except Exception as exc:
        logger.exception('RM create order failed')
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)


def api_rm_label(request, cd_order_id):
    """GET: download the PDF label for a Click & Drop order ID."""
    from apps.shipping.api.rm.clickdrop import get_label
    try:
        pdf = get_label(
            cd_order_id,
            document_type='postageLabel',
            include_returns=False,
        )
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="rm_label_{cd_order_id}.pdf"'
        return response
    except Exception as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)


# =============================================================================
# DX DELIVERY — label page
# =============================================================================

def dx_label_page(request, order_id):
    """
    Page to create a DX Delivery label for a given Medusa order.
    """
    from apps.shipping.api.dx.dx_api import SERVICE_CODES
    order_obj = get_object_or_404(OcOrder, pk=order_id)

    context = {
        'heading':   'DX Delivery — Create Label',
        'pageview':  'Shipping',
        'order':     order_obj,
        'order_id':  order_id,
        'services':  SERVICE_CODES,
        'courier':   'dx',
        'breadcrumbs': [
            {'name': 'Orders', 'url': '/orders/'},
            {'name': f'Order #{order_id}', 'url': f'/orders/{order_id}/'},
        ],
    }
    return render(request, 'shipping/dx_label.html', context)


@csrf_exempt
def api_dx_address_lookup(request):
    """AJAX: POST { postcode } → postcode info (via postcodes.io)."""
    from apps.shipping.api.dx.dx_api import lookup_address
    body = json.loads(request.body or '{}')
    postcode = body.get('postcode', '').strip()
    if not postcode:
        return JsonResponse({'ok': False, 'error': 'postcode required'}, status=400)
    try:
        addresses = lookup_address(postcode)
        return JsonResponse({'ok': True, 'addresses': addresses})
    except Exception as exc:
        logger.exception('DX address lookup failed')
        return JsonResponse({'ok': False, 'error': str(exc)}, status=500)


@csrf_exempt
def api_dx_create_shipment(request):
    """AJAX: POST shipment data → create DX shipment, return consignment number."""
    from apps.shipping.api.dx.dx_api import create_shipment
    try:
        body = json.loads(request.body)
        result = create_shipment(
            recipient_name = body['recipient_name'],
            address_line1  = body['address_line1'],
            address_line2  = body.get('address_line2', ''),
            town           = body['town'],
            county         = body.get('county', ''),
            postcode       = body['postcode'],
            country_code   = body.get('country_code', 'GB'),
            service_key    = body['service_key'],
            weight_kg      = float(body.get('weight_kg', 1.0)),
            reference      = body.get('reference', ''),
            email          = body.get('email', ''),
            phone          = body.get('phone', ''),
            num_items      = int(body.get('num_items', 1)),
        )
        return JsonResponse({'ok': True, 'data': result})
    except Exception as exc:
        logger.exception('DX create shipment failed')
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)


def api_dx_label(request, consignment_number):
    """GET: download the PDF label for a DX consignment number."""
    from apps.shipping.api.dx.dx_api import get_label
    try:
        pdf = get_label(consignment_number)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="dx_label_{consignment_number}.pdf"'
        return response
    except Exception as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)


# =============================================================================
# LOQATE — Address Verification
# =============================================================================

@csrf_exempt
def api_verify_address(request):
    """
    AJAX: POST order address data → verify via Loqate → save to AddressVerification → return result.

    Expects JSON body:
      order_id, line1, line2, city, area, postcode, country_code,
      name (optional), company (optional), phone (optional), email (optional)

    Returns JSON with:
      ok, confidence_score, verification_level, avc, matchscore,
      verified_address {line1, line2, line3, city, area, postcode, country_code},
      status (verified / needs_review / failed)
    """
    from apps.shipping.api.loqate.address_verify import verify_address
    from apps.shipping.models import AddressVerification
    from django.utils import timezone as tz

    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'ok': False, 'error': 'Invalid JSON'}, status=400)

    order_id = body.get('order_id')
    if not order_id:
        return JsonResponse({'ok': False, 'error': 'order_id required'}, status=400)

    order_obj = get_object_or_404(OcOrder, pk=order_id)

    line1 = body.get('line1', '').strip()
    line2 = body.get('line2', '').strip()
    line3 = body.get('line3', '').strip()
    city = body.get('city', '').strip()
    area = body.get('area', '').strip()
    postcode = body.get('postcode', '').strip()
    country_code = body.get('country_code', 'GB').strip()
    organization = body.get('company', '').strip()

    if not line1:
        return JsonResponse({'ok': False, 'error': 'Address line 1 is required'}, status=400)

    try:
        result = verify_address(
            line1=line1,
            line2=line2,
            line3=line3,
            city=city,
            area=area,
            postcode=postcode,
            country_code=country_code,
            organization=organization,
        )
    except Exception as exc:
        logger.exception('Loqate verify failed')
        return JsonResponse({'ok': False, 'error': str(exc)}, status=500)

    if not result.get('ok'):
        return JsonResponse({
            'ok': False,
            'error': result.get('error', 'Verification failed'),
        }, status=400)

    # Determine status based on confidence
    confidence = result['confidence_score']
    if confidence >= 80:
        status = AddressVerification.Status.VERIFIED
    elif confidence >= 40:
        status = AddressVerification.Status.NEEDS_REVIEW
    else:
        status = AddressVerification.Status.FAILED

    verified = result['verified_address']

    # Upsert: update if same input_hash + country exists, else create
    av, created = AddressVerification.objects.update_or_create(
        input_hash=result['input_hash'],
        input_country_code=country_code.upper(),
        defaults={
            'order': order_obj,
            'input_name': body.get('name', ''),
            'input_company': organization,
            'input_phone': body.get('phone', ''),
            'input_email': body.get('email', ''),
            'input_line1': line1,
            'input_line2': line2,
            'input_line3': '',
            'input_city': city,
            'input_area': area,
            'input_postcode': postcode,
            'verified_line1': verified.get('line1', ''),
            'verified_line2': verified.get('line2', ''),
            'verified_line3': verified.get('line3', ''),
            'verified_city': verified.get('city', ''),
            'verified_area': verified.get('area', ''),
            'verified_postcode': verified.get('postcode', ''),
            'verified_country_code': verified.get('country_code', ''),
            'provider': 'loqate',
            'provider_reference': '',
            'verification_level': result['verification_level'],
            'confidence_score': confidence,
            'result_codes': result['avc'],
            'provider_request_json': result['request_json'],
            'provider_response_json': result['response_json'],
            'status': status,
            'verified_at': tz.now(),
        },
    )

    return JsonResponse({
        'ok': True,
        'confidence_score': float(confidence),
        'verification_level': result['verification_level'],
        'avc': result['avc'],
        'matchscore': result['matchscore'],
        'status': status,
        'verified_address': verified,
        'created': created,
    })


# =============================================================================
# RM Ship & Label Dialog (called from order navbar)
# =============================================================================

@csrf_exempt
def rm_ship_label_dialog(request, order_id):
    """
    GET  → verify address via Loqate, render dialog with comparison + service picker.
    POST → create RM Click & Drop order with chosen address + service, return label link.
    """
    from apps.shipping.api.rm.clickdrop import SERVICE_CODES, create_order
    from apps.shipping.api.loqate.address_verify import verify_address
    from apps.orders.models import OcOrderTotal

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    data = dict()

    if request.method == 'POST':
        # ── Create RM order + return label URL ──────────────────────────
        try:
            body = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'ok': False, 'error': 'Invalid JSON'}, status=400)

        # ── Simulate mode (fake tracking, save everything, send emails) ──
        if body.get('simulate'):
            import uuid
            import hashlib
            from django.utils import timezone as tz
            from apps.orders.models import OcTsgOrderShipment
            from apps.shipping.models import OcTsgCourier, AddressVerification

            fake_cd_order_id = int(uuid.uuid4().int % 10_000_000)
            fake_tracking = f'SIM-{uuid.uuid4().hex[:12].upper()}'

            # Save shipment record
            rm_courier = OcTsgCourier.objects.filter(courier_title__icontains='royalmail').first()
            OcTsgOrderShipment.objects.create(
                order=order_obj,
                courier_shipping_id=fake_cd_order_id,
                tracking_number=fake_tracking,
                shipping_courier=rm_courier,
                shipping_courier_method=body.get('service_key', ''),
                shipping_status_id=1,
            )

            # Set order status to shipped
            order_obj.order_status_id = 99
            order_obj.save()

            # Mark individual products as shipped
            if body.get('mark_shipped'):
                for order_product in order_obj.order_products.all():
                    if order_product.status_id != 9:
                        order_product.status_id = 8
                        order_product.save()

            # Save address verification record
            chosen_line1 = body.get('address_line1', '')
            chosen_line2 = body.get('address_line2', '')
            chosen_line3 = body.get('address_line3', '')
            chosen_city = body.get('city', '')
            chosen_area = body.get('county', '')
            chosen_postcode = body.get('postcode', '')
            chosen_country = body.get('country_code', 'GB')

            # Build input hash from the order's original address
            raw_addr1 = (order_obj.shipping_address_1 or '').strip()
            addr_parts = [p.strip() for p in raw_addr1.splitlines() if p.strip()]
            orig_line1 = addr_parts[0] if len(addr_parts) > 0 else ''
            orig_line2 = addr_parts[1] if len(addr_parts) > 1 else (order_obj.shipping_address_2 or '').strip()
            orig_line3 = addr_parts[2] if len(addr_parts) > 2 else ''
            hash_input = f'{orig_line1}|{orig_line2}|{orig_line3}|{order_obj.shipping_city}|{order_obj.shipping_postcode}'.lower()
            input_hash = hashlib.sha256(hash_input.encode()).hexdigest()

            AddressVerification.objects.update_or_create(
                input_hash=input_hash,
                input_country_code=chosen_country,
                defaults={
                    'order': order_obj,
                    'input_name': order_obj.shipping_fullname or '',
                    'input_company': order_obj.shipping_company or '',
                    'input_phone': order_obj.shipping_telephone or '',
                    'input_email': order_obj.shipping_email or '',
                    'input_line1': orig_line1,
                    'input_line2': orig_line2,
                    'input_line3': orig_line3,
                    'input_city': order_obj.shipping_city or '',
                    'input_area': order_obj.shipping_area or '',
                    'input_postcode': order_obj.shipping_postcode or '',
                    'verified_company': body.get('company_name', ''),
                    'verified_line1': chosen_line1,
                    'verified_line2': chosen_line2,
                    'verified_line3': chosen_line3,
                    'verified_city': chosen_city,
                    'verified_area': chosen_area,
                    'verified_postcode': chosen_postcode,
                    'verified_country_code': chosen_country,
                    'provider': 'loqate',
                    'provider_reference': f'SIM-{fake_cd_order_id}',
                    'verification_level': body.get('verification_level', ''),
                    'confidence_score': float(body.get('confidence_score', 0)) or None,
                    'result_codes': body.get('result_codes', ''),
                    'status': 'verified',
                    'verified_at': tz.now(),
                },
            )

            # Send emails
            email_messages = {}
            if body.get('send_tracking') and body.get('tracking_email'):
                try:
                    from apps.emails.views import send_shipped_email
                    json_return = send_shipped_email(order_id, body['tracking_email'])
                    email_messages['tracking'] = json.loads(json_return.content)
                except Exception as exc:
                    logger.exception('Failed to send tracking email (simulate)')
                    email_messages['tracking'] = {'success': False, 'message': str(exc)}
            if body.get('send_invoice') and body.get('invoice_email'):
                try:
                    from apps.emails.views import send_invoice_email
                    json_return = send_invoice_email(order_id, body['invoice_email'])
                    email_messages['invoice'] = json.loads(json_return.content)
                except Exception as exc:
                    logger.exception('Failed to send invoice email (simulate)')
                    email_messages['invoice'] = {'success': False, 'message': str(exc)}

            return JsonResponse({
                'ok': True,
                'cd_order_id': fake_cd_order_id,
                'tracking': fake_tracking,
                'label_url': '',
                'emails': email_messages,
            })

        subtotal_row = OcOrderTotal.objects.filter(order=order_obj, code='sub_total').first()
        order_subtotal = float(subtotal_row.value) if subtotal_row else float(order_obj.total)

        try:
            result = create_order(
                recipient_name = body.get('recipient_name', ''),
                address_line1  = body.get('address_line1', ''),
                address_line2  = body.get('address_line2', ''),
                address_line3  = body.get('address_line3', ''),
                city           = body.get('city', ''),
                county         = body.get('county', ''),
                postcode       = body.get('postcode', ''),
                country_code   = body.get('country_code', 'GB'),
                weight_grams   = int(body.get('weight_grams', 500)),
                service_key    = body.get('service_key', 'tracked_24'),
                package_format = 'parcel',
                reference      = body.get('reference', f'Order #{order_id}'),
                email          = body.get('email', ''),
                phone          = body.get('phone', ''),
                company_name   = body.get('company_name', ''),
                subtotal       = order_subtotal,
                total          = order_subtotal,
            )
        except Exception as exc:
            logger.exception('RM create_order failed')
            return JsonResponse({'ok': False, 'error': str(exc)}, status=500)

        created_orders = result.get('createdOrders', [])
        failed_orders = result.get('failedOrders', [])

        if not created_orders:
            error_msg = 'RM API error'
            if failed_orders:
                error_msg = str(failed_orders[0].get('errors', failed_orders))
            return JsonResponse({'ok': False, 'error': error_msg}, status=400)

        cd_order_id = created_orders[0].get('orderIdentifier', {}).get('orderId')
        tracking = created_orders[0].get('trackingNumber', '')

        label_url = f'/shipping/api/rm/label/{cd_order_id}/' if cd_order_id else ''

        # ── Save address verification record ─────────────────────────────
        import hashlib
        from django.utils import timezone as tz
        from apps.shipping.models import AddressVerification

        chosen_line1 = body.get('address_line1', '')
        chosen_line2 = body.get('address_line2', '')
        chosen_line3 = body.get('address_line3', '')
        chosen_city = body.get('city', '')
        chosen_area = body.get('county', '')
        chosen_postcode = body.get('postcode', '')
        chosen_country = body.get('country_code', 'GB')

        raw_addr1 = (order_obj.shipping_address_1 or '').strip()
        addr_parts = [p.strip() for p in raw_addr1.splitlines() if p.strip()]
        orig_line1 = addr_parts[0] if len(addr_parts) > 0 else ''
        orig_line2 = addr_parts[1] if len(addr_parts) > 1 else (order_obj.shipping_address_2 or '').strip()
        orig_line3 = addr_parts[2] if len(addr_parts) > 2 else ''
        hash_input = f'{orig_line1}|{orig_line2}|{orig_line3}|{order_obj.shipping_city}|{order_obj.shipping_postcode}'.lower()
        input_hash = hashlib.sha256(hash_input.encode()).hexdigest()

        AddressVerification.objects.update_or_create(
            input_hash=input_hash,
            input_country_code=chosen_country,
            defaults={
                'order': order_obj,
                'input_name': order_obj.shipping_fullname or '',
                'input_company': order_obj.shipping_company or '',
                'input_phone': order_obj.shipping_telephone or '',
                'input_email': order_obj.shipping_email or '',
                'input_line1': orig_line1,
                'input_line2': orig_line2,
                'input_line3': orig_line3,
                'input_city': order_obj.shipping_city or '',
                'input_area': order_obj.shipping_area or '',
                'input_postcode': order_obj.shipping_postcode or '',
                'verified_company': body.get('company_name', ''),
                'verified_line1': chosen_line1,
                'verified_line2': chosen_line2,
                'verified_line3': chosen_line3,
                'verified_city': chosen_city,
                'verified_area': chosen_area,
                'verified_postcode': chosen_postcode,
                'verified_country_code': chosen_country,
                'provider': 'loqate',
                'provider_reference': str(cd_order_id) if cd_order_id else '',
                'verification_level': body.get('verification_level', ''),
                'confidence_score': float(body.get('confidence_score', 0)) or None,
                'result_codes': body.get('result_codes', ''),
                'status': 'verified',
                'verified_at': tz.now(),
            },
        )

        # ── Save shipment record ────────────────────────────────────────
        from apps.orders.models import OcTsgOrderShipment
        from apps.shipping.models import OcTsgCourier
        rm_courier = OcTsgCourier.objects.filter(courier_title__icontains='royalmail').first()
        service_label = body.get('service_key', '')
        OcTsgOrderShipment.objects.create(
            order=order_obj,
            courier_shipping_id=cd_order_id,
            tracking_number=tracking or '',
            shipping_courier=rm_courier,
            shipping_courier_method=service_label,
            shipping_status_id=1,
        )

        # ── Set order status to shipped (always, same as order_ship_it) ──
        order_obj.order_status_id = 99
        order_obj.save()

        # ── Mark individual products as shipped (if checkbox ticked) ───
        email_messages = {}
        if body.get('mark_shipped'):
            for order_product in order_obj.order_products.all():
                if order_product.status_id != 9:  # not shipped direct
                    order_product.status_id = 8  # shipped
                    order_product.save()

        # ── Send tracking email ─────────────────────────────────────────
        if body.get('send_tracking') and body.get('tracking_email'):
            try:
                from apps.emails.views import send_shipped_email
                json_return = send_shipped_email(order_id, body['tracking_email'])
                email_messages['tracking'] = json.loads(json_return.content)
            except Exception as exc:
                logger.exception('Failed to send tracking email')
                email_messages['tracking'] = {'success': False, 'message': str(exc)}

        # ── Send invoice email ──────────────────────────────────────────
        if body.get('send_invoice') and body.get('invoice_email'):
            try:
                from apps.emails.views import send_invoice_email
                json_return = send_invoice_email(order_id, body['invoice_email'])
                email_messages['invoice'] = json.loads(json_return.content)
            except Exception as exc:
                logger.exception('Failed to send invoice email')
                email_messages['invoice'] = {'success': False, 'message': str(exc)}

        return JsonResponse({
            'ok': True,
            'cd_order_id': cd_order_id,
            'tracking': tracking,
            'label_url': label_url,
            'emails': email_messages,
        })

    # ── GET: verify address + render dialog ─────────────────────────────
    # Split address_1 on newlines
    raw_addr1 = (order_obj.shipping_address_1 or '').strip()
    addr_parts = [p.strip() for p in raw_addr1.splitlines() if p.strip()]
    addr_line1 = addr_parts[0] if len(addr_parts) > 0 else ''
    addr_line2 = addr_parts[1] if len(addr_parts) > 1 else (order_obj.shipping_address_2 or '').strip()
    addr_line3 = addr_parts[2] if len(addr_parts) > 2 else ''

    # Run Loqate verification
    loqate_result = None
    loqate_error = None
    try:
        loqate_result = verify_address(
            line1=addr_line1,
            line2=addr_line2,
            line3=addr_line3,
            city=(order_obj.shipping_city or '').strip(),
            area=(order_obj.shipping_area or '').strip(),
            postcode=(order_obj.shipping_postcode or '').strip(),
            country_code='GB',
            organization=(order_obj.shipping_company or '').strip(),
        )
    except Exception as exc:
        logger.exception('Loqate verify failed in ship-label dialog')
        loqate_error = str(exc)

    # Compute confidence
    confidence_score = 0
    verified_address = {}
    avc = ''
    verification_level = ''
    if loqate_result and loqate_result.get('ok'):
        confidence_score = float(loqate_result['confidence_score'])
        verified_address = loqate_result['verified_address']
        avc = loqate_result['avc']
        verification_level = loqate_result['verification_level']

    subtotal_row = OcOrderTotal.objects.filter(order=order_obj, code='sub_total').first()
    order_subtotal = float(subtotal_row.value) if subtotal_row else float(order_obj.total)

    template_name = 'shipping/dialogs/rm_ship_label.html'
    context = {
        'order_obj': order_obj,
        'order_id': order_id,
        'order_subtotal': order_subtotal,
        'services': SERVICE_CODES,
        'addr_line1': addr_line1,
        'addr_line2': addr_line2,
        'addr_line3': addr_line3,
        'confidence_score': confidence_score,
        'verified_address': verified_address,
        'avc': avc,
        'verification_level': verification_level,
        'loqate_error': loqate_error,
    }

    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)