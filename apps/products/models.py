from django.db import models
from medusa.models import OcTsgCategoryTypes, OcLanguage
from apps.sites.models import OcStore
from django.conf import settings
from apps.pricing.models import OcTsgSizeMaterialComb, OcTsgSizeMaterialCombPrices
from medusa.models import OcTaxRate, OcSupplier, OcTaxClass, OcTsgFileTypes
from apps.category.models import OcCategoryToStore

class OcProduct(models.Model):
    product_id = models.AutoField(primary_key=True)
    model = models.CharField(max_length=64)
    location = models.CharField(max_length=128)
    image = models.ImageField(upload_to='stores/products/')
    manufacturer_id = models.IntegerField()
    tax_class = models.ForeignKey(OcTaxClass, models.DO_NOTHING)
    sort_order = models.IntegerField()
    status = models.BooleanField()
    viewed = models.IntegerField()
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    mib_logo = models.BooleanField()
    supplier = models.ForeignKey(OcSupplier, models.DO_NOTHING, blank=True, null=True, related_name='productsupplier')
    bulk_group = models.ForeignKey('OcTsgBulkdiscountGroups', models.DO_NOTHING, blank=True, null=True, related_name='product_bulkgroup')

    @property
    def image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    class Meta:
        managed = False
        db_table = 'oc_product'


class OcProductDescriptionBase(models.Model):
    product = models.OneToOneField(OcProduct, models.DO_NOTHING, primary_key=True, related_name='productdescbase')
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    tag = models.TextField(blank=True, null=True)
    meta_title = models.CharField(max_length=255)
    meta_description = models.CharField(max_length=255)
    meta_keyword = models.CharField(max_length=255)
    long_description = models.TextField(blank=True, null=True)
    sign_reads = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_product_description_base'
        unique_together = (('product', 'language'),)

    def __str__(self):
        return self.name


class OcProductToStore(models.Model):
    product = models.ForeignKey(OcProduct, models.DO_NOTHING, related_name='storeproduct')
    store = models.ForeignKey(OcStore, models.DO_NOTHING, related_name='productstore')
    status = models.BooleanField()
    price_from = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    image = models.ImageField(upload_to='stores/products/', null=True, blank=True)
    include_google_merchant = models.BooleanField()
    tax_class = models.ForeignKey(OcTaxClass, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    long_description = models.TextField(blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.CharField(max_length=255, blank=True, null=True)
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)
    sign_reads = models.TextField(blank=True, null=True)
    tag = models.CharField(max_length=512, blank=True, null=True)
    bulk_group = models.ForeignKey('OcTsgBulkdiscountGroups', models.DO_NOTHING, blank=True, null=True, related_name='store_product_bulkgroup')

    @property
    def image_url(self):
        if self.image:
            return f"{settings.MEDIA_URL}{self.image}"
        else:
            return self.product.image_url


    class Meta:
        managed = False
        db_table = 'oc_product_to_store'
        unique_together = (('store', 'product'),)


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

    def __str__(self):
        return self.size_name



class OcTsgProductVariantCore(models.Model):
    prod_variant_core_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(OcProduct, models.DO_NOTHING, blank=True, null=True, related_name='corevariants')
    size_material = models.ForeignKey(OcTsgSizeMaterialComb, models.DO_NOTHING, related_name='sizematerials')
    supplier = models.ForeignKey(OcSupplier, models.DO_NOTHING, blank=True, null=True)
    supplier_code = models.CharField(max_length=255, blank=True, null=True)
    supplier_price = models.DecimalField(max_digits=5, decimal_places=2)
    exclude_fpnp = models.BooleanField()
    variant_image = models.ImageField(upload_to='stores/products/', null=True, blank=True)
    gtin = models.CharField(max_length=255, blank=True, null=True)
    shipping_cost = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    bl_live = models.BooleanField()
    lead_time_override = models.IntegerField(default=0)
    pack_count = models.IntegerField(default=1)


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
    variant_overide_price = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=0.00)
    alt_image = models.ImageField(upload_to='stores/products/', null=True, blank=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING)
    digital_artwork = models.IntegerField(blank=True, null=True)
    digital_artwork_price = models.FloatField(blank=True, null=True)
    digital_artwork_def = models.IntegerField(blank=True, null=True)
    isdeleted = models.BooleanField()


    class Meta:
        managed = False
        db_table = 'oc_tsg_product_variants'

    @property
    def alt_image_url(self):
        if self.alt_image:
            return f"{settings.MEDIA_URL}{self.alt_image}"
        else:
            return self.prod_var_core.variant_image_url

    @property
    def site_variant_image_url(self):
        if self.alt_image:  #we have an alternative for this variant
            return f"{settings.MEDIA_URL}{self.alt_image}"
        else: #no image - now check core_variant
            if self.prod_var_core.variant_image:  #the core variant has a variant image
                return f"{settings.MEDIA_URL}{self.prod_var_core.variant_image}"
            else: #check if the product site info has an image
                store_image = OcProductToStore.objects.filter(store_id=self.store_id, product_id=self.prod_var_core.product_id).values('image').first()
                if store_image['image']:
                    return f"{settings.MEDIA_URL}{store_image['image']}"
                else:
                    return f"{settings.MEDIA_URL}{self.prod_var_core.product.image}"










