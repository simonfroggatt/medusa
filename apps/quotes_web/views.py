"""Views for quotes_web.

Plain function-based views: JSON in, {'ok': True, 'data': ...} out, following
apps/shipping/views.py. Business logic stays in services/.

The create endpoint is called server-to-server by tsg_store and is protected by a shared
secret header, since it is reachable from the internet. Messages returned to the storefront
are deliberately short - no internal detail leaves the server.

Staff pages are restricted to the sales and superuser groups; the role for a status change
is always taken from request.user, never from the posted data.
"""
import hmac
import json
import logging
from datetime import datetime, time

from django.conf import settings
from django.utils import timezone
from django.contrib import messages
from django.db.models import Sum
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.template.loader import render_to_string
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from medusa.decorators import group_required

from . import constants
from apps.pricing.models import OcTsgProductMaterial
from apps.products import services as prod_services
from apps.products.models import OcTsgBulkdiscountGroups

from .forms import CreateQuoteForm, QuoteHeaderForm, QuoteItemAddForm, QuoteItemForm
from .models import Quote, QuoteItem, QuoteStatus
from .services import conversion as conversion_service
from .services import notify as notify_service
from .services import quotes as quote_service
from .services import transitions as transition_service
from .services.exceptions import QuotesWebError

logger = logging.getLogger(__name__)

API_KEY_HEADER = 'HTTP_X_TSG_KEY'
STAFF_GROUPS = ('sales', 'superuser')

# service error code -> HTTP status
ERROR_STATUS = {
    'empty_cart': 422,
    'invalid_transition': 409,
    'quote_expired': 410,
    'quote_not_found': 404,
    'quote_not_editable': 409,
    'error': 400,
}


def _fail(code, message, status):
    return JsonResponse({'ok': False, 'error': code, 'message': message}, status=status)


def _api_key_ok(request):
    expected = getattr(settings, 'QUOTES_WEB_API_KEY', None)
    if not expected:
        return None  # not configured - the caller cannot fix this, so it is a server error
    supplied = request.META.get(API_KEY_HEADER, '')
    return hmac.compare_digest(str(supplied), str(expected))


# ---------------------------------------------------------------------------
# storefront -> Medusa
# ---------------------------------------------------------------------------

@csrf_exempt
@require_POST
def api_create(request):
    """tsg_store posts a cart as a quote request. Prices arrive already worked out."""
    key_ok = _api_key_ok(request)
    if key_ok is None:
        logger.error('quotes_web: QUOTES_WEB_API_KEY is not set, refusing quote requests')
        return _fail('not_configured', 'Quote requests are not available', 503)
    if not key_ok:
        logger.warning('quotes_web: create called with a bad or missing key')
        return _fail('forbidden', 'Not allowed', 403)

    try:
        body = json.loads(request.body or b'{}')
    except ValueError:
        return _fail('invalid_json', 'Body was not valid JSON', 400)

    form = CreateQuoteForm(body, lines=body.get('lines'))
    if not form.is_valid():
        return JsonResponse({'ok': False, 'error': 'validation_error',
                             'message': 'Quote request was not valid',
                             'fields': form.errors}, status=400)

    data = form.cleaned_data
    try:
        quote = quote_service.create_quote(
            store_id=data['store_id'],
            customer_name=data['customer_name'],
            customer_phone=data['customer_phone'],
            customer_email=data['customer_email'] or None,
            medusa_customer_id=data['medusa_customer_id'] or None,
            notes=data['notes'] or None,
            lines=data['lines'],
        )
    except QuotesWebError as exc:
        status = ERROR_STATUS.get(exc.code, 400)
        logger.warning('quotes_web: create rejected (%s): %s', exc.code, exc)
        return _fail(exc.code, str(exc), status)
    except Exception:
        logger.exception('quotes_web: create failed')
        return _fail('server_error', 'Could not create the quote', 500)

    # the public token is not returned: the customer gets their link by email
    return JsonResponse({'ok': True, 'data': {
        'quote_id': quote.quote_id,
        'quote_number': quote.quote_number,
        'total': str(quote.total),
        'currency': quote.currency.code if quote.currency_id else None,
        # False means staff will send it by hand, so the storefront can word its message
        'emailed': quote.status.status_code == constants.STATUS_SENT,
    }})


