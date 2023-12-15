from rest_framework import serializers
from apps.products.models import OcTsgBulkdiscountGroups, OcTsgBulkdiscountGroupBreaks


class BulkdiscountGroupsSerialiser(serializers.ModelSerializer):
    class Meta:
        model = OcTsgBulkdiscountGroups
        fields = '__all__'


class BulkdiscountGroupBreaksSerialiser(serializers.ModelSerializer):
    class Meta:
        model = OcTsgBulkdiscountGroupBreaks
        fields = '__all__'