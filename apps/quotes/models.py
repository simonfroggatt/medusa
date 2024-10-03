from django.db import models
from medusa.models import OcTaxRate, OcTsgCountryIso
from apps.shipping.models import OcTsgShippingMethod
from apps.sites.models import OcStore, OcCurrency
from apps.customer.models import OcCustomer
from apps.products.models import OcTsgProductVariants, OcTsgBulkdiscountGroups
import datetime as dt


class OcTsgQuote(models.Model):
    quote_id = models.AutoField(primary_key=True)
    quote_ref = models.CharField(max_length=32, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, related_name='quote_store')
    customer = models.ForeignKey(OcCustomer, models.DO_NOTHING, blank=True, null=True, related_name='quote_customer')
    company = models.CharField(max_length=255, blank=True, null=True)
    fullname = models.CharField(max_length=255)
    email = models.CharField(max_length=96)
    telephone = models.CharField(max_length=32, blank=True, null=True)
    quote_address = models.CharField(max_length=512, blank=True, null=True)
    quote_city = models.CharField(max_length=128, blank=True, null=True)
    quote_area = models.CharField(max_length=255, blank=True, null=True)
    quote_postcode = models.CharField(max_length=10, blank=True, null=True)
    quote_country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    total = models.DecimalField(max_digits=15, decimal_places=2)
    language_id = models.IntegerField()
    currency = models.ForeignKey(OcCurrency, models.DO_NOTHING)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    days_valid = models.IntegerField(blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, db_column='tax_rate')
    sent = models.BooleanField(blank=True, null=True)
    shipping_type = models.ForeignKey(OcTsgShippingMethod, models.DO_NOTHING, blank=True, null=True)
    shipping_rate = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    date_sent = models.DateTimeField(blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)



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
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=15, decimal_places=4)
    discount = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    discount_type = models.IntegerField(db_column='discount_Type', blank=True, null=True)  # Field name made lowercase.
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

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_product'



