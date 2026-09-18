"""Creating and pricing customer quotes.

Request-free: no `request` object reaches this module, so the same calls can later run from a
management command or a background job (the apps/emails/supplier_orders.py pattern).

Pricing note: the storefront prices the cart (variant price cascade, bulk band, option
add-ons) and posts the figures it showed the customer; they are frozen here as given. The
only pricing this module does itself is the bulk band, so staff changing a quantity get the
same answer the cart would have given - see apply_bulk_discount().
"""
import json
import logging
import secrets
from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction

from apps.options.models import OcTsgOptionValues, OcTsgProductOption
from apps.products.models import OcProduct, OcProductToStore, OcTsgBulkdiscountGroups
from apps.sites.models import OcStore

from .. import constants
from ..models import Quote, QuoteAction, QuoteItem, QuoteItemOption, QuoteStatus
from .exceptions import EmptyCart, QuoteNotEditable, QuotesWebError

logger = logging.getLogger(__name__)

MONEY = Decimal('0.01')
LINE_MONEY = Decimal('0.0001')


def _money(value, places=MONEY):
    return Decimal(str(value or 0)).quantize(places, rounding=ROUND_HALF_UP)


def quote_number_for(store, quote_id):
    """QW-<store prefix>-<quote id>, e.g. QW-SSAN-12. One sequence across all stores."""
    prefix = (getattr(store, 'prefix', None) or constants.STORE_PREFIX_FALLBACK).strip()
    return f'{constants.QUOTE_NUMBER_PREFIX}-{prefix}-{quote_id}'


def generate_public_token():
    """64 url-safe characters, used as the customer's only credential for their quote."""
    return secrets.token_urlsafe(48)


def portal_url(quote):
    """The customer's link, on their own store's domain (the page is served by tsg_store).

    Returns '' when the store has no usable URL, so the staff page can say so rather than
    handing out a broken link.
    """
    store = quote.store if quote.store_id else None
    if store is None:
        return ''

    base = (store.ssl or '').strip()
    if not base or base == 'none':
        base = (store.url or '').strip()
    if not base or base == 'none':
        return ''

    return f'{base.rstrip("/")}/index.php?route=tsg/quote&token={quote.public_token}'


def bulk_group_id_for(product_id, store_id):
    """Same rule as the storefront: the store's bulk group if set, else the product's."""
    if not product_id:
        return None
    store_group = (OcProductToStore.objects
                   .filter(product_id=product_id, store_id=store_id)
                   .values_list('bulk_group_id', flat=True)
                   .first())
    if store_group:
        return store_group
    return (OcProduct.objects
            .filter(pk=product_id)
            .values_list('bulk_group_id', flat=True)
            .first())


def bulk_discount_percent(bulk_group_id, quantity):
    """Highest band whose qty_range_min <= quantity, as the cart does."""
    if not bulk_group_id:
        return Decimal('0.00')
    group = OcTsgBulkdiscountGroups.objects.filter(pk=bulk_group_id).first()
    if not group:
        return Decimal('0.00')
    band = (group.discountgroup
            .filter(qty_range_min__lte=quantity)
            .order_by('-qty_range_min')
            .first())
    return _money(band.discount_percent) if band else Decimal('0.00')


def apply_bulk_discount(single_unit_price, discount_percent):
    """Storefront maths: round(price * (1 - discount/100), 2)."""
    price = Decimal(str(single_unit_price or 0))
    factor = (Decimal('100') - Decimal(str(discount_percent or 0))) / Decimal('100')
    return _money(price * factor)


def option_price_total(item):
    """What the chosen options (drill holes and the like) add to one unit.

    Tolerates a line that has not been saved yet, and plain objects without the related
    manager, so the pricing maths can be tested without a database.
    """
    options = getattr(item, 'options', None)
    if not getattr(item, 'pk', None) or options is None:
        return Decimal('0.0000')

    total = Decimal('0.0000')
    for option in options.all():
        total += _money(option.price_modifier, LINE_MONEY)
    return total


def pre_bulk_price(item):
    """Variant price plus options - the figure the bulk band is applied to.

    Matches the storefront, which discounts (base price + option add-ons) together. Falls back
    to single_unit_price for lines created before base_unit_price existed.
    """
    base = getattr(item, 'base_unit_price', None) or item.single_unit_price
    return _money(_money(base, LINE_MONEY) + option_price_total(item), LINE_MONEY)


