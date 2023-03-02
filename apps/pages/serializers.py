from rest_framework import serializers
from .models import OcTsgBlogs, OcInformationToStore, OcInformationDescription
from django.conf import settings


class BlogSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgBlogs
        fields = '__all__'
        depth = 2


class InformationSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcInformationDescription
        fields = '__all__'
        depth = 2
