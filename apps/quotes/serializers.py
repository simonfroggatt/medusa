from rest_framework import serializers
from .models import OcTsgQuote, OcTsgQuoteProduct


class QuoteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgQuote
        fields = '__all__'
        depth = 2


class QuoteProductListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgQuoteProduct
        #fields = ['order_id','order_product_id', 'product_id', 'name', 'model', 'quantity', 'price', 'total', 'tax', 'product_variant']
        fields = [field.name for field in model._meta.fields]
        #fields.extend(['order_product_option'])
        fields.remove('quote')
        depth = 3