def reprice_line(item):
    """Unit price for the line's current quantity, from its pre-bulk price and bulk group."""
    single = pre_bulk_price(item)
    if not item.bulk_used:
        return _money(single)
    percent = bulk_discount_percent(item.bulk_discount_id, item.quantity)
    return apply_bulk_discount(single, percent)


def store_tax_rate(store):
    """Tax comes from the store, not the customer's country (decision 4)."""
    if getattr(store, 'tax_rate_id', None) and store.tax_rate:
        return _money(store.tax_rate.rate)
    return Decimal('0.00')


def recalculate_totals(quote, save=True):
    """Totals from the current lines: subtotal + tax + shipping - discount."""
    subtotal = Decimal('0.00')
    tax_total = Decimal('0.00')
    for item in quote.items.all():
        subtotal += _money(item.line_total)
        tax_total += _money(item.tax_amount)
    quote.subtotal = subtotal
    quote.tax_total = tax_total
    quote.total = (subtotal + tax_total
                   + _money(quote.shipping_cost) - _money(quote.discount_amount))
    if save:
        quote.save(update_fields=['subtotal', 'tax_total', 'total', 'updated_at'])
    return quote


def ensure_editable(quote):
    """Lines and totals may only change while the quote is draft or under review.

    Once it is sent, the customer may be looking at it - staff must pull it back to draft
    first, which is a logged status change.
    """
    if quote.status.status_code not in constants.EDITABLE_STATUS_CODES:
        raise QuoteNotEditable(
            f'{quote.quote_number} is {quote.status.status_name} and cannot be changed. '
            f'Return it to draft first.')


PRICING_FIELDS = ['quantity', 'bulk_used', 'unit_price', 'single_unit_price', 'line_total',
                  'tax_amount']
DETAIL_FIELDS = ['product_name', 'product_variant_id', 'variant_code', 'size_name', 'width',
                 'height', 'orientation_name', 'material_name', 'supplier_id', 'supplier_code',
                 'base_unit_price']


def _price_line(item):
    """Set unit price, line total and tax from the line's quantity and pricing choice."""
    item.single_unit_price = pre_bulk_price(item)
    if item.bulk_used:
        item.unit_price = _money(reprice_line(item), LINE_MONEY)
    item.line_total = _money(Decimal(str(item.unit_price)) * item.quantity, LINE_MONEY)
    rate = _money(item.tax_rate_percent or 0)
    item.tax_amount = _money(item.line_total * rate / Decimal('100'), LINE_MONEY)
    return item


def update_item(quote, item, *, quantity, bulk_used, unit_price=None, product_name=None,
                detail=None):
    """Staff edit of one line, including a swap to a different variant.

    `detail` carries whatever the variants table filled in (size, material, orientation, code,
    supplier, and that variant's own price as base_unit_price). With bulk pricing on, the unit
    price is worked out again from variant price + options, then the band for the quantity -
    the same maths the storefront cart uses.
    """
    ensure_editable(quote)

    if product_name:
        item.product_name = product_name
    for field, value in (detail or {}).items():
        setattr(item, field, value)

    item.quantity = int(quantity)
    item.bulk_used = bool(bulk_used)
    if not item.bulk_used and unit_price is not None:
        item.unit_price = _money(unit_price, LINE_MONEY)

    _price_line(item)
    item.save(update_fields=PRICING_FIELDS + DETAIL_FIELDS)
    recalculate_totals(quote)
    return item


def _option_price_modifier(value_id):
    """An option's price comes from oc_tsg_option_values, not from the browser.

    The dialog works out a preview price client-side; trusting that would let a posted form
    set any price it liked, so the figure stored is looked up here.
    """
    if not value_id:
        return Decimal('0.0000')
    modifier = (OcTsgOptionValues.objects
                .filter(pk=value_id)
                .values_list('price_modifier', flat=True)
                .first())
    return _money(modifier or 0, LINE_MONEY)


