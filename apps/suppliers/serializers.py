from rest_framework import serializers
from .models import OcSupplier

class SupplierListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcSupplier
        fields = '__all__'
        depth = 1

