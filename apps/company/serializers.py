from rest_framework import serializers
from .models import OcTsgCompany


class CompanyListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgCompany
        fields = '__all__'
        depth = 1

class CompanyDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgCompany
        fields = '__all__'
        depth = 2
