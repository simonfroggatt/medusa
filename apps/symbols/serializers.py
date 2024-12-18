from rest_framework import serializers
from apps.symbols.models import OcTsgSymbols
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




