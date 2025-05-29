from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response

from apps.orders.models import OcOrder
from .serializers import OrdersWithSupplierItemsSerializer, ProductsWithSupplierItemsSerializer


class Purchases(viewsets.ModelViewSet):
    queryset = OcOrder.objects.all()
    serializer_class = OrdersWithSupplierItemsSerializer
    model = serializer_class.Meta.model


# Create your views here.
def open_purchases(request):
    """
    Render the open purchases page.
    """
    return render(request, 'purchases/open_purchases.html', {})

def sent_purchases(request):
    """
    Render the open purchases page.
    """
    return render(request, 'purchases/open_purchases.html', {})