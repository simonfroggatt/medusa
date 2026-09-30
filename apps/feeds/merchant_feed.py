"""
What we tell Google Merchant Center about a store's products.

Builds one offer per store variant for the Merchant API sync. Deliberately
separate from GoogleMerchantViewSet (the old XML file feed), which is left as
it was until the API feed has replaced it.

An offer is a plain dict; merchant_api.to_product_input turns it into the API's
ProductInput. Everything is loaded in a handful of queries so a whole store can
be built nightly.
"""
import datetime
import logging
import re
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from html import unescape

from django.utils import timezone

from apps.category.models import OcTsgCategoryParent
from apps.orders.models import OcOrderProduct
from apps.products.models import (
    OcProductImage,
    OcProductToStore,
    OcTsgProductToCategory,
    OcTsgProductVariantCore,
    OcTsgProductVariants,
)
from apps.symbols.models import OcTsgProductSymbols

logger = logging.getLogger('apps')

VAT_MULTIPLIER = Decimal('1.20')
DEFAULT_SHIPPING_EX_VAT = Decimal('3.95')  # per order
IN_HOUSE_SUPPLIER_ID = 1  # Safety signs and notices Ltd; every other supplier is bought in
MIN_HANDLING_DAYS = 0
MAX_HANDLING_DAYS = 2  # 48 hours max despatch

# False: the variant allowed into ads is the cheapest one (Simon's rule).
# True: the cheapest one that has sold, through any channel, in the last
# AD_SALES_MONTHS months, falling back to the cheapest when nothing has sold.
AD_VARIANT_REQUIRES_SALES = False
AD_SALES_MONTHS = 12

TITLE_MAX = 150
DESCRIPTION_MAX = 5000
MAX_ADDITIONAL_IMAGES = 10

# (upper bound inc VAT, label); anything above the last bound is over_40
PRICE_BANDS = [
    (Decimal('5'), 'under_5'),
    (Decimal('15'), '5_to_15'),
    (Decimal('40'), '15_to_40'),
]


def clean_description(text):
    text = unescape(text or '')
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def money(value):
    return Decimal(value).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def price_band(price):
    for bound, label in PRICE_BANDS:
        if price < bound:
            return label
    return 'over_40'


def store_base_url(store):
    """The https address the shop answers on. oc_store.url is the old http one."""
    base = (store.ssl or '').strip() or (store.url or '').strip()
    return base.rstrip('/') + '/'


def product_link(base_url, clean_url, product_id, variant_id):
    if clean_url:
        return f"{base_url}{clean_url}?variantid={variant_id}"
    return f"{base_url}index.php?route=product/product&product_id={product_id}&variantid={variant_id}"


def truncate(text, limit):
    if len(text) <= limit:
        return text
    return text[:limit - 1].rstrip() + '…'


def rank_variants(variants, sold_ids=None):
    """
    Label each of a product's variants by price, and pick the one allowed into ads.

    `variants` are dicts with 'id', 'price', 'material_id' and 'ads_blocked'.
    Returns ({variant id: custom_label_0}, ad variant id or None).
    One variant per product is 'cheapest_variant', one per other material is
    'cheapest_material', the rest are 'other'.
    """
    ordered = sorted(variants, key=lambda v: (v['price'], v['id']))
    labels = {}
    seen_materials = set()
    for index, v in enumerate(ordered):
        if index == 0:
            labels[v['id']] = 'cheapest_variant'
        elif v['material_id'] not in seen_materials:
            labels[v['id']] = 'cheapest_material'
        else:
            labels[v['id']] = 'other'
        seen_materials.add(v['material_id'])

    candidates = [v for v in ordered if not v['ads_blocked']]
    if sold_ids is not None:
        selling = [v for v in candidates if v['id'] in sold_ids]
        candidates = selling or candidates
    ad_variant_id = candidates[0]['id'] if candidates else None
    return labels, ad_variant_id


def _category_path(category, parents):
    names = []
    current, seen = category, set()
    while current and current.pk not in seen:
        seen.add(current.pk)
        if current.name:
            names.append(current.name)
        current = parents.get(current.pk)
    return ' > '.join(reversed(names))


def _sold_variant_ids(store, variant_ids):
    since = timezone.now() - datetime.timedelta(days=30 * AD_SALES_MONTHS)
    return set(
        OcOrderProduct.objects.filter(
            order__store=store,
            order__date_added__gte=since,
            product_variant_id__in=variant_ids,
        ).values_list('product_variant_id', flat=True).distinct()
    )


