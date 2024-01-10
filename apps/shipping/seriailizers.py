from rest_framework import serializers
from apps.shipping.models import OcTsgCourier, OcTsgShippingMethod, OcTsgCourierOptions


class CourierSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgCourier
        fields = '__all__'


class CourierOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgCourierOptions
        fields = '__all__'


class MethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgShippingMethod
        fields = '__all__'
        depth = 2

