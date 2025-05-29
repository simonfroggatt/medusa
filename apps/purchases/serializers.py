from rest_framework import serializers
from apps.orders.models import OcOrder, OcOrderProduct


class OrdersWithSupplierItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcOrder
        fields = ['order_id', 'store', 'supplier_id', 'supplier_name']

class ProductsWithSupplierItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcOrderProduct
        fields = ['order_id']