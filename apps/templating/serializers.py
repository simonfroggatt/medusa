from rest_framework import serializers
from apps.templating.models import OcTsgTemplates
from django.conf import settings


class TemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgTemplates
        fields = '__all__'
        depth = 2

