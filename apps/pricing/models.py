from django.db import models
from apps.sites.models import OcStore
from django.conf import settings


class StorePriceManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()

class StorePricesQuerySet(models.QuerySet):
    def get_queryset(self):
        return super().get_queryset()



class OcTsgOrientation(models.Model):
    orientation_id = models.AutoField(primary_key=True)
    orientation_name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'oc_tsg_orientation'

    def __str__(self):
        return self.orientation_name


class OcTsgProductSizes(models.Model):
    size_id = models.AutoField(primary_key=True)
    size_name = models.CharField(max_length=50)
    size_width = models.IntegerField()
    size_height = models.IntegerField()
    size_units = models.CharField(max_length=50, blank=True, null=True)
    size_extra = models.CharField(max_length=100, blank=True, null=True)
    size_template = models.IntegerField(blank=True, null=True)
    size_code = models.CharField(max_length=5, blank=True, null=True)
    symbol_default_location = models.IntegerField(blank=True, null=True)
    orientation = models.ForeignKey(OcTsgOrientation, models.DO_NOTHING, related_name='sizeorientation')
    archived = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_sizes'

    def __str__(self):
        return self.size_name
        

class OcTsgProductMaterial(models.Model):
    material_id = models.AutoField(primary_key=True)
    material_name = models.CharField(max_length=255)
    material_desc = models.CharField(max_length=255, blank=True, null=True)
    material_desc_full = models.CharField(max_length=255, blank=True, null=True)
    mounting_desc = models.CharField(max_length=255, blank=True, null=True)
    mounting_desc_full = models.CharField(max_length=255, blank=True, null=True)
    thickness_desc = models.CharField(max_length=255, blank=True, null=True)
    thickness_desc_full = models.CharField(max_length=255, blank=True, null=True)
    fixing_desc = models.CharField(max_length=255, blank=True, null=True)
    fixing_desc_full = models.CharField(max_length=255, blank=True, null=True)
    colour_desc = models.CharField(max_length=255, blank=True, null=True)
    colour_desc_full = models.CharField(max_length=255, blank=True, null=True)
    code = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='stores/materials/', blank=True, null=True)
    archived = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_material'

    def __str__(self):
        return self.material_name

    @property
    def material_image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"


class OcTsgSizeMaterialComb(models.Model):
    product_size = models.ForeignKey(OcTsgProductSizes, models.DO_NOTHING, related_name='combo_size')
    product_material = models.ForeignKey(OcTsgProductMaterial, models.DO_NOTHING, related_name='combo_material')
    price = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    bl_live = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'oc_tsg_size_material_comb'
        unique_together = (('id', 'product_size', 'product_material'),)

    #def __str__(self):
     #   return f"{self.product_size.size_name} - {self.product_material.material_name}"


class OcTsgSizeMaterialCombPrices(models.Model):
    size_material_comb = models.ForeignKey(OcTsgSizeMaterialComb, models.DO_NOTHING, related_name='sizecombo_base')
    store = models.ForeignKey(OcStore, models.DO_NOTHING)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'oc_tsg_size_material_store_combs'


class OcTsgMaterialSpec(models.Model):
    material = models.ForeignKey(OcTsgProductMaterial, models.DO_NOTHING, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    filename = models.FileField(upload_to='stores/materials/specs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cache_path = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_material_spec'

    def __str__(self):
        return self.title