# ---------------------------------------------------------------------------
# staff pages
# ---------------------------------------------------------------------------

@group_required(*STAFF_GROUPS)
def quote_list(request):
    """All web quotes, newest first, optionally filtered to one status."""
    quotes = (Quote.objects
              .select_related('status', 'store', 'currency')
              .all())
    status_code = request.GET.get('status')
    if status_code:
        quotes = quotes.filter(status__status_code=status_code)

    context = {
        'pageview': 'Web Quotes',
        'heading': 'web quotes',
        'quotes': quotes,
        'statuses': QuoteStatus.objects.filter(is_active=True),
        'current_status': status_code or '',
    }
    return render(request, 'quotes_web/quote_list.html', context)


@group_required(*STAFF_GROUPS)
def quote_detail(request, quote_id):
    """One quote: lines, totals, customer, what staff may do next, and the audit trail."""
    quote = get_object_or_404(
        Quote.objects.select_related('status', 'store', 'currency', 'medusa_customer'),
        pk=quote_id)
    items = quote.items.select_related('product_variant', 'bulk_discount')

    context = {
        'pageview': 'Web Quotes',
        # partials/base.html draws these as "Web Quotes / quote details"
        'breadcrumbs': [{'name': 'Web Quotes', 'url': reverse('quotes_web_list')}],
        'heading': 'quote details',
        'quote': quote,
        'items': items,
        'item_count': items.count(),
        'unit_count': items.aggregate(units=Sum('quantity'))['units'] or 0,
        'transitions': transition_service.allowed_transitions(quote, constants.ROLE_STAFF),
        'actions': quote.actions.select_related('user')[:50],
        'is_expired': quote.is_expired(),
        'is_editable': quote.is_editable(),
        'portal_url': quote_service.portal_url(quote),
        'send_route': notify_service.route_for(quote),
        'header_form': QuoteHeaderForm(initial={
            'shipping_cost': quote.shipping_cost,
            'discount_amount': quote.discount_amount,
            'expiry_date': quote.expiry_date.date() if quote.expiry_date else None,
            'notes': quote.notes,
        }),
        'bulk_bands': json.dumps(quote_service.bulk_bands_for(quote), default=str),
    }
    return render(request, 'quotes_web/quote_detail.html', context)


@group_required(*STAFF_GROUPS)
def quote_item_edit(request, quote_id, item_id):
    """One quote line, in the shared modal: quantity, price, and the variant it is for.

    Same contract as the order dialogs. Staff pick a row from the variants table to move the
    line to a different size or material; the price then comes from that variant.
    """
    data = dict()
    quote = get_object_or_404(Quote.objects.select_related('status', 'store', 'currency'),
                              pk=quote_id)
    item = get_object_or_404(QuoteItem, pk=item_id, quote_id=quote_id)
    error = ''

    if request.method == 'POST':
        form = QuoteItemForm(request.POST)
        if form.is_valid():
            try:
                item = quote_service.update_item(
                    quote, item,
                    quantity=form.cleaned_data['quantity'],
                    bulk_used=form.cleaned_data['bulk_used'],
                    unit_price=form.cleaned_data['unit_price'],
                    product_name=form.cleaned_data['product_name'],
                    detail=form.detail())
            except QuotesWebError as exc:
                data['form_is_valid'] = False
                error = str(exc)
            else:
                # options come back from the same dialog, as they do for an order line
                if 'selected_option_values_frm' in request.POST:
                    quote_service.set_item_options(item, request.POST)
                    item = quote_service.update_item(
                        quote, item,
                        quantity=form.cleaned_data['quantity'],
                        bulk_used=form.cleaned_data['bulk_used'],
                        unit_price=form.cleaned_data['unit_price'])
                data['form_is_valid'] = True
                quote_service.log_action(
                    quote, constants.ACTION_EDITED, user=request.user,
                    data={'line': item.product_name, 'quantity': item.quantity,
                          'unit_price': str(item.unit_price), 'bulk_used': item.bulk_used,
                          'size': item.size_name, 'material': item.material_name})
        else:
            data['form_is_valid'] = False
    else:
        form = QuoteItemForm(initial={
            'product_name': item.product_name,
            'quantity': item.quantity,
            'bulk_used': item.bulk_used,
            'unit_price': item.unit_price,
            'product_variant_id': item.product_variant_id,
            'variant_code': item.variant_code,
            'size_name': item.size_name,
            'width': item.width,
            'height': item.height,
            'orientation_name': item.orientation_name,
            'material_name': item.material_name,
            'supplier_id': item.supplier_id,
            'supplier_code': item.supplier_code,
            'base_unit_price': item.base_unit_price,
        })

    data['html_form'] = render_to_string(
        'quotes_web/dialog/quote_item_edit.html',
        {'quote': quote, 'item': item, 'form': form, 'error': error,
         'bulk_bands': json.dumps(quote_service.bulk_bands_for(quote), default=str),
         'options': item.options.all(),
         # what the options add per unit, so the dialog previews the same price the service
         # will work out on save
         'option_total': quote_service.option_price_total(item)},
        request=request)
    return JsonResponse(data)


