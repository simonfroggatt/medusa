from rest_framework import serializers
from .models import OcTsgCompany


class CompanyListSerializer(serializers.ModelSerializer):
    accounts_contact_fullname = serializers.ReadOnlyField()

    class Meta:
        model = OcTsgCompany
        fields = '__all__'
        depth = 1
        read_only_fields = ['accounts_contact_fullname']

class CompanyDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgCompany
        fields = '__all__'
        depth = 2
