from django.db import models
from apps.sites.models import OcStore
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
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    category_type = models.ForeignKey(OcTsgCategoryTypes, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_category'

    @property
    def category_image_url_old(self):
        return self.categorybasedesc.image

    @property
    def category_image_url(self):
        if self.categorybasedesc.image:
            return f"{settings.MEDIA_URL}{self.categorybasedesc.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    def __str__(self):
        return self.name


class OcCategoryDescriptionBase(models.Model):
    category = models.OneToOneField(OcCategory, models.DO_NOTHING, primary_key=True, related_name='categorybasedesc')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255,  blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    image = models.ImageField(upload_to='stores/category/', blank=True, null=True)
    meta_title = models.CharField(max_length=255)
    meta_description = models.CharField(max_length=1024)
    meta_keyword = models.CharField(max_length=1024)
    adwords_name = models.CharField(max_length=255, blank=True, null=True)
    clean_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_category_description_base'


    @property
    def base_category_image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    def __str__(self):
        return self.name


class OcCategoryDescription(models.Model):
    category = models.ForeignKey(OcCategory, models.DO_NOTHING, related_name='descriptioncategory')
    store = models.ForeignKey(OcStore, models.DO_NOTHING, related_name='descriptionstore')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.CharField(max_length=1024, blank=True, null=True)
    meta_keyword = models.CharField(max_length=512, blank=True, null=True)
    adwords_name = models.CharField(max_length=255, blank=True, null=True)
    clean_url = models.CharField(max_length=255, blank=True, null=True)

    @property
    def category_image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    class Meta:
        managed = False
        db_table = 'oc_category_description'
        unique_together = (('category', 'store', 'language'),)

    def __str__(self):
        return self.name


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
    category = models.ForeignKey(OcCategory, models.DO_NOTHING, blank=True, null=True, related_name='storecategory')
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    language_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='stores/category/', blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.CharField(max_length=1024, blank=True, null=True)
    meta_keywords = models.CharField(max_length=512, blank=True, null=True)
    adwords_name = models.CharField(max_length=255, blank=True, null=True)
    clean_url = models.CharField(max_length=255, blank=True, null=True)


    def category_image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return self.category.category_image_url

    class Meta:
        managed = False
        db_table = 'oc_category_to_store'
        unique_together = (('category', 'store'),)

    def __str__(self):
        return self.category.name


class OcTsgCategoryStoreParent(models.Model):
    category_store = models.ForeignKey(OcCategoryToStore, models.DO_NOTHING, related_name='store_parent_category')
    parent = models.ForeignKey(OcCategoryToStore, models.DO_NOTHING, related_name='store_parent')
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.BooleanField(blank=True)
    path = models.CharField(max_length=255, blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    top = models.BooleanField(blank=True)
    homepage = models.BooleanField(blank=True)
    is_base = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_category_store_parent'
        unique_together = (('category_store', 'parent'),)