def build_offers(store, product_ids=None):
    """
    Offers for every Merchant-flagged product in `store`, or just `product_ids`.

    Returns (offers, skipped) where skipped counts why products were left out.
    """
    skipped = defaultdict(int)

    store_products = (
        OcProductToStore.objects
        .filter(store=store, status=True, include_google_merchant=True, product__status=True)
        .select_related('product', 'product__productdescbase')
    )
    if product_ids is not None:
        store_products = store_products.filter(product_id__in=product_ids)
    store_products = list(store_products)
    pids = [sp.product_id for sp in store_products]
    if not pids:
        return [], dict(skipped)

    # First active category per product, same choice as the XML feed
    categories = {}
    for link in (OcTsgProductToCategory.objects
                 .filter(product_id__in=pids, status=True)
                 .select_related('category')
                 .order_by('pk')):
        categories.setdefault(link.product_id, link.category)

    parents = {}
    for link in (OcTsgCategoryParent.objects
                 .filter(category__store=store, parent__isnull=False)
                 .select_related('parent')
                 .order_by('sort_order', 'pk')):
        parents.setdefault(link.category_id, link.parent)

    standards = {
        ps.product_id: ps.symbol_standard.compliance.title
        for ps in (OcTsgProductSymbols.objects
                   .filter(product_id__in=pids)
                   .select_related('symbol_standard__compliance'))
        if ps.symbol_standard and ps.symbol_standard.compliance
    }

    images = defaultdict(list)
    for img in OcProductImage.objects.filter(product_id__in=pids, main=False).order_by('sort_order', 'pk'):
        if img.image:
            images[img.product_id].append(img.image_url)

    cores = {
        core.pk: core
        for core in (OcTsgProductVariantCore.objects
                     .filter(product_id__in=pids)
                     .select_related('product',
                                     'size_material__product_size',
                                     'size_material__product_material'))
    }
    store_variants = defaultdict(list)
    for sv in (OcTsgProductVariants.objects
               .filter(store=store, isdeleted=False, prod_var_core_id__in=list(cores))):
        store_variants[cores[sv.prod_var_core_id].product_id].append(sv)

    sold_ids = None
    if AD_VARIANT_REQUIRES_SALES:
        all_ids = [sv.pk for svs in store_variants.values() for sv in svs]
        sold_ids = _sold_variant_ids(store, all_ids)

    base_url = store_base_url(store)
    offers = []

    for sp in store_products:
        product = sp.product
        base_desc = getattr(product, 'productdescbase', None)
        if base_desc is None:
            skipped['no base description'] += 1
            continue

        category = categories.get(product.pk)
        if category is None:
            skipped['no category'] += 1
            continue
        if not category.status:
            skipped['category offline'] += 1
            continue

        title = sp.name or base_desc.name
        description = truncate(clean_description(sp.description or base_desc.description), DESCRIPTION_MAX)
        google_cat = sp.google_shopping_category_id or category.google_cat_id
        standard = standards.get(product.pk)

        variant_rows = []
        for sv in store_variants.get(product.pk, []):
            core = cores[sv.prod_var_core_id]
            size_material = core.size_material
            unit_price = sv.variant_overide_price or size_material.price
            if not unit_price:
                continue
            variant_rows.append({
                'sv': sv,
                'core': core,
                'id': sv.pk,
                'price': money(unit_price * VAT_MULTIPLIER),
                'material_id': size_material.product_material_id,
                'ads_blocked': (not sp.include_google_ads) or sv.exclude_google_ads,
            })

        if not variant_rows:
            skipped['no priced variants'] += 1
            continue

        labels, ad_variant_id = rank_variants(variant_rows, sold_ids)

        for row in variant_rows:
            sv, core = row['sv'], row['core']
            size_name = core.size_material.product_size.size_name
            material_name = core.size_material.product_material.material_name

            shipping_ex_vat = core.shipping_cost if core.shipping_cost and core.shipping_cost > 0 else DEFAULT_SHIPPING_EX_VAT
            mpn = (core.supplier_code or '').strip()

            offers.append({
                'offer_id': str(sv.pk),
                'product_id': product.pk,
                'item_group_id': str(product.pk),
                'title': truncate(f"{title} - {size_name} - {material_name}", TITLE_MAX),
                'description': description,
                'link': product_link(base_url, base_desc.clean_url, product.pk, sv.pk),
                'image_link': core.variant_image_url,
                'additional_image_links': images.get(product.pk, [])[:MAX_ADDITIONAL_IMAGES],
                'availability': 'in_stock' if core.bl_live else 'out_of_stock',
                'price': row['price'],
                'brand': store.name,
                'mpn': mpn,
                'google_product_category': str(google_cat) if google_cat else '',
                'product_type': _category_path(category, parents),
                'size': size_name,
                'material': material_name,
                'product_highlights': [f"Product conforms to {standard}"] if standard else [],
                'shipping_price': money(shipping_ex_vat * VAT_MULTIPLIER),
                'min_handling_days': MIN_HANDLING_DAYS,
                'max_handling_days': MAX_HANDLING_DAYS,
                'show_in_ads': sv.pk == ad_variant_id,
                'custom_labels': [
                    labels[sv.pk],
                    material_name,
                    'in_house' if core.supplier_id == IN_HOUSE_SUPPLIER_ID else 'bought_in',
                    price_band(row['price']),
                    (product.google_tag or '').strip(),
                ],
            })

    return offers, dict(skipped)


def store_variant_ids_for_product(store, product_id):
    """Every variant id this product has ever had in the store, deleted or not."""
    return set(
        str(pk) for pk in OcTsgProductVariants.objects
        .filter(store=store, prod_var_core__product_id=product_id)
        .values_list('pk', flat=True)
    )
