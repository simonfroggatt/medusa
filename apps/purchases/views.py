from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.conf import settings
from apps.orders.models import OcOrder, OcOrderProduct
from .serializers import OrdersWithSupplierItemsSerializer, ProductsWithSupplierItemsSerializer
from django.db.models import Min

class Purchases(viewsets.ModelViewSet):
    queryset = OcOrderProduct.objects.all()
    serializer_class = ProductsWithSupplierItemsSerializer
    model = serializer_class.Meta.model

    def get_queryset(self):
        status_filter = self.request.query_params.get('status')
        if status_filter == 'NEW':
            status_filter_list = [settings.TSG_ORDER_PRODUCT_SUPPLIER_ITEM]
        elif status_filter == 'SENT':
            status_filter_list = [8, 12]
        else:
            status_filter_list = []

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

        return OcOrderProduct.objects.filter(order_product_id__in=subquery).order_by('order_id')



# Create your views here.
def open_purchases(request):
    template_name = 'purchases/purchases_list.html'
    context = {'heading': 'New Supplier Purchases',}
    breadcrumbs = []
    context['breadcrumbs'] = breadcrumbs
    context['purchase_status'] = 'NEW'

    return render(request, template_name, context)

def sent_purchases(request):
    template_name = 'purchases/purchases_list.html'
    context = {'heading': 'Sent Supplier Purchases', }
    breadcrumbs = []
    context['breadcrumbs'] = breadcrumbs
    context['purchase_status'] = 'SENT'

    return render(request, template_name, context)


def get_supplier_list(order_id):
    #get a list of the suppliers
    supplier_list = OcOrderProduct.objects.filter(
        order_id=order_id,
        supplier_id__isnull=False,
        status_id__in=[settings.TSG_ORDER_PRODUCT_SUPPLIER_ITEM]
    ).exclude(
        supplier_id=settings.TSG_SUPPLIER_ID
    ).values('supplier_id', 'supplier__code').distinct()
    return supplier_list