@group_required(*STAFF_GROUPS)
def quote_add_product(request, quote_id):
    """Add Product, reusing the order dialog (Stock / Previous / Bespoke / Manual).

    The shared template branches on price_for: anything other than "I" posts form.quote and
    marks the form js-quote-add, which is how the legacy staff quotes have always used it.
    """
    data = dict()
    quote = get_object_or_404(
        Quote.objects.select_related('status', 'store', 'currency'), pk=quote_id)

    if request.method == 'POST':
        form = QuoteItemAddForm(request.POST)
        if form.is_valid():
            try:
                item = quote_service.create_item(quote, form.line_values(), request.POST)
            except QuotesWebError as exc:
                data['form_is_valid'] = False
                messages.error(request, str(exc))
            else:
                data['form_is_valid'] = True
                quote_service.log_action(
                    quote, constants.ACTION_EDITED, user=request.user,
                    data={'added': item.product_name, 'quantity': item.quantity,
                          'unit_price': str(item.unit_price)})
        else:
            logger.debug('quotes_web: add product form invalid - %s', form.errors)
            data['form_is_valid'] = False
    else:
        form = QuoteItemAddForm(initial={'quote': quote.quote_id})

    qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)
    context = {
        'quote_id': quote.quote_id,
        'store_id': quote.store_id,
        'customer_id': quote.medusa_customer_id or 0,
        'tax_rate': quote_service.store_tax_rate(quote.store) if quote.store_id else 0,
        'form': form,
        'form_post_url': reverse('quotes_web_add_product', kwargs={'quote_id': quote.quote_id}),
        'price_for': 'Q',          # the shared template's "this is a quote" switch
        'customer_discount': 0,
        'bulk_info': prod_services.create_bulk_arrays(qs_bulk),
        'material_obj': OcTsgProductMaterial.objects.all(),
    }

    data['html_form'] = render_to_string('orders/dialogs/add_product_layout_dlg.html',
                                         context, request=request)
    return JsonResponse(data)


@group_required(*STAFF_GROUPS)
@require_POST
def quote_item_delete(request, quote_id, item_id):
    quote = get_object_or_404(Quote.objects.select_related('status'), pk=quote_id)
    item = get_object_or_404(QuoteItem, pk=item_id, quote_id=quote_id)

    try:
        name = quote_service.delete_item(quote, item)
    except QuotesWebError as exc:
        messages.error(request, str(exc))
    else:
        quote_service.log_action(quote, constants.ACTION_EDITED, user=request.user,
                                 data={'removed': name})
        messages.success(request, f'Removed {name}.')

    return redirect('quotes_web_detail', quote_id=quote_id)


def _quote_panel_context(quote):
    """Everything the details card and totals partials need when rendered on their own."""
    return {
        'quote': quote,
        'is_expired': quote.is_expired(),
        'is_editable': quote.is_editable(),
        'header_form': QuoteHeaderForm(initial={
            'shipping_cost': quote.shipping_cost,
            'discount_amount': quote.discount_amount,
            'expiry_date': quote.expiry_date.date() if quote.expiry_date else None,
            'notes': quote.notes,
        }),
    }


