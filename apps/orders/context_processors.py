from django.conf import settings
from .models import OcOrder, OcOrderProduct
from django.db.models import Min

def new_orders_count(request):
    return {
        'new_orders_count': OcOrder.objects.new().count()
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