from rest_framework import serializers
from .models import OcCustomer, OcAddress



class CustomerAddressSerializer(serializers.ModelSerializer):

        class Meta:
            model = OcAddress
            fields = ['postcode', 'fullname']

class CustomerListSerializer(serializers.ModelSerializer):
    #core_postcodes = serializers.SerializerMethodField(read_only=True)
    address_customer = CustomerAddressSerializer(many=True, read_only=True)

    #def get_core_postcodes(self, customer):
    #    address_list = customer.address_customer.only('postcode')
    #    address_string = ''
    #    for address in address_list:
    #        address_string += address.postcode + ', '
    #    return address_string


    class Meta:
        model = OcCustomer
        fields = ['customer_id', 'company', 'firstname', 'lastname', 'fullname', 'email', 'telephone', 'mobile', 'store',
                  'parent_company', 'date_added', 'address_customer']


        depth = 1




class CustomerDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcCustomer
        fields = '__all__'
        depth = 2

class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcAddress
        fields = '__all__'

class CustomerListWithAddressSerializer(serializers.ModelSerializer):
    class Mete:
        model = OcCustomer
        fields = '__all__'
        depth = 2