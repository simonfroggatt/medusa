from rest_framework import serializers
from .models import OcTsgCompany


class CompanyListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgCompany
        fields = ['company_id', 'company_name', 'fullname', 'email', 'telephone', 'account_type', 'payment_terms',
                  'payment_days', 'store', 'discount', 'credit_limit', 'company_customer']
        depth = 1


class CompanyDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgCompany
        fields = '__all__'
        depth = 2
