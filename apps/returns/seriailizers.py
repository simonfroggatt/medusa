from rest_framework import serializers
from apps.shipping.models import OcTsgCourier, OcTsgShippingMethod, OcTsgCourierOptions
from apps.returns.models import OcTsgReturnOrder, OcTsgReturnOrderHistory, OcTsgReturnOrderProduct, OcTsgReturnOrderProductHistory
from apps.orders.models import OcOrderProduct
from apps.products.models import OcProductToStore

class OrderReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgReturnOrder
        fields = '__all__'
        depth = 2

class OrderReturnProductSerializer(serializers.ModelSerializer):
    product_image_url = serializers.SerializerMethodField()
    def get_product_image_url(self, obj):
        if obj.order_product.product_id > 0:
            return obj.order_product.product_image_url
        else:
            return None

    class Meta:
        model = OcTsgReturnOrderProduct
        fields = ['id', 'comment', 'status', 'reason', 'order_product', 'product_image_url']
        depth = 1

class OrderReturnAvailProductsSerializer(serializers.ModelSerializer):
    product_image_url = serializers.SerializerMethodField()

    def get_product_image_url(self, obj):
        if obj.product_id > 0:
            product_id = obj.product_id
            store_id = obj.order.store_id
            product = OcProductToStore.objects.filter(product_id=product_id, store_id=store_id).first()
            return product.image_url
        else:
            return None

    class Meta:
        model = OcOrderProduct
        fields = ['order_product_id', 'product_id', 'name', 'model', 'product_image_url', 'size_name', 'material_name']
        depth = 1
