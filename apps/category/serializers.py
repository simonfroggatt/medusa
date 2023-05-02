from rest_framework import serializers
from apps.category.models import OcCategory, OcCategoryDescription, OcCategoryToStore, OcCategoryPath, OcTsgCategoryStoreParent
from apps.sites.models import OcStore
from django.conf import settings


class CategorySerialise(serializers.ModelSerializer):

    base_image_url = serializers.SerializerMethodField(read_only=True)

    def get_base_image_url(self, category):
        return f"{settings.MEDIA_URL}{category.categorybasedesc.image}"

    class Meta:
        model = OcCategory
        fields = ['category_id', 'name', 'status', 'categorybasedesc', 'base_image_url']
        depth = 2


class StoreCatsSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcCategoryToStore
        fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):

    store_cats = StoreCatsSerializer(many=True, read_only=True)

    class Meta:
        model = OcStore
        fields = ['store_id', 'thumb', 'store_cats']


class CategoryDescriptionSerialize(serializers.ModelSerializer):

    store = StoreSerializer(read_only=True)

    class Meta:
        model = OcCategoryDescription
        fields = ['id', 'category_id', 'language_id', 'name', 'description', 'image', 'category_image_url', 'store', 'category_image_url']

        depth = 3


class CategoryToStoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcCategoryToStore
        fields = [field.name for field in model._meta.fields]
        fields.extend(['category_image_url'])
        depth = 3


class CategoryStoreParentPaths(serializers.ModelSerializer):

    class Meta:
        model = OcTsgCategoryStoreParent
        fields = '__all__'
        depth = 2


class StoreCategoriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcCategoryToStore
        fields = [field.name for field in model._meta.fields]
        fields.extend(['category_image_url'])
        depth = 2