@group_required(*STAFF_GROUPS)
def quote_edit_header(request, quote_id):
    """Shipping, discount, expiry date and staff notes, in the shared modal.

    Same contract as the order dialogs (apps/orders/views.py order_details_edit): GET returns
    the form as html_form, POST saves and answers form_is_valid, so the page refreshes the
    details card and totals without a reload.
    """
    data = dict()
    quote = get_object_or_404(Quote.objects.select_related('status', 'currency'), pk=quote_id)
    error = ''

    if request.method == 'POST':
        form = QuoteHeaderForm(request.POST)
        if form.is_valid():
            expiry = form.cleaned_data['expiry_date']
            if expiry:
                # valid to the end of its last day, not to midnight that morning
                expiry = timezone.make_aware(datetime.combine(expiry, time(23, 59, 59)))
            try:
                quote_service.update_header(
                    quote,
                    shipping_cost=form.cleaned_data['shipping_cost'],
                    discount_amount=form.cleaned_data['discount_amount'],
                    expiry_date=expiry,
                    notes=form.cleaned_data['notes'])
            except QuotesWebError as exc:
                data['form_is_valid'] = False
                error = str(exc)
            else:
                data['form_is_valid'] = True
                quote_service.log_action(
                    quote, constants.ACTION_EDITED, user=request.user,
                    data={'shipping': str(quote.shipping_cost),
                          'discount': str(quote.discount_amount),
                          'expiry': quote.expiry_date.strftime('%Y-%m-%d') if quote.expiry_date else None})
        else:
            data['form_is_valid'] = False
    else:
        form = QuoteHeaderForm(initial={
            'shipping_cost': quote.shipping_cost,
            'discount_amount': quote.discount_amount,
            'expiry_date': quote.expiry_date.date() if quote.expiry_date else None,
            'notes': quote.notes,
        })

    data['html_form'] = render_to_string(
        'quotes_web/dialog/quote_details_edit.html',
        {'quote': quote, 'form': form, 'error': error},
        request=request)
    return JsonResponse(data)


@group_required(*STAFF_GROUPS)
def quote_details_panel(request, quote_id):
    """The details card and totals, re-rendered after the dialog saves."""
    quote = get_object_or_404(
        Quote.objects.select_related('status', 'store', 'currency'), pk=quote_id)
    context = _quote_panel_context(quote)

    items = quote.items.select_related('product_variant', 'bulk_discount').prefetch_related('options')
    context['items'] = items

    return JsonResponse({
        'html_quote_details': render_to_string(
            'quotes_web/sub_layout/quote_details.html', context, request=request),
        'html_quote_totals': render_to_string(
            'quotes_web/sub_layout/quote_totals.html', context, request=request),
        'html_quote_products': render_to_string(
            'quotes_web/sub_layout/quote_products.html', context, request=request),
    })


@group_required(*STAFF_GROUPS)
@require_POST
def quote_change_status(request, quote_id):
    """Staff status button. The role is the logged-in user's, never the posted data."""
    quote = get_object_or_404(Quote, pk=quote_id)
    to_code = request.POST.get('to_status', '')

    # "Create order" is not just a status change - it builds the proforma, and moves the
    # status itself once that has worked
    if to_code == constants.STATUS_ORDER_CREATED:
        try:
            order = conversion_service.convert_to_order(quote, user=request.user)
        except QuotesWebError as exc:
            logger.warning('quotes_web: conversion refused for %s: %s', quote.quote_number, exc)
            messages.error(request, str(exc))
        else:
            messages.success(request, f'{quote.quote_number} is now order '
                                      f'{order.store.prefix}-{order.order_id}.')
        return redirect('quotes_web_detail', quote_id=quote_id)

    try:
        quote = transition_service.change_status(
            quote, to_code, constants.ROLE_STAFF, user=request.user)
    except QuotesWebError as exc:
        logger.warning('quotes_web: status change rejected (%s): %s', exc.code, exc)
        messages.error(request, f'Could not change the status: {exc}')
    else:
        messages.success(request, f'{quote.quote_number} is now {quote.status.status_name}.')
        if to_code == constants.STATUS_SENT:
            route, sent, reason = notify_service.send_quote(quote, user=request.user)
            if sent:
                messages.success(request, f'Quote emailed to {quote.customer_email}.')
            else:
                messages.info(request, f'Not sent automatically - {reason}. Copy the customer '
                                       f'link and send it by {route}.')

    return redirect('quotes_web_detail', quote_id=quote.quote_id)


