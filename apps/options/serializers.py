from rest_framework import serializers
from .models import OcTsgOptionValues, OcTsgOptionClassGroups, OcTsgOptionTypes, OcTsgOptionClass, \
    OcTsgOptionClassGroupValues, OcTsgOptionValues, OcTsgOptionClassValues, OcTsgProductOption, OcOptionValues


class OptionValuesSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOptionValues
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
        model = OcTsgOptionClass
        #fields = [field.name for field in model._meta.fields]
        #read_only_fields = (['drop_down'])
        #fields.extend(['drop_down'])
        fields = '__all__'
        depth = 2


class OptionGroupValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOptionClassGroupValues
        fields = '__all__'
        depth = 2


class OptionClassPredefinedValuesSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOptionClassValues
        fields = '__all__'
        depth = 2




class ProductOptionValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOptionValues
        fields = '__all__'
        depth = 1