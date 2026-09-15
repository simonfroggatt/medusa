from django.conf import settings
from .models import OcOrder, OcOrderProduct
from django.db.models import Min

def new_orders_count(request):
    return {
        'new_orders_count': OcOrder.objects.new().count()
    }

def artwork_orders_count(request):
    counts = {
        'artwork_orders_count': OcOrder.objects.artwork().count()
    }
    # Admin Tools order counts ride on this already-registered processor so no settings.py change is needed
    counts.update(_admin_order_counts(request))
    return counts


def _admin_order_counts(request):
    """Sidebar badges for the Admin Tools order lists; only worked out for superusers, who are the only ones shown them."""
    user = getattr(request, 'user', None)
    if not (user and user.is_authenticated and user.groups.filter(name='superuser').exists()):
        return {}
    return {
        'awaiting_artwork_count': OcOrder.objects.awaiting_artwork().count(),
        'supplier_items_count': OcOrder.objects.supplier_items().count(),
        'ready_to_collect_count': OcOrder.objects.ready_to_collect().count(),
    }

def js_version(request):
    from django.conf import settings
    return {
        'js_version': settings.JS_VERSION
    }

def new_supplier_purchases_count(request):
    status_filter_list = [settings.TSG_ORDER_PRODUCT_SUPPLIER_ITEM]

    subquery = (
        OcOrderProduct.objects
        .filter(
            status_id__in=status_filter_list
        )
        .exclude(
            supplier_id=settings.TSG_SUPPLIER_ID
        )
        .values('order_id', 'supplier_id')
        .annotate(min_id=Min('order_product_id'))
        .values_list('min_id', flat=True)
    )
    return {
        'new_supplier_purchases_count': subquery.distinct().count()
    }