def set_item_options(item, post_data):
    """Replace a line's options from a posted dialog.

    Two kinds arrive, exactly as they do for an order:
      * variant options (drill holes, laminate) as a JSON array in selected_option_values_frm
      * product options as product_option_<id> keys
    Both are stored in oc_tsg_quote_item_options, with the wording kept alongside the ids.
    """
    QuoteItemOption.objects.filter(quote_item=item).delete()
    rows = []

    raw = post_data.get('selected_option_values_frm') or ''
    if len(raw) > 1:
        try:
            selected = json.loads(raw)
        except ValueError:
            logger.warning('quotes_web: could not read selected options for line %s', item.pk)
            selected = []

        for option in selected:
            value_id = option.get('value_id') or None
            rows.append(QuoteItemOption(
                quote_item=item,
                class_field_id=option.get('class_id') or None,
                class_name=option.get('class_label'),
                value_id=value_id,
                value_name=option.get('value_label'),
                bl_dynamic=bool(option.get('is_dynamic')),
                class_type_id=option.get('addontype') or None,
                price_modifier=_option_price_modifier(value_id),
            ))

    for key, value in post_data.items():
        if not key.startswith('product_option_') or not value:
            continue
        parts = key.split('_')
        option_id = parts[2] if len(parts) > 2 else None
        label = (OcTsgProductOption.objects
                 .filter(pk=option_id)
                 .values_list('label', flat=True)
                 .first())
        rows.append(QuoteItemOption(
            quote_item=item,
            class_name=label or 'Option',
            value_name=value,
            price_modifier=Decimal('0.0000'),
        ))

    if rows:
        QuoteItemOption.objects.bulk_create(rows)
    return rows


def create_item(quote, values, post_data=None):
    """Add a line to a quote (staff "Add Product"), priced like every other line."""
    ensure_editable(quote)

    item = QuoteItem(quote=quote, **values)
    item.tax_rate_percent = store_tax_rate(quote.store) if quote.store_id else Decimal('0.00')
    item.line_order = (quote.items.count() or 0) + 1

    # price it before the insert: line_total and tax_amount cannot be null. Options are not
    # attached yet (they need the line's id), so this first pass counts none of them.
    _price_line(item)
    item.save()

    if post_data is not None and set_item_options(item, post_data):
        # options are known now, so the price is worked out again with them included
        _price_line(item)
        item.save(update_fields=PRICING_FIELDS)

    recalculate_totals(quote)
    logger.info('quotes_web: added %s to %s', item.product_name, quote.quote_number)
    return item


def delete_item(quote, item):
    ensure_editable(quote)
    name = item.product_name
    item.delete()
    recalculate_totals(quote)
    return name


def update_header(quote, *, shipping_cost=None, discount_amount=None, expiry_date=None,
                  notes=None):
    """Shipping, discount, expiry and staff notes. Totals are recalculated from the lines."""
    ensure_editable(quote)

    quote.shipping_cost = _money(shipping_cost)
    quote.discount_amount = _money(discount_amount)
    quote.expiry_date = expiry_date
    quote.notes = notes or None
    quote.save(update_fields=['shipping_cost', 'discount_amount', 'expiry_date', 'notes',
                              'updated_at'])
    recalculate_totals(quote)
    return quote


def bulk_bands_for(quote):
    """Bulk bands for every group used on this quote, so the page can show staff the price
    before they save. Same shape as the order dialogs use."""
    group_ids = {item.bulk_discount_id for item in quote.items.all() if item.bulk_discount_id}
    if not group_ids:
        return []
    from apps.products import services as product_services
    return product_services.create_bulk_arrays(
        OcTsgBulkdiscountGroups.objects.filter(pk__in=group_ids))


def log_action(quote, action_type, user=None, data=None, ip_address=None, user_agent=None):
    """One row per thing that happened to a quote. Staff actions carry the user."""
    return QuoteAction.objects.create(
        quote=quote,
        action_type=action_type,
        action_data=json.dumps(data) if data else None,
        user_id=getattr(user, 'id', None),
        ip_address=ip_address,
        user_agent=(user_agent or '')[:1000] or None,
    )


