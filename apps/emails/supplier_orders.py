"""
Supplier orders: email a supplier the order lines they are supplying, then mark those
lines 'supplier item - ordered'.

Nothing here depends on the request, so the same functions can later be driven from a
background job instead of the Order Products dialog.
"""
import html
import logging

from django.conf import settings
from django.db import transaction
from django.template.loader import render_to_string

from apps.emails import views as email_views
from apps.orders.models import OcOrderProduct, OcTsgOrderActivity, OcTsgOrderOption, OcTsgOrderProductOptions, \
    PRODUCT_STATUS_SUPPLIER_ITEM, PRODUCT_STATUS_SUPPLIER_ORDERED
from apps.paperwork.views import gen_supplier_despatch_for_emails, gen_shipping_page_for_emails
from apps.templating.models import OcTsgTemplates

logger = logging.getLogger('apps')

TEMPLATE_SUPPLIER_ORDER = 'TEMPLATE_SUPPLIER_ORDER'
ACTIVITY_TYPE_EMAIL_SENT = 6  # oc_tsg_activity_type


class SupplierOrderError(Exception):
    """A problem the user can act on; the message is shown in the dialog."""


def _supplier_lines(order_id):
    return (OcOrderProduct.objects
            .filter(order_id=order_id, supplier__isnull=False,
                    status_id__in=[PRODUCT_STATUS_SUPPLIER_ITEM, PRODUCT_STATUS_SUPPLIER_ORDERED])
            .exclude(supplier_id=settings.TSG_SUPPLIER_ID)
            .select_related('supplier')
            .order_by('supplier__code', 'order_product_id'))


def get_supplier_order_groups(order_id):
    """Suppliers with lines still waiting to be ordered on this order.

    Returns [{'supplier', 'lines', 'outstanding'}]. Lines already ordered from the same
    supplier are included (unselected in the dialog) so they can be re-sent.
    """
    groups = {}
    for line in _supplier_lines(order_id):
        group = groups.setdefault(line.supplier_id, {'supplier': line.supplier, 'lines': [], 'outstanding': 0})
        group['lines'].append(line)
        if line.status_id == PRODUCT_STATUS_SUPPLIER_ITEM:
            group['outstanding'] += 1
    return [group for group in groups.values() if group['outstanding']]


def get_supplier_order_lines(order_id, supplier_id, order_product_ids):
    """The selected lines, limited to this order and supplier."""
    return list(_supplier_lines(order_id).filter(supplier_id=supplier_id, order_product_id__in=order_product_ids))


def _plain(value):
    """Order data saved by tsg_store is HTML-escaped (OpenCart htmlspecialchars() all input, so " is stored as
    &quot; and & as &amp;). Unescape it so the templates' own escaping doesn't show the entities."""
    return html.unescape(value) if value else ''


def line_display_row(line):
    """An order line's text for the dialog and email, with storefront HTML entities decoded."""
    return {
        'order_product_id': line.order_product_id,
        'status_id': line.status_id,
        'supplier_code': _plain(line.supplier_code or line.model),
        'name': _plain(line.name),
        'size_name': _plain(line.size_name),
        'material_name': _plain(line.material_name),
        'quantity': line.quantity,
    }


def _delivery_address(order_obj):
    fields = ('fullname', 'company', 'address_1', 'address_2', 'city', 'area', 'postcode', 'country', 'telephone')
    return {field: _plain(getattr(order_obj, f'shipping_{field}')) for field in fields}


def _line_options(order_product_id):
    """'Name : value' for each option and add-on on an order line, one entry per option.

    A list rather than paperwork.utils.get_order_product_line_options' <BR/>-joined string, so the email template
    can escape each entry."""
    options = [f'{_plain(option.option_name)} : {_plain(option.value_name)}'
               for option in OcTsgOrderOption.objects.filter(order_product_id=order_product_id)]
    options += [f'{_plain(addon.class_name)} : {_plain(addon.value_name)}'
                for addon in OcTsgOrderProductOptions.objects.filter(order_product_id=order_product_id)]
    return options


