from django.db import models
from medusa.models import OcStore
from apps.products.models import OcTsgCategoryTypes
from django.conf import settings


class OcLanguage(models.Model):
    language_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=32)
    code = models.CharField(max_length=5)
    locale = models.CharField(max_length=255)
    image = models.CharField(max_length=64)
    directory = models.CharField(max_length=32)
    sort_order = models.IntegerField()
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_language'

    def __str__(self):
        return self.name


class OcCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255)
    parent_id = models.IntegerField()
    top = models.IntegerField()
    column = models.IntegerField()
    sort_order = models.IntegerField()
    status = models.IntegerField()
    date_added = models.DateTimeField()
    date_modified = models.DateTimeField()
    category_type = models.ForeignKey(OcTsgCategoryTypes, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_category'

    @property
    def category_image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    def __str__(self):
        return self.name


class OcCategoryDescriptionBase(models.Model):
    category = models.OneToOneField(OcCategory, models.DO_NOTHING, primary_key=True, related_name='categorybasedesc')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.CharField(max_length=255, blank=True, null=True)
    meta_title = models.CharField(max_length=255)
    meta_description = models.CharField(max_length=1024)
    meta_keyword = models.CharField(max_length=512)
    adwords_name = models.CharField(max_length=255, blank=True, null=True)
    clean_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_category_description_base'



class OcCategoryDescription(models.Model):
    category_desc_id = models.AutoField(primary_key=True)
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.CharField(max_length=255, blank=True, null=True)
    meta_title = models.CharField(max_length=255)
    meta_description = models.CharField(max_length=1024)
    meta_keyword = models.CharField(max_length=512)
    adwords_name = models.CharField(max_length=255, blank=True, null=True)
    clean_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_category_description'


class OcCategoryPath(models.Model):
    category_id = models.IntegerField(primary_key=True)
    path_id = models.IntegerField()
    level = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_category_path'
        unique_together = (('category_id', 'path_id'),)


class OcCategoryToStore(models.Model):
    category_store_id = models.AutoField(primary_key=True)
    category = models.ForeignKey(OcCategory, models.DO_NOTHING, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    category_desc = models.ForeignKey(OcCategoryDescription, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_category_to_store'
        unique_together = (('category', 'store'),)