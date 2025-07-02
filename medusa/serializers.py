from rest_framework import serializers
from .models import OcTsgComplianceStandards

class OcTsgComplianceStandardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgComplianceStandards
        fields = '__all__' 