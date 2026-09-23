"""Turning an accepted quote into a proforma order.

This is the only part of quotes_web that writes into the order system, so it is deliberately
narrow: it creates rows, never changes existing ones, and touches no order code. The plan it
follows is in tsg_medusa/docs/quotes_web_v1_plan.md ("Accepted quote → proforma order").

The order it creates looks like the proformas already in the database: Open / Email / Proforma
/ Waiting, with an order hash so the customer can pay through the storefront's existing
proforma page. It stays out of the staff order lists until it is paid or PO-approved, because
those lists filter on payment status (settings.TSG_NEW_ORDER_PAYMENT_STATUS).

Prices are copied from the quote, never recalculated - that is the whole point of the proforma
route. Afterwards the order total is compared with the quote total, and any difference rolls
the whole thing back rather than quietly charging the customer something else.
"""
import hashlib
import logging
import uuid
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.customer.models import OcAddress, OcCustomer
from apps.orders.models import OcOrder, OcOrderProduct, OcTsgOrderProductOptions

from .. import constants
from ..models import QuoteItemOption
from .exceptions import OrderConversionError
from .quotes import log_action

logger = logging.getLogger(__name__)

# how a converted quote looks as an order - matches the proformas already in oc_order
ORDER_STATUS_OPEN = 1
ORDER_TYPE_EMAIL = 2
PAYMENT_METHOD_PROFORMA = 7
PAYMENT_STATUS_WAITING = 3
PRODUCT_STATUS_OPEN = 1

# defaults for a customer record created from a quote, as in apps/customer/views.py
# contact_create_from_guest_quote - except its country_id, which is not a field on OcCustomer
# and so was never actually saved
CUSTOMER_DEFAULTS = {
    'language_id': 1,
    'customer_group_id': 1,
    'status': 1,
    'safe': 1,
    'account_type_id': 1,
    'ip': '0.0.0.0',
}


def _names(fullname):
    """First and last name from a single field, without pulling in a name parser."""
    parts = (fullname or '').strip().split()
    if not parts:
        return '', ''
    return parts[0], ' '.join(parts[1:])


def _billing(quote):
    """The billing address as a plain dict, whatever its source."""
    return {
        'fullname': quote.payment_fullname or quote.customer_name,
        'email': quote.payment_email or quote.customer_email,
        'telephone': quote.payment_telephone or quote.customer_phone,
        'company': quote.payment_company,
        'address_1': quote.payment_address_1,
        'address_2': quote.payment_address_2,
        'city': quote.payment_city,
        'area': quote.payment_area,
        'postcode': quote.payment_postcode,
        'country': quote.payment_country,
        'country_id': quote.payment_country_iso_id,
    }


def _delivery(quote):
    """The delivery address - the billing one unless the customer asked for somewhere else."""
    if quote.shipping_same_as_billing or not quote.shipping_address_1:
        return _billing(quote)
    return {
        'fullname': quote.shipping_fullname or quote.customer_name,
        'email': quote.shipping_email or quote.customer_email,
        'telephone': quote.shipping_telephone or quote.customer_phone,
        'company': quote.shipping_company,
        'address_1': quote.shipping_address_1,
        'address_2': quote.shipping_address_2,
        'city': quote.shipping_city,
        'area': quote.shipping_area,
        'postcode': quote.shipping_postcode,
        'country': quote.shipping_country,
        'country_id': quote.shipping_country_iso_id,
    }


