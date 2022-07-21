from rest_framework import serializers
from .models import OcOrder, OcOrderProduct, OcOrderTotal
from django.conf import settings

class OrderStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOrderProduct
        fields = ['status']

class OrderListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOrder
        fields = [field.name for field in model._meta.fields]
        fields.extend(['dow', 'days_since_order', 'orderflags', 'is_order', 'testit'])

        depth = 1


class OrderProductListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOrderProduct
        #fields = ['order_id','order_product_id', 'product_id', 'name', 'model', 'quantity', 'price', 'total', 'tax', 'product_variant']
        fields = [field.name for field in model._meta.fields]
        fields.extend(['order_product_option'])
        fields.remove('order')
        depth = 3


class OrderPreviousProductListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOrderProduct
        fields = [field.name for field in model._meta.fields]
        fields.extend(['order_product_option', 'order_id'])
        fields.remove('order')
        depth = 1


class OrderTotalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcOrderTotal
        fields = ['code', 'title', 'value']