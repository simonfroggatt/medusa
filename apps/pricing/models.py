from django.db import models
from medusa.models import OcStore
from django.conf import settings



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

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_sizes'
        

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
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_material'

    @property
    def material_image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"


class OcTsgSizeMaterialComb(models.Model):
    product_size = models.ForeignKey(OcTsgProductSizes, models.DO_NOTHING)
    product_material = models.ForeignKey(OcTsgProductMaterial, models.DO_NOTHING)
    price = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_size_material_comb'
        unique_together = (('id', 'product_size', 'product_material'),)


class OcTsgSizeMaterialCombPrices(models.Model):
    size_material_comb = models.OneToOneField(OcTsgSizeMaterialComb, models.DO_NOTHING, primary_key=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'oc_tsg_size_material_comb_prices'
        unique_together = (('size_material_comb', 'store'),)