# class OcTsgDepOptionClass(models.Model):
#     option_class_id = models.AutoField(primary_key=True)
#     label = models.CharField(max_length=30)
#     descr = models.CharField(max_length=100)
#     name = models.CharField(max_length=100)
#     store = models.ForeignKey(OcStore, models.DO_NOTHING)
#     default_dropdown_title = models.CharField(max_length=100)
#     order_by = models.IntegerField(blank=True, null=True)
#
#     class Meta:
#         managed = False
#         db_table = 'oc_tsg_dep_option_class'
#
#     def __str__(self):
#         return self.name


# class OcTsgProductVariantOptions(models.Model):
#     product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True, related_name='productvariant')
#     option_class = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING, blank=True, null=True)
#     #option_value = models.ForeignKey(OcTsgOptionValues, models.DO_NOTHING, blank=True, null=True)
#     order_by = models.IntegerField(blank=True, null=True)
#
#     class Meta:
#         managed = False
#         db_table = 'oc_tsg_product_variant_options'


# class OcTsgDepOptionOptions(models.Model):
#     option_options_id = models.AutoField(primary_key=True)
#     option_type = models.ForeignKey('OcTsgDepOptionTypes', models.DO_NOTHING, related_name='optiontypes')
#     title = models.CharField(max_length=50, blank=True, null=True)
#     dropdown_title = models.CharField(max_length=255, blank=True, null=True)
#     descr = models.CharField(max_length=100, blank=True, null=True)
#     internal_descr = models.CharField(max_length=100, blank=True, null=True)
#     product_id = models.IntegerField(blank=True, null=True)
#     extra_option_class_id_old = models.IntegerField(blank=True, null=True)
#     price_modifier = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
#     image = models.CharField(max_length=255, blank=True, null=True)
#     store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
#     show_at_checkout = models.BooleanField()
#
#     class Meta:
#         managed = False
#         db_table = 'oc_tsg_dep_option_options'
#
#     def __str__(self):
#         return self.title
#
#
# class OcTsgDepOptionTypes(models.Model):
#     option_type_id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=20)
#     descr = models.CharField(max_length=255)
#
#     class Meta:
#         managed = False
#         db_table = 'oc_tsg_dep_option_types'
#
#     def __str__(self):
#         return self.name
#
#
# class OcTsgDepOptionClassValues(models.Model):
#     option_class = models.OneToOneField(OcTsgDepOptionClass, models.DO_NOTHING, primary_key=True, related_name='value_optionclass')
#     option_value = models.ForeignKey('OcTsgDepOptionOptions', models.DO_NOTHING, related_name='optionvalues')
#     order_by = models.IntegerField()
#     store = models.ForeignKey(OcStore, models.DO_NOTHING)
#
#     class Meta:
#         managed = False
#         db_table = 'oc_tsg_dep_option_class_values'
#         unique_together = (('option_class', 'option_value'),)
#
#
# class OcTsgOptionDepExtra(models.Model):
#     option_class_id = models.IntegerField(primary_key=True)
#     option_options_id = models.IntegerField()
#     order_by = models.IntegerField(blank=True, null=True)
#
#     class Meta:
#         managed = False
#         db_table = 'oc_tsg_option_dep_extra'
#         unique_together = (('option_class_id', 'option_options_id'),)


class OcTsgBulkdiscountGroups(models.Model):
    bulk_group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=255)
    is_active = models.BooleanField()

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


class OcProductToCategory(models.Model):
    product = models.ForeignKey(OcProduct, models.DO_NOTHING)
    category_store = models.ForeignKey(OcCategoryToStore, models.DO_NOTHING)
    status = models.BooleanField()


    class Meta:
        managed = False
        db_table = 'oc_product_to_category'


class OcProductRelated(models.Model):
    product = models.ForeignKey(OcProductToStore, models.DO_NOTHING, related_name='relatedmaster')
    related = models.ForeignKey(OcProductToStore, models.DO_NOTHING, related_name='relatedslave')
    order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_product_related'
        unique_together = (('product', 'related'),)


class OcProductImage(models.Model):
    product_image_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(OcProduct, models.DO_NOTHING, related_name='productimage')
    image = models.ImageField(upload_to='stores/images/additional/',)
    sort_order = models.IntegerField()
    main = models.BooleanField()
    alt_text = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_product_image'


class OcStoreProductImages(models.Model):
    store_product = models.ForeignKey(OcProductToStore, models.DO_NOTHING, blank=True, null=True, related_name='storeproduct')
    image = models.ForeignKey(OcProductImage, models.DO_NOTHING, blank=True, null=True, related_name='productimage')
    order_id = models.IntegerField(blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_store_product_images'


class OcTsgProductDocuments(models.Model):
    product = models.ForeignKey(OcProduct, models.DO_NOTHING, blank=True, null=True)
    type = models.ForeignKey(OcTsgFileTypes, models.DO_NOTHING, blank=True, null=True, related_name='product_document_type')
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    filename = models.filename = models.FileField(upload_to='medusa/product/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cache_path = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_documents'

    def __str__(self):
        return self.title