def _build_item(quote, line, tax_rate, store_id, line_order):
    """One quote line from a posted cart line. Prices are taken as sent, not recalculated."""
    quantity = int(line['quantity'])
    unit_price = _money(line['unit_price'], LINE_MONEY)
    single_unit_price = _money(line.get('single_unit_price') or unit_price, LINE_MONEY)
    base_unit_price = _money(line.get('base_unit_price') or single_unit_price, LINE_MONEY)
    line_total = _money(unit_price * quantity, LINE_MONEY)
    rate = _money(line.get('tax_rate_percent', tax_rate))
    bespoke_data = line.get('bespoke_data')
    product_id = line.get('product_id') or None  # bespoke cart lines arrive as 0

    return QuoteItem(
        quote=quote,
        product_id=product_id,
        product_variant_id=line.get('product_variant_id') or None,
        product_name=line['product_name'],
        variant_code=line.get('variant_code'),
        size_name=line.get('size_name') or None,
        width=line.get('width') or None,
        height=line.get('height') or None,
        orientation_name=line.get('orientation_name') or None,
        material_name=line.get('material_name') or None,
        supplier_id=line.get('supplier_id') or None,
        supplier_code=line.get('supplier_code') or None,
        quantity=quantity,
        unit_price=unit_price,
        single_unit_price=single_unit_price,
        base_unit_price=base_unit_price,
        bulk_discount_id=bulk_group_id_for(product_id, store_id),
        bulk_used=bool(line.get('bulk_used', True)),
        line_total=line_total,
        tax_amount=_money(line_total * rate / Decimal('100'), LINE_MONEY),
        tax_rate_percent=rate,
        product_image=line.get('product_image'),
        is_bespoke=bool(line.get('is_bespoke', False)),
        # reserved for genuine bespoke content now that the detail has real columns
        bespoke_data=json.dumps(bespoke_data) if isinstance(bespoke_data, (dict, list)) else bespoke_data,
        line_order=line_order,
    )


def _save_item_options(item, options):
    """Options chosen in the cart (drill holes and the like), kept with their wording.

    The storefront knows the class and value ids from oc_cart.tsg_options, so they are stored
    too - the names alone would not survive an option being renamed later.
    """
    rows = []
    for option in options or []:
        if not isinstance(option, dict):
            continue
        rows.append(QuoteItemOption(
            quote_item=item,
            class_field_id=option.get('class_id') or None,
            class_name=option.get('class_label') or option.get('label'),
            value_id=option.get('value_id') or None,
            value_name=option.get('value_label') or option.get('value'),
            bl_dynamic=bool(option.get('bl_dynamic', False)),
            price_modifier=_money(option.get('price') or 0, LINE_MONEY),
        ))

    if rows:
        QuoteItemOption.objects.bulk_create(rows)
    return rows


@transaction.atomic
def create_quote(*, store_id, customer_name, customer_phone, lines,
                 customer_email=None, medusa_customer_id=None, notes=None,
                 created_from=constants.CREATED_FROM_WEBSITE):
    """Create a quote and its lines from a storefront request. Returns the Quote."""
    if not lines:
        raise EmptyCart('No cart lines were sent with the quote request')

    store = OcStore.objects.filter(pk=store_id).first()
    if store is None:
        raise QuotesWebError(f'Unknown store {store_id}')
    if not store.currency_id:
        raise QuotesWebError(f'Store {store_id} has no currency set')

    status = QuoteStatus.objects.get(status_code=constants.STATUS_REQUESTED)
    token = generate_public_token()

    quote = Quote.objects.create(
        quote_number=f'TMP-{token[:24]}',  # replaced below, once the row has its id
        public_token=token,
        customer_name=customer_name,
        customer_phone=customer_phone,
        customer_email=customer_email or None,
        medusa_customer_id=medusa_customer_id or None,
        status=status,
        created_from=created_from,
        store=store,
        currency_id=store.currency_id,
        notes=notes or None,
    )
    quote.quote_number = quote_number_for(store, quote.quote_id)
    quote.save(update_fields=['quote_number'])

    tax_rate = store_tax_rate(store)
    for order, line in enumerate(lines, start=1):
        # saved one at a time (a handful per quote) because the options need the line's id
        item = _build_item(quote, line, tax_rate, store.store_id, order)
        item.save()
        _save_item_options(item, line.get('options'))

    recalculate_totals(quote)
    log_action(quote, constants.ACTION_CREATED,
               data={'lines': len(lines), 'created_from': created_from})
    logger.info('quotes_web: created %s (store %s, %s lines, total %s)',
                quote.quote_number, store.store_id, len(lines), quote.total)
    return quote
