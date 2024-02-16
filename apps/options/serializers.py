from rest_framework import serializers
from .models import OcTsgOptionValues, OcTsgOptionClassGroups, OcTsgOptionTypes, OcTsgOptionClass, \
    OcTsgOptionClassGroupValues, OcTsgOptionValues, OcTsgOptionClassValues, OcOption, OcOptionDescription, \
    OcOptionValueDescription, OcOptionValue


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


class ProductOptionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOption
        fields = '__all__'
        depth = 2


class ProductOptionsDescSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOptionDescription
        fields = '__all__'
        depth = 2


class ProductOptionValueExtSerialiszer(serializers.ModelSerializer):
    option_desc = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OcOptionValue
        fields = [field.name for field in model._meta.fields]
        fields.extend(['option_desc'])

    def get_option_desc(self, obj):
        return obj.option.option_desc


class ProductOptionValueDescSerializer(serializers.ModelSerializer):
    option_value = ProductOptionValueExtSerialiszer(many=False, read_only=True)

    class Meta:
        model = OcOptionValueDescription
        fields = '__all__'

        depth = 4