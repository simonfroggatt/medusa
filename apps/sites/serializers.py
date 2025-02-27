from rest_framework import serializers
from .models import OcStore
from django.conf import settings


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcStore
        fields = ['name', 'url','status','store_id', 'store_thumb_url', 'store_logo_url', 'thumb']
        depth = 2

