from rest_framework import serializers
from .models import OcTsgProductSizes, OcTsgProductMaterial, OcTsgSizeMaterialComb, OcTsgSizeMaterialCombPrices
from apps.sites.models import OcStore


class SizesSerializer(serializers.ModelSerializer):


    fullsize_name = serializers.SerializerMethodField()

    def get_fullsize_name(self, obj):
        return f'{obj.size_width} {obj.size_height}'

    class Meta:
        model = OcTsgProductSizes

        fields = [field.name for field in model._meta.fields]
        fields.extend(['fullsize_name'])

        depth = 2


class MaterialsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgProductMaterial
        fields = '__all__'
        depth = 2


class BasePricesSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgSizeMaterialComb
        fields = '__all__'
        depth = 1


class BespokePricesSerializer(serializers.ModelSerializer):

    square_meter_value = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = OcTsgSizeMaterialComb
        fields = ['id', 'price', 'product_size', 'product_material', 'square_meter_value']
        depth = 1

    def get_square_meter_value(self, obj):
        return (obj.product_size.size_width * obj.product_size.size_height) / (1000 * 1000)

class StoreSimpleSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcStore
        fields = ['store_id', 'thumb']


class StorePriceSerializer(serializers.ModelSerializer):
    size_material_comb = BasePricesSerializer(read_only=True)
    store = StoreSimpleSerializer(read_only=True)

    class Meta:
        model = OcTsgSizeMaterialCombPrices
        fields = ['id', 'price', 'size_material_comb', 'store']
        depth = 1