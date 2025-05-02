from rest_framework import serializers
from apps.category.models import (OcCategory, OcCategoryDescription, OcCategoryToStore, OcCategoryPath,
                                  OcTsgCategoryStoreParent, OcCategoryDescriptionBase, OcTsgCategory, OcTsgCategoryParent)
from apps.sites.models import OcStore
from django.conf import settings


class CategorySerializer(serializers.ModelSerializer):
    category_image_url = serializers.SerializerMethodField()

    class Meta:
        model = OcTsgCategory
        fields = '__all__'
        depth = 1

    def get_category_image_url(self, obj):
        return obj.category_image_url

class CategoryBaseDescriptionSerializer(serializers.ModelSerializer):

        class Meta:
            model = OcCategoryDescriptionBase
            fields = ['name', 'description', 'base_category_image_url','category_id', 'clean_url']
            depth = 1


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
        fields = ['category_store_id', 'category', 'category_image_url']
        depth = 1

class CategoryParentPaths(serializers.ModelSerializer):

    class Meta:
        model = OcTsgCategoryParent
        fields = '__all__'
        depth = 1