def customer_for(quote, billing):
    """The customer the order belongs to, creating one for a guest quote.

    A quote that has been accepted is a real trading relationship, so a guest gets a customer
    record and an address book entry - the same shape as apps/customer's guest conversion.
    """
    if quote.medusa_customer_id:
        return quote.medusa_customer, False

    firstname, lastname = _names(billing['fullname'])
    customer = OcCustomer(store_id=quote.store_id or 1,
                          fullname=billing['fullname'],
                          firstname=firstname,
                          lastname=lastname,
                          email=billing['email'] or '',
                          telephone=billing['telephone'] or '',
                          company=billing['company'],
                          date_added=timezone.now(),
                          **CUSTOMER_DEFAULTS)
    customer.save()

    OcAddress.objects.create(
        customer=customer,
        fullname=billing['fullname'],
        firstname=firstname,
        lastname=lastname,
        company=billing['company'],
        address_1=billing['address_1'] or '',
        address_2=billing['address_2'],
        city=billing['city'],
        area=billing['area'],
        postcode=billing['postcode'] or '',
        country_id=billing['country_id'],
        telephone=billing['telephone'] or '',
        email=billing['email'] or '',
        default_billing=1,
        default_shipping=1,
    )
    logger.info('quotes_web: created customer %s from %s', customer.pk, quote.quote_number)
    return customer, True


def _build_order(quote, customer, billing, delivery):
    store = quote.store
    bill_first, bill_last = _names(billing['fullname'])
    ship_first, ship_last = _names(delivery['fullname'])

    return OcOrder(
        store_id=quote.store_id,
        invoice_prefix=store.prefix,
        store_name=store.name,
        store_url=store.url,
        customer=customer,
        company=billing['company'],
        fullname=quote.customer_name,
        firstname=bill_first,
        lastname=bill_last,
        email=quote.customer_email,
        telephone=quote.customer_phone,

        payment_fullname=billing['fullname'],
        payment_firstname=bill_first,
        payment_lastname=bill_last,
        payment_email=billing['email'],
        payment_telephone=billing['telephone'],
        payment_company=billing['company'],
        payment_address_1=billing['address_1'],
        payment_address_2=billing['address_2'],
        payment_city=billing['city'],
        payment_area=billing['area'],
        payment_postcode=billing['postcode'],
        payment_country=billing['country'],
        payment_country_name_id=billing['country_id'],

        shipping_fullname=delivery['fullname'],
        shipping_firstname=ship_first,
        shipping_lastname=ship_last,
        shipping_email=delivery['email'],
        shipping_telephone=delivery['telephone'],
        shipping_company=delivery['company'],
        shipping_address_1=delivery['address_1'],
        shipping_address_2=delivery['address_2'],
        shipping_city=delivery['city'],
        shipping_area=delivery['area'],
        shipping_postcode=delivery['postcode'],
        shipping_country=delivery['country'],
        shipping_country_name_id=delivery['country_id'],

        comment=f'From web quote {quote.quote_number}',
        total=quote.total,
        language_id=1,
        currency_id=quote.currency_id,
        currency_code=quote.currency.code,
        currency_value=1,

        order_status_id=ORDER_STATUS_OPEN,
        order_type_id=ORDER_TYPE_EMAIL,
        payment_method_id=PAYMENT_METHOD_PROFORMA,
        payment_status_id=PAYMENT_STATUS_WAITING,

        tax_rate=store.tax_rate,
        printed=False,
        is_legacy=False,
        # the customer accepted this shipping figure, so the order must not recalculate it
        bl_custom_shipping=True,
        order_hash=hashlib.md5(uuid.uuid4().hex.encode()).hexdigest(),
    )


