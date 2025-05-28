from django.db import models
from medusa.models import OcTaxRate, OcTsgCountryIso, OcTsgFileTypes
from apps.shipping.models import OcTsgShippingMethod
from apps.sites.models import OcStore, OcCurrency
from apps.customer.models import OcCustomer
from apps.products.models import OcTsgProductVariants, OcTsgBulkdiscountGroups
from apps.options.models import OcTsgOptionClass, OcTsgOptionValues, OcOptionValues, OcTsgProductOption, OcTsgOptionTypes
import datetime as dt
from decimal import Decimal, ROUND_HALF_UP
from django.conf import settings
import os

class OcTsgQuote(models.Model):
    quote_id = models.AutoField(primary_key=True)
    quote_ref = models.CharField(max_length=32, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, related_name='quote_store')
    customer = models.ForeignKey(OcCustomer, models.DO_NOTHING, blank=True, null=True, related_name='quote_customer')
    company = models.CharField(max_length=255, blank=True, null=True)
    fullname = models.CharField(max_length=255)
    firstname = models.CharField(max_length=255, blank=True, null=True)
    lastname = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=96)
    telephone = models.CharField(max_length=32, blank=True, null=True)
    payment_fullname = models.CharField(max_length=255, blank=True, null=True)
    payment_email = models.CharField(max_length=255, blank=True, null=True)
    payment_telephone = models.CharField(max_length=255, blank=True, null=True)
    payment_company = models.CharField(max_length=255, blank=True, null=True)
    payment_address = models.CharField(max_length=512, blank=True, null=True)
    payment_city = models.CharField(max_length=128, blank=True, null=True)
    payment_area = models.CharField(max_length=255, blank=True, null=True)
    payment_postcode = models.CharField(max_length=10, blank=True, null=True)
    payment_country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, blank=True, null=True)
    shipping_company = models.CharField(max_length=255, blank=True, null=True)
    shipping_fullname = models.CharField(max_length=255, blank=True, null=True)
    shipping_email = models.CharField(max_length=255, blank=True, null=True)
    shipping_telephone = models.CharField(max_length=255, blank=True, null=True)
    shipping_address = models.CharField(max_length=512, blank=True, null=True)
    shipping_city = models.CharField(max_length=128, blank=True, null=True)
    shipping_area = models.CharField(max_length=255, blank=True, null=True)
    shipping_postcode = models.CharField(max_length=10, blank=True, null=True)
    shipping_country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, related_name='quote_shipping_country_set', blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    total = models.DecimalField(max_digits=15, decimal_places=2)
    language_id = models.IntegerField()
    currency = models.ForeignKey(OcCurrency, models.DO_NOTHING)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    days_valid = models.IntegerField(blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, db_column='tax_rate')
    sent = models.BooleanField(blank=True, null=True)
    date_sent = models.DateTimeField(blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    shipping_type = models.ForeignKey(OcTsgShippingMethod, models.DO_NOTHING, blank=True, null=True)
    shipping_rate = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    quote_hash = models.CharField(max_length=255, blank=True, null=True)

    def valid_until(self):
        ordered = dt.datetime(self.date_added.year, self.date_added.month, self.date_added.day)
        delta = ordered + dt.timedelta(days=self.days_valid)
        return delta

    def is_past_valid(self):
        ordered = dt.datetime(self.date_added.year, self.date_added.month, self.date_added.day)
        valid_til = ordered + dt.timedelta(days=self.days_valid)
        today = dt.datetime.now()
        return today > valid_til

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote'


class OcTsgQuoteProduct(models.Model):
    quote_product_id = models.AutoField(primary_key=True)
    quote = models.ForeignKey(OcTsgQuote, models.DO_NOTHING, related_name='product_quote')
    product_id = models.IntegerField()
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=64)
    supplier_code = models.CharField(max_length=64)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=15, decimal_places=4)
    discount = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    discount_type = models.IntegerField(db_column='discount_Type', blank=True, null=True)  
    total = models.DecimalField(max_digits=15, decimal_places=4)
    tax = models.DecimalField(max_digits=15, decimal_places=4)
    tax_rate_desc = models.CharField(max_length=10, blank=True, null=True)
    size_name = models.CharField(max_length=256, blank=True, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    height = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    orientation_name = models.CharField(max_length=255, blank=True, null=True)
    material_name = models.CharField(max_length=255, blank=True, null=True)
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True,
                                        related_name='quote_product_variant')
    is_bespoke =  models.BooleanField(default=False)
    line_discount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    exclude_discount = models.BooleanField(default=False)
    bulk_discount = models.ForeignKey(OcTsgBulkdiscountGroups, models.DO_NOTHING, blank=True, null=True)
    bulk_used =  models.BooleanField(default=True)
    single_unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    base_unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    @property
    def product_image_url(self):
        if self.product_variant.alt_image_url:
            return self.product_variant.alt_image_url
        else:
            return ''

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_product'


class OcTsgQuoteStatus(models.Model):
    quote_status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=32)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_status'
        ordering = ['order_by']

    def __str__(self):
        return self.name


class OcTsgQuoteHistory(models.Model):
    quote_history_id = models.AutoField(primary_key=True)
    quote = models.ForeignKey(OcTsgQuote, models.DO_NOTHING, related_name='quote_history')
    status = models.ForeignKey(OcTsgQuoteStatus, models.DO_NOTHING, blank=True, null=True)
    notify = models.BooleanField(default=False)
    comment = models.TextField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_history'


class OcTsgQuoteDocuments(models.Model):
    quote = models.ForeignKey(OcTsgQuote, models.DO_NOTHING, related_name='quote_documents')
    type = models.ForeignKey(OcTsgFileTypes, models.DO_NOTHING)
    description = models.CharField(max_length=255, blank=True, null=True)
    filename = models.FileField(upload_to='medusa/quote/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cache_path = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.quote.quote_ref} - {self.title}"

    def short_name(self):
        return os.path.basename(self.filename.name) if self.filename else ''

    def cdn_name(self):
        if self.cache_path:
            return f"{settings.CDN_URL}/{self.cache_path}"
        return None

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_documents'


class OcTsgQuoteProductOptions(models.Model):
    quote_product = models.ForeignKey(OcTsgQuoteProduct, models.DO_NOTHING, related_name='quote_product_options')
    class_field = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING, db_column='class_id', blank=True, null=True)
    class_name = models.CharField(max_length=255, blank=True, null=True)
    value = models.ForeignKey(OcTsgOptionValues, models.DO_NOTHING, blank=True, null=True)
    value_name = models.CharField(max_length=255, blank=True, null=True)
    bl_dynamic = models.BooleanField(default=False)
    dynamic_class_id = models.IntegerField(blank=True, null=True)
    dynamic_value_id = models.IntegerField(blank=True, null=True)
    class_type = models.ForeignKey(OcTsgOptionTypes, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_product_options'
