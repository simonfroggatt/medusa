from rest_framework import serializers
from apps.symbols.models import OcTsgSymbols, OcTsgSymbolStandard, OcTsgSymbolShape, OcTsgSymbolPurposes, OcTsgSymbolCategory
from django.conf import settings


class SymbolShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgSymbols
        fields = [field.name for field in model._meta.fields]
        fields.extend(['symbol_image_url'])
        depth = 2


class SymbolSerializer(serializers.ModelSerializer):


    class Meta:
        model = OcTsgSymbols
        fields = [field.name for field in model._meta.fields]
        fields.extend(['symbol_image_url'])
        depth = 2


class SymbolStandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgSymbolStandard
        fields = [field.name for field in model._meta.fields]
        fields.extend(['symbol_image_url'])
        depth = 2


class SymbolShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgSymbolShape
        fields = '__all__'

class SymbolPurposeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgSymbolPurposes
        fields = '__all__'
        depth = 2

class SymbolCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgSymbolCategory
        fields = '__all__'
        depth = 2


