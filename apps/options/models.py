from django.db import models
from apps.products.models import OcTsgProductVariantCore, OcTsgProductVariants
# Create your models here.

class OcTsgOptionTypes(models.Model):
    option_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    descr = models.CharField(max_length=255)
    price_modifier_description = models.CharField(max_length=255)
    extra_product = models.BooleanField()
    extra_variant = models.BooleanField()

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






####  -  NEW below here  -  ###########

class OcTsgOptionClass(models.Model):
    label = models.CharField(max_length=30)
    descr = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    default_dropdown_title = models.CharField(max_length=100, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_class'

    #def __str__(self):
    #    return self.name

    def __str__(self):
        return f"{self.label} - {self.name}"


class OcTsgOptionValues(models.Model):
    option_type = models.ForeignKey(OcTsgOptionTypes, models.DO_NOTHING)
    title = models.CharField(max_length=50, blank=True, null=True)
    dropdown_title = models.CharField(max_length=255, blank=True, null=True)
    descr = models.CharField(max_length=100, blank=True, null=True)
    internal_descr = models.CharField(max_length=100, blank=True, null=True)
    product_id = models.IntegerField(blank=True, null=True)
    price_modifier = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    show_at_checkout = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_values'

    def __str__(self):
        return self.title


class OcTsgProductVariantCoreOptions(models.Model):
    product_variant = models.ForeignKey(OcTsgProductVariantCore, models.DO_NOTHING)
    option_class = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING)
    option_value = models.ForeignKey(OcTsgOptionValues, models.DO_NOTHING)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_variant_core_options'


class OcTsgOptionClassGroups(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_class_groups'

    def __str__(self):
        return self.name


class OcTsgOptionClassGroupValues(models.Model):
    group = models.ForeignKey(OcTsgOptionClassGroups, models.DO_NOTHING)
    class_field = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.
    value = models.ForeignKey(OcTsgOptionValues, models.DO_NOTHING)
    order_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_class_group_values'
        unique_together = (('id', 'group', 'class_field', 'value'),)


class OcTsgProductVariantOptions(models.Model):
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True, related_name='productvariant')
    option_class = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING, blank=True, null=True)
    option_value = models.ForeignKey(OcTsgOptionValues, models.DO_NOTHING, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_variant_options'
