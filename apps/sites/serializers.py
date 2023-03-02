from rest_framework import serializers
from .models import OcStore
from django.conf import settings


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcStore
        fields = '__all__'
        depth = 2

