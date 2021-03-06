from django.db import models
from medusa.models import OcStore, OcTsgCategoryTypes, OcLanguage
from django.conf import settings
from apps.pricing.models import OcTsgSizeMaterialComb, OcTsgSizeMaterialCombPrices


class OcProduct(models.Model):
    product_id = models.AutoField(primary_key=True)
    model = models.CharField(max_length=64)
    location = models.CharField(max_length=128)
    image = models.CharField(max_length=255, blank=True, null=True)
    manufacturer_id = models.IntegerField()
    tax_class_id = models.IntegerField()
    sort_order = models.IntegerField()
    status = models.IntegerField()
    viewed = models.IntegerField()
    date_added = models.DateTimeField()
    date_modified = models.DateTimeField()
    mib_logo = models.IntegerField(blank=True, null=True)
    include_google_merchant = models.IntegerField(blank=True, null=True)

    @property
    def image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    class Meta:
        managed = False
        db_table = 'oc_product'


class OcProductDescription(models.Model):
    product = models.OneToOneField(OcProduct, models.DO_NOTHING, primary_key=True, related_name='productdescbysite')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    store = models.ForeignKey(OcStore, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tag = models.TextField(blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.CharField(max_length=255, blank=True, null=True)
    meta_keyword = models.CharField(max_length=255, blank=True, null=True)
    long_description = models.TextField(blank=True, null=True)
    sign_reads = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_product_description'
        unique_together = (('product', 'store', 'language'),)


class OcProductDescriptionBase(models.Model):
    product = models.OneToOneField(OcProduct, models.DO_NOTHING, primary_key=True, related_name='productdescbase')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    tag = models.TextField()
    meta_title = models.CharField(max_length=255)
    meta_description = models.CharField(max_length=255)
    meta_keyword = models.CharField(max_length=255)
    long_description = models.TextField(blank=True, null=True)
    sign_reads = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_product_description_base'
        unique_together = (('product', 'language'),)


class OcProductToStore(models.Model):
    product = models.ForeignKey(OcProduct, models.DO_NOTHING, related_name='productstore')
    store = models.OneToOneField(OcStore, models.DO_NOTHING, primary_key=True)
    product_desc = models.ForeignKey(OcProductDescription, models.DO_NOTHING, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_product_to_store'
        unique_together = (('store', 'product'),)


class OcTsgProductMaterial(models.Model):
    material_id = models.AutoField(primary_key=True)
    material_name = models.CharField(max_length=255, db_collation='latin1_swedish_ci')
    material_desc = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    material_desc_full = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    mounting_desc = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    mounting_desc_full = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    thickness_desc = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    thickness_desc_full = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    fixing_desc = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    fixing_desc_full = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    colour_desc = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    colour_desc_full = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    code = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)
    image = models.CharField(max_length=255, db_collation='latin1_swedish_ci', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_material'


class OcTsgProductSizes(models.Model):
    size_id = models.AutoField(primary_key=True)
    size_name = models.CharField(max_length=50, db_collation='latin1_swedish_ci')
    size_width = models.IntegerField(blank=True, null=True)
    size_height = models.IntegerField(blank=True, null=True)
    size_units = models.CharField(max_length=50, db_collation='latin1_swedish_ci', blank=True, null=True)
    size_orientation = models.CharField(max_length=20, db_collation='latin1_swedish_ci', blank=True, null=True)
    size_extra = models.CharField(max_length=100, db_collation='latin1_swedish_ci', blank=True, null=True)
    size_template = models.IntegerField(blank=True, null=True)
    size_code = models.CharField(max_length=5, db_collation='latin1_swedish_ci')
    symbol_default_location = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_sizes'



class OcTsgProductVariantCore(models.Model):
    prod_variant_core_id = models.IntegerField(primary_key=True)
    product = models.ForeignKey('OcProduct', models.DO_NOTHING, blank=True, null=True, related_name='corevariants')
    size_material = models.ForeignKey(OcTsgSizeMaterialComb, models.DO_NOTHING, blank=True, null=True, related_name='sizematerials')
    supplier_id = models.IntegerField(blank=True, null=True)
    supplier_code = models.CharField(max_length=255, blank=True, null=True)
    supplier_price = models.DecimalField(max_digits=5, decimal_places=2)
    exclude_fpnp = models.IntegerField()
    variant_image = models.CharField(max_length=244, blank=True, null=True)
    gtin = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_variant_core'

    @property
    def variant_image_url(self):
        if self.variant_image:
            return f"{settings.MEDIA_URL}{self.variant_image}"
        else:
            return self.product.image_url


class OcTsgProductVariants(models.Model):
    prod_variant_id = models.AutoField(primary_key=True)
    prod_var_core = models.ForeignKey(OcTsgProductVariantCore, models.DO_NOTHING, related_name='storeproductvariants')
    variant_code = models.CharField(max_length=255, blank=True, null=True)
    variant_overide_price = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    alt_image = models.CharField(max_length=255, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING)
    digital_artwork = models.IntegerField(blank=True, null=True)
    digital_artwork_price = models.FloatField(blank=True, null=True)
    digital_artwork_def = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_variants'
        unique_together = (('prod_variant_id', 'prod_var_core'),)


class OcTsgDepOptionClass(models.Model):
    option_class_id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=30)
    descr = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    store = models.ForeignKey(OcStore, models.DO_NOTHING)
    default_dropdown_title = models.CharField(max_length=100)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_dep_option_class'


class OcTsgProductVariantOptions(models.Model):
    product_variant = models.OneToOneField('OcTsgProductVariants', models.DO_NOTHING, primary_key=True, related_name='productvariant')
    option_class = models.ForeignKey(OcTsgDepOptionClass, models.DO_NOTHING, related_name='optionclass')
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_variant_options'
        unique_together = (('product_variant', 'option_class'),)


class OcTsgDepOptionOptions(models.Model):
    option_options_id = models.AutoField(primary_key=True)
    option_type = models.ForeignKey('OcTsgDepOptionTypes', models.DO_NOTHING, related_name='optiontypes')
    title = models.CharField(max_length=50, blank=True, null=True)
    dropdown_title = models.CharField(max_length=255, blank=True, null=True)
    descr = models.CharField(max_length=100, blank=True, null=True)
    internal_descr = models.CharField(max_length=100, blank=True, null=True)
    product_id = models.IntegerField(blank=True, null=True)
    extra_option_class_id_old = models.IntegerField(blank=True, null=True)
    price_modifier = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    show_at_checkout = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_dep_option_options'


class OcTsgDepOptionTypes(models.Model):
    option_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    descr = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'oc_tsg_dep_option_types'


class OcTsgDepOptionClassValues(models.Model):
    option_class = models.OneToOneField(OcTsgDepOptionClass, models.DO_NOTHING, primary_key=True, related_name='value_optionclass')
    option_value = models.ForeignKey('OcTsgDepOptionOptions', models.DO_NOTHING, related_name='optionvalues')
    order_by = models.IntegerField()
    store = models.ForeignKey(OcStore, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'oc_tsg_dep_option_class_values'
        unique_together = (('option_class', 'option_value'),)


class OcTsgOptionDepExtra(models.Model):
    option_class_id = models.IntegerField(primary_key=True)
    option_options_id = models.IntegerField()
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_option_dep_extra'
        unique_together = (('option_class_id', 'option_options_id'),)


class OcTsgProductSymbols(models.Model):
    product = models.OneToOneField(OcProduct, models.DO_NOTHING, primary_key=True, related_name='productsymbols')
    symbol = models.ForeignKey('OcTsgSymbols', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_symbols'
        unique_together = (('product', 'symbol'),)


class OcTsgSymbolCategory(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=2048, blank=True, null=True)
    default_colour_rgb = models.CharField(db_column='default_colour_RGB', max_length=20, blank=True, null=True)  # Field name made lowercase.
    default_colour_hex = models.CharField(db_column='default_colour_HEX', max_length=10, blank=True, null=True)  # Field name made lowercase.
    default_text_hex = models.CharField(db_column='default_text_HEX', max_length=10, blank=True, null=True)  # Field name made lowercase.
    default_colour = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbol_category'

    def __str__(self):
        return self.title


class OcTsgSymbolStandards(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    target_url = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbol_standards'

    def __str__(self):
        return self.title


class OcTsgSymbols(models.Model):
    image_path = models.CharField(max_length=255, blank=True, null=True)
    refenceno = models.CharField(max_length=48, blank=True, null=True)
    referent = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=1024, blank=True, null=True)
    content = models.CharField(max_length=1024, blank=True, null=True)
    hazard = models.CharField(max_length=1024, blank=True, null=True)
    humanbehav = models.CharField(max_length=1024, blank=True, null=True)
    svg_path = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(OcTsgCategoryTypes, models.DO_NOTHING, db_column='category', blank=True, null=True, related_name='symbolcats')
    standard = models.ForeignKey(OcTsgSymbolStandards, models.DO_NOTHING, blank=True, null=True, related_name='symbolstandards')
    image_width = models.IntegerField(blank=True, null=True)
    image_height = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbols'

    @property
    def symbol_image_url(self):
       return f"{settings.MEDIA_URL}{self.image_path}"


class OcTsgBulkdiscountGroups(models.Model):
    bulk_group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=255)
    is_active = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_tsg_bulkdiscount_groups'

    def __str__(self):
        return self.group_name


class OcTsgBulkdiscountGroupBreaks(models.Model):
    bulk_breaks_id = models.AutoField(primary_key=True)
    bulk_discount_group = models.ForeignKey(OcTsgBulkdiscountGroups, models.DO_NOTHING, related_name='discountgroup')
    qty_range_min = models.IntegerField()
    discount_percent = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_tsg_bulkdiscount_group_breaks'


class OcTsgProductToBulkDiscounts(models.Model):
    product = models.OneToOneField(OcProduct, models.DO_NOTHING, primary_key=True, related_name='productbulkdiscounts')
    bulk_discount_group = models.ForeignKey(OcTsgBulkdiscountGroups, models.DO_NOTHING)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_to_bulk_discounts'
        unique_together = (('product', 'bulk_discount_group'),)




