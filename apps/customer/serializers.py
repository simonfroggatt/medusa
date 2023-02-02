from rest_framework import serializers
from .models import OcCustomer, OcAddress


class CustomerListSerializer(serializers.ModelSerializer):


    class Meta:
        model = OcCustomer
        fields = ['customer_id', 'company', 'firstname', 'lastname', 'fullname', 'email', 'telephone', 'mobile', 'store',
                  'parent_company', 'date_added']
        depth = 2


class CustomerDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcCustomer
        fields = '__all__'
        depth = 2

class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcAddress
        fields = '__all__'