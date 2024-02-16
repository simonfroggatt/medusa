from django.db import models

from apps.products.models import OcTsgProductVariantCore, OcTsgProductVariants
from medusa.models import OcLanguage


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
    product_var_core_option = models.ForeignKey(OcTsgProductVariantCoreOptions, models.DO_NOTHING, blank=True,
                                                    null=True, related_name='core_options')
    order_by = models.IntegerField(blank=True, null=True)
    isdeleted = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_variant_options'

    def delete(self, using=None, keep_parents=False):
        self.isdeleted = True
        self.save()


class OcTsgOptionClassValues(models.Model):
    option_class = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING, blank=True, null=True, related_name='values_option_class')
    option_value = models.ForeignKey('OcTsgOptionValues', models.DO_NOTHING, blank=True, null=True, related_name='value_option_value')
    order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_class_values'


class OcTsgOptionValueDynamics(models.Model):
    option_value = models.ForeignKey('OcTsgOptionValues', models.DO_NOTHING, blank=True, null=True, related_name='parent_option_value')
    dep_option_value = models.ForeignKey('OcTsgOptionValues', models.DO_NOTHING, related_name='dynamic_option_value', blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_value_dynamics'

# This is the opencart stop option type - we use it apply options at the product level

class OcTsgProductOptionType(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_option_type'

    def __str__(self):
        return self.name


class OcOption(models.Model):
    option_id = models.AutoField(primary_key=True)
    type = models.ForeignKey(OcTsgProductOptionType, models.DO_NOTHING, blank=True, null=True)
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_option'

    def __str__(self):
        description_obj = OcOptionDescription.objects.filter(language=1, option_id=self.option_id).first()
        return description_obj.name

    @property
    def option_desc(self):
        description_obj = OcOptionDescription.objects.filter(language=1, option_id=self.option_id).first()
        return description_obj.name




class OcOptionDescription(models.Model):
    option = models.ForeignKey(OcOption, models.DO_NOTHING, 'option_description')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    name = models.CharField(max_length=128)

    class Meta:
        managed = False
        db_table = 'oc_option_description'

    def __str__(self):
        return self.name


class OcOptionValue(models.Model):
    option_value_id = models.AutoField(primary_key=True)
    option = models.ForeignKey(OcOption, models.DO_NOTHING)
    image = models.CharField(max_length=255, blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_option_value'


class OcOptionValueDescription(models.Model):
    option_value = models.ForeignKey(OcOptionValue, models.DO_NOTHING, related_name='option_value')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    name = models.CharField(max_length=128)

    class Meta:
        managed = False
        db_table = 'oc_option_value_description'

    def __str__(self):
        return self.name