def build_supplier_order_email(order_obj, supplier_obj, lines, bl_direct):
    """Subject and HTML body from the store's TEMPLATE_SUPPLIER_ORDER template."""
    store_obj = order_obj.store
    template_obj = OcTsgTemplates.objects.filter(store_id=store_obj.store_id,
                                                 template_type__enum_val=TEMPLATE_SUPPLIER_ORDER).first()
    if not template_obj:
        raise SupplierOrderError(f'There is no supplier order email template for {store_obj.name}')

    order_number = f'{store_obj.prefix}-{order_obj.order_id}'
    line_rows = [dict(line_display_row(line), options=_line_options(line.order_product_id)) for line in lines]

    replacements = {
        '{{order_number}}': order_number,
        '{{supplier_company}}': supplier_obj.company or '',
        '{{store_name}}': store_obj.name or '',
        '{{store_website}}': store_obj.website or '',
        '{{company_name}}': store_obj.company_name or '',
        '{{sales_email}}': store_obj.email_address or '',
        '{{store_address}}': store_obj.address or '',
        '{{order_lines}}': render_to_string('emails/supplier_order_lines.html', {
            'lines': line_rows,
            'bl_options': any(row['options'] for row in line_rows),
        }),
        '{{delivery_instructions}}': render_to_string('emails/supplier_order_delivery.html', {
            'address': _delivery_address(order_obj),
            'order_number': order_number,
            'bl_direct': bl_direct,
        }),
    }
    replacements['{{store_email_footer}}'] = email_views.apply_template_replacements(
        store_obj.email_footer_text or '', replacements)

    return {
        'subject': email_views.apply_template_replacements(template_obj.subject or '', replacements),
        'body': email_views.apply_template_replacements(template_obj.main or '', replacements),
    }


def build_supplier_order_attachments(order_obj, lines, bl_direct):
    """Despatch note (these lines only) and shipping address page, for direct deliveries."""
    if not bl_direct:
        return []
    order_number = f'{order_obj.store.prefix}-{order_obj.order_id}'
    order_product_ids = [line.order_product_id for line in lines]
    return [
        (f'Despatch-Note-{order_number}.pdf',
         gen_supplier_despatch_for_emails(order_obj.order_id, order_product_ids), 'application/pdf'),
        (f'Shipping-Address-{order_number}.pdf',
         gen_shipping_page_for_emails(order_obj.order_id), 'application/pdf'),
    ]


def send_supplier_order(order_obj, supplier_obj, order_product_ids, bl_direct,
                        email_to, email_from, subject, body, user_id=None):
    """Email the selected lines to the supplier, then mark them ordered. Returns the lines sent."""
    lines = get_supplier_order_lines(order_obj.order_id, supplier_obj.pk, order_product_ids)
    if not lines:
        raise SupplierOrderError('Select at least one product to order')
    if not email_to or not email_from:
        raise SupplierOrderError('Enter the supplier and reply email addresses')

    attachments = build_supplier_order_attachments(order_obj, lines, bl_direct)
    send_status = email_views.send_email(email_to, email_from, subject, body, attachments)
    if not send_status['success']:
        raise SupplierOrderError(f'Email failed to send: {send_status["message"]}')

    try:
        mark_supplier_lines_ordered(order_obj, supplier_obj, lines, bl_direct, email_to, user_id)
    except Exception:
        logger.exception('Supplier order for order %s was emailed but the lines were not marked ordered',
                         order_obj.order_id)
        raise SupplierOrderError('The email was sent, but the products could not be marked as ordered - '
                                 'please update their status by hand')
    return lines


def mark_supplier_lines_ordered(order_obj, supplier_obj, lines, bl_direct, email_to, user_id=None):
    delivery = 'direct to customer' if bl_direct else 'for collection'
    with transaction.atomic():
        for line in lines:
            if line.status_id != PRODUCT_STATUS_SUPPLIER_ORDERED:
                line.status_id = PRODUCT_STATUS_SUPPLIER_ORDERED
                # save() rather than update() so the product status history is written
                line.save(update_fields=['status'])
        if user_id:
            OcTsgOrderActivity.objects.create(
                order=order_obj, activity_type_id=ACTIVITY_TYPE_EMAIL_SENT, user_id=user_id,
                description=f'Supplier order emailed to {supplier_obj.code or supplier_obj.company} ({", ".join(email_to)}) - '
                            f'{len(lines)} line(s), {delivery}')
