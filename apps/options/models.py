from django.db import models
from apps.products.models import OcTsgProductVariantCore
# Create your models here.

class OcTsgOptionTypes(models.Model):
    option_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    descr = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_types'

    def __str__(self):
        return self.name


class OcTsgOptionClassBase(models.Model):
    option_class_id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=30)
    descr = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_class_base'


class OcTsgOptionValuesBase(models.Model):
    option_value_id = models.AutoField(primary_key=True)
    option_type = models.ForeignKey(OcTsgOptionTypes, models.DO_NOTHING)
    title = models.CharField(max_length=50, blank=True, null=True)
    dropdown_title = models.CharField(max_length=255, blank=True, null=True)
    descr = models.CharField(max_length=100, blank=True, null=True)
    internal_name = models.CharField(max_length=100, blank=True, null=True)
    product_id = models.IntegerField(blank=True, null=True)
    price_modifier = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    show_at_checkout = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_values_base'


class OcTsgVariantOptionsBase(models.Model):
    product_variant = models.OneToOneField(OcTsgProductVariantCore, models.DO_NOTHING, primary_key=True)
    option_class = models.ForeignKey(OcTsgOptionClassBase, models.DO_NOTHING)
    option_class_value = models.ForeignKey(OcTsgOptionValuesBase, models.DO_NOTHING, db_column='option_class_value')
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_variant_options_base'
        unique_together = (('product_variant', 'option_class', 'option_class_value'),)


class OcTsgOptionClassGroups(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_class_groups'
