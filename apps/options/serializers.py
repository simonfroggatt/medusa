from rest_framework import serializers
from .models import OcTsgOptionValuesBase, OcTsgOptionClassGroups, OcTsgOptionTypes, OcTsgOptionClassBase


class OptionValueBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOptionValuesBase
        fields = '__all__'
        depth = 2


class OptionGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOptionClassGroups
        fields = '__all__'
        depth = 2


class OptionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOptionTypes
        fields = '__all__'
        depth = 2


class OptionClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOptionClassBase
        fields = '__all__'
        depth = 2