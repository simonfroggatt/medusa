from django.db import models
from medusa.models import OcStore, OcTaxRate


class OcTsgCompanyType(models.Model):
    company_type_id = models.AutoField(primary_key=True)
    company_type_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_company_type'


class OcTsgAccountType(models.Model):
    account_type_id = models.AutoField(primary_key=True)
    account_type_name = models.CharField(max_length=32, blank=True, null=True)
    account_type_description = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_account_type'


class OcTsgPaymentTerms(models.Model):
    terms_id = models.AutoField(primary_key=True)
    term_title = models.CharField(max_length=255, blank=True, null=True)
    shortcode = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_terms'


class OcTsgCustomerStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    status_title = models.CharField(max_length=32, blank=True, null=True)
    status_description = models.CharField(max_length=512, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_customer_status'


class OcCustomer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    customer_group_id = models.IntegerField()
    store = models.ForeignKey(OcStore, on_delete=models.DO_NOTHING)
    language_id = models.IntegerField()
    company = models.CharField(max_length=255, blank=True, null=True)
    firstname = models.CharField(max_length=32)
    lastname = models.CharField(max_length=32)
    email = models.CharField(max_length=96)
    telephone = models.CharField(max_length=32)
    mobile = models.CharField(max_length=32, blank=True, null=True)
    fax = models.CharField(max_length=32, blank=True, null=True)
    password = models.CharField(max_length=40)
    salt = models.CharField(max_length=9)
    cart = models.TextField(blank=True, null=True)
    wishlist = models.TextField(blank=True, null=True)
    newsletter = models.IntegerField(blank=True, null=True)
    address_id = models.IntegerField(blank=True, null=True)
    custom_field = models.TextField(blank=True, null=True)
    ip = models.CharField(max_length=40)
    status = models.IntegerField()
    safe = models.IntegerField(blank=True, null=True)
    token = models.TextField(blank=True, null=True)
    code = models.CharField(max_length=40, blank=True, null=True)
    date_added = models.DateTimeField()
    xero_id = models.CharField(max_length=256, blank=True, null=True)
    parent_company = models.ForeignKey('OcTsgCompany', models.DO_NOTHING, db_column='company_id', blank=True, null=True)  # Field renamed because of name conflict.

    @property
    def fullname(self):
        return self.firstname + ' ' + self.lastname

    class Meta:
        managed = False
        db_table = 'oc_customer'
        ordering = ['-date_added']



class OcTsgCompany(models.Model):
    company_id = models.AutoField(primary_key=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    firstname = models.CharField(max_length=255, blank=True, null=True)
    lastname = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    telephone = models.CharField(max_length=40, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    address_1 = models.CharField(max_length=255, blank=True, null=True)
    address_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    county = models.CharField(max_length=255, blank=True, null=True)
    postcode = models.CharField(max_length=255, blank=True, null=True)
    xero_id = models.CharField(max_length=255, blank=True, null=True)
    payment_terms = models.ForeignKey('OcTsgPaymentTerms', models.DO_NOTHING, db_column='payment_terms', blank=True, null=True)
    payment_days = models.IntegerField(blank=True, null=True)
    status = models.ForeignKey('OcTsgCustomerStatus', models.DO_NOTHING, db_column='status', blank=True, null=True)
    account_type = models.ForeignKey(OcTsgAccountType, models.DO_NOTHING, db_column='account_type', blank=True, null=True)
    credit_limit = models.FloatField(blank=True, null=True)
    discount = models.FloatField(blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    company_type = models.ForeignKey('OcTsgCompanyType', models.DO_NOTHING, db_column='company_type', blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_company'


class OcAddress(models.Model):
    address_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey('OcCustomer', models.DO_NOTHING, db_column='customer_id')
    company = models.CharField(max_length=40, blank=True, null=True)
    branch = models.CharField(max_length=255, blank=True, null=True)
    firstname = models.CharField(max_length=32)
    lastname = models.CharField(max_length=32)
    telephone = models.CharField(max_length=32)
    email = models.CharField(max_length=255)
    address_1 = models.CharField(max_length=128)
    address_2 = models.CharField(max_length=128, blank=True, null=True)
    city = models.CharField(max_length=128)
    postcode = models.CharField(max_length=10)
    country_id = models.IntegerField(blank=True, null=True)
    zone_id = models.IntegerField(blank=True, null=True)
    custom_field = models.TextField(blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)
    parent_company = models.ForeignKey('OcTsgCompany', models.DO_NOTHING, db_column='company_id', blank=True, null=True)  # Field renamed because of name conflict.
    default_shipping = models.BooleanField(blank=True, null=True, default=0)
    default_billing = models.BooleanField(blank=True, null=True, default=0)

    class Meta:
        managed = False
        db_table = 'oc_address'

