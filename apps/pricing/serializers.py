from rest_framework import serializers
from .models import OcTsgProductSizes, OcTsgProductMaterial, OcTsgSizeMaterialComb, OcTsgSizeMaterialCombPrices


class SizesSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgProductSizes
        fields = '__all__'
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
        depth = 2


class StorePriceSerializer(serializers.ModelSerializer):
    size_material_comb = BasePricesSerializer(read_only=True)

    class Meta:
        model = OcTsgSizeMaterialCombPrices
        fields = ['id', 'price', 'size_material_comb', 'store']
        depth = 2