def _copy_lines(quote, order):
    for item in quote.items.all().order_by('line_order', 'quote_item_id'):
        line = OcOrderProduct(
            order=order,
            product_id=item.product_id or 0,
            name=item.product_name,
            model=item.variant_code or '',
            supplier_code=item.supplier_code,
            quantity=item.quantity,
            price=item.unit_price,
            total=item.line_total,
            tax=item.tax_amount,
            tax_rate_desc=f'{item.tax_rate_percent}%' if item.tax_rate_percent else None,
            reward=0,
            size_name=item.size_name,
            width=item.width or 0,
            height=item.height or 0,
            orientation_name=item.orientation_name,
            material_name=item.material_name,
            product_variant_id=item.product_variant_id,
            is_bespoke=item.is_bespoke,
            status_id=PRODUCT_STATUS_OPEN,
            exclude_discount=item.exclude_discount,
            bulk_discount_id=item.bulk_discount_id,
            bulk_used=item.bulk_used,
            single_unit_price=item.single_unit_price,
            base_unit_price=item.base_unit_price,
            supplier_id=item.supplier_id,
        )
        line.save()

        options = [
            OcTsgOrderProductOptions(
                order_product_id=line.pk,
                class_field_id=option.class_field_id,
                class_name=option.class_name,
                value_id=option.value_id,
                value_name=option.value_name,
                bl_dynamic=option.bl_dynamic,
                dynamic_class_id=option.dynamic_class_id or 0,
                dynamic_value_id=option.dynamic_value_id or 0,
                class_type_id=option.class_type_id,
            )
            for option in QuoteItemOption.objects.filter(quote_item=item)
        ]
        if options:
            OcTsgOrderProductOptions.objects.bulk_create(options)


def _create_totals(quote, order):
    """The rows a Medusa order expects; calc_order_totals fetches them by code."""
    tax_title = order.tax_rate.name if order.tax_rate_id else 'VAT'
    order.order_totals.create(code='sub_total', title='Sub-Total', value=quote.subtotal, sort_order=1)
    if quote.discount_amount:
        order.order_totals.create(code='discount', title='Discount', value=quote.discount_amount,
                                  sort_order=2)
    order.order_totals.create(code='shipping', title='Shipping', value=quote.shipping_cost or 0,
                              sort_order=3)
    order.order_totals.create(code='tax', title=tax_title, value=quote.tax_total, sort_order=5)
    order.order_totals.create(code='total', title='Total', value=quote.total, sort_order=9)


@transaction.atomic
def convert_to_order(quote, user=None):
    """Create a proforma order from an accepted quote. Returns the order.

    Refuses unless the quote is accepted, has an address and has not been converted already.
    Everything happens in one transaction: if the totals do not come out equal to the quote,
    nothing is written at all.
    """
    from apps.orders.views import calc_order_totals   # heavy module, only needed here

    if quote.status.status_code != constants.STATUS_ACCEPTED:
        raise OrderConversionError(
            f'{quote.quote_number} is {quote.status.status_name} - only an accepted quote '
            f'can become an order')
    if quote.order_id:
        raise OrderConversionError(
            f'{quote.quote_number} is already order {quote.order_id}')
    if not quote.has_billing_address():
        raise OrderConversionError(
            f'{quote.quote_number} has no billing address yet - add one before creating the order')
    if not quote.store_id or not quote.currency_id:
        raise OrderConversionError(f'{quote.quote_number} has no store or currency')

    billing = _billing(quote)
    delivery = _delivery(quote)
    customer, customer_created = customer_for(quote, billing)

    order = _build_order(quote, customer, billing, delivery)
    order.save()

    _copy_lines(quote, order)
    _create_totals(quote, order)

    # recalculates from the lines; shipping is left alone because bl_custom_shipping is set
    calc_order_totals(order.order_id)
    order.refresh_from_db()

    quoted = Decimal(str(quote.total))
    ordered = Decimal(str(order.total))
    if quoted != ordered:
        raise OrderConversionError(
            f'{quote.quote_number} totals {quoted} but the order came to {ordered} - '
            f'nothing has been saved')

    quote.order = order
    quote.save(update_fields=['order', 'updated_at'])

    # same transaction: a quote must never be left pointing at an order it is not marked for
    from .transitions import change_status
    change_status(quote, constants.STATUS_ORDER_CREATED, constants.ROLE_STAFF, user=user)

    log_action(quote, constants.ACTION_EDITED, user=user,
               data={'order_created': order.order_id, 'total': str(order.total),
                     'customer_created': customer_created})
    logger.info('quotes_web: %s became order %s (%s)',
                quote.quote_number, order.order_id, order.total)
    return order
