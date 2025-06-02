from rest_framework import serializers
from apps.orders.models import OcOrder, OcOrderProduct
from apps.sites.models import OcStore

class ShortStoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcStore
        fields = ['store_id', 'thumb']

class OrdersWithSupplierItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcOrder
        fields = ['order_id', 'store', 'supplier_id', 'supplier_name']

class ProductsWithSupplierItemsSerializer(serializers.ModelSerializer):
    store_id = serializers.SerializerMethodField()
    store_logo = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()

    class Meta:
        model = OcOrderProduct
        fields = ['order_product_id','order_id', 'supplier' , 'store_id', 'store_logo', 'order_date' ]
        depth = 1

    def get_store_id(self, obj):
        return obj.order.store.store_id if obj.order and obj.order.store else None

    def get_store_logo(self, obj):
        return obj.order.store.store_thumb_cdn_url if obj.order and obj.order.store else None

    def get_order_date(self, obj):
        return obj.order.short_date