# ---------------------------------------------------------------------------
# customer portal (tsg_store fetches this and wraps it in the store's own page)
# ---------------------------------------------------------------------------

def _customer_quote(token):
    """The quote behind a public token, or 404.

    A quote staff have not sent yet, or have cancelled, is not the customer's to see - and it
    answers exactly like an unknown token, so the link gives nothing away.
    """
    quote = get_object_or_404(
        Quote.objects.select_related('status', 'store', 'currency'), public_token=token)

    if quote.status.status_code not in constants.CUSTOMER_VISIBLE_STATUS_CODES:
        logger.info('quotes_web: portal hit for %s while %s - not shown',
                    quote.quote_number, quote.status.status_code)
        raise Http404('No quote to show')

    return quote


def _customer_action(request, token, to_code, data=None):
    """Shared plumbing for Accept and Request changes (both POSTed via tsg_store)."""
    quote = _customer_quote(token)

    if quote.is_expired():
        logger.info('quotes_web: %s is expired, refusing %s', quote.quote_number, to_code)
        return _fail('quote_expired', 'This quote has expired', 410)

    try:
        quote = transition_service.change_status(
            quote, to_code, constants.ROLE_CUSTOMER, data=data,
            ip_address=request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT'))
    except QuotesWebError as exc:
        # includes clicking Accept twice, or accepting a quote already changed by staff
        logger.info('quotes_web: customer %s refused for %s: %s', to_code, quote.quote_number, exc)
        return _fail(exc.code, 'That is no longer possible on this quote',
                     ERROR_STATUS.get(exc.code, 400))

    return JsonResponse({'ok': True, 'data': {
        'quote_number': quote.quote_number,
        'status': quote.status.status_code,
    }})


@csrf_exempt
@require_POST
def portal_accept(request, token):
    """Customer accepts their quote. Sets accepted_at through the transition service."""
    return _customer_action(request, token, constants.STATUS_ACCEPTED)


@csrf_exempt
@require_POST
def portal_request_changes(request, token):
    """Customer asks for changes; their reason is kept on the action row for staff."""
    reason = (request.POST.get('reason') or '').strip()[:2000]
    return _customer_action(request, token, constants.STATUS_CHANGE_REQUESTED,
                            data={'reason': reason} if reason else None)


def portal_fragment(request, token):
    """Read-only HTML for one quote, found by its public token.

    The token is the customer's only credential, so an unknown one is a plain 404 - no hint
    about whether the quote exists. Opening the page is what marks a sent quote as viewed;
    link previews never reach here, because tsg_store only fetches this when it renders the
    page for a real visitor.
    """
    quote = _customer_quote(token)

    if quote.status.status_code == constants.STATUS_SENT:
        try:
            quote = transition_service.change_status(
                quote, constants.STATUS_VIEWED, constants.ROLE_CUSTOMER,
                ip_address=request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT'))
        except QuotesWebError:
            logger.exception('quotes_web: could not mark %s as viewed', quote.quote_number)

    # which buttons the customer sees comes from the transition table, not from code here
    customer_moves = {t.to_status.status_code
                      for t in transition_service.allowed_transitions(quote, constants.ROLE_CUSTOMER)}
    expired = quote.is_expired()

    context = {
        'quote': quote,
        'items': quote.items.all(),
        'is_expired': expired,
        'status_code': quote.status.status_code,
        'can_accept': constants.STATUS_ACCEPTED in customer_moves and not expired,
        'can_request_changes': constants.STATUS_CHANGE_REQUESTED in customer_moves and not expired,
    }
    return render(request, 'quotes_web/portal_fragment.html', context)
