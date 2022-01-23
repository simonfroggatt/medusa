from rest_framework import serializers
from .models import OcCategory
from django.conf import settings


class CategorySerialise(serializers.ModelSerializer):

    def get_category_image_url(self, category):
        return f"{settings.MEDIA_URL}{category.image}"

    class Meta:
        model = OcCategory
        fields = ['category_id', 'name', 'category_image_url', 'status', 'categorybasedesc']
        depth = 2
