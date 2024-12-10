from django.db import models
from medusa.models import OcTaxRate, OcTsgAccountType, OcTsgFileTypes
from apps.sites.models import OcStore
from apps.company.models import OcTsgCompany, OcTsgCountryIso
from django.conf import settings


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
    customer_group_id = models.IntegerField(blank=True, null=True)
    store = models.ForeignKey(OcStore, on_delete=models.DO_NOTHING)
    language_id = models.IntegerField()
    company = models.CharField(max_length=255, blank=True, null=True)
    fullname = models.CharField(max_length=255, blank=True, null=True)
    firstname = models.CharField(max_length=32, blank=True, null=True)
    lastname = models.CharField(max_length=32, blank=True, null=True)
    email = models.CharField(max_length=96)
    telephone = models.CharField(max_length=32)
    mobile = models.CharField(max_length=32, blank=True, null=True)
    fax = models.CharField(max_length=32, blank=True, null=True)
    password = models.CharField(max_length=40, blank=True, null=True)
    salt = models.CharField(max_length=9, blank=True, null=True)
    cart = models.TextField(blank=True, null=True)
    wishlist = models.TextField(blank=True, null=True)
    newsletter = models.IntegerField(blank=True, null=True)
    address_id = models.IntegerField(blank=True, null=True)
    custom_field = models.TextField(blank=True, null=True)
    ip = models.CharField(max_length=40, blank=True, null=True)
    status = models.IntegerField()
    safe = models.IntegerField(blank=True, null=True)
    token = models.TextField(blank=True, null=True)
    code = models.CharField(max_length=40, blank=True, null=True)
    date_added = models.DateTimeField(auto_now=True)
    xero_id = models.CharField(max_length=256, blank=True, null=True)
    parent_company = models.ForeignKey(OcTsgCompany, models.DO_NOTHING, db_column='company_id', blank=True, null=True, related_name='company_customer')  # Field renamed because of name conflict.
    account_type = models.ForeignKey(OcTsgAccountType, models.DO_NOTHING, db_column='account_type', blank=True,
                                     null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    notes = models.CharField(max_length=2048, blank=True, null=True)
    archived = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'oc_customer'
        ordering = ['-date_added']

    @property
    def full_name_legacy(self):
        return f"{self.firstname} {self.lastname}"


class OcAddress(models.Model):
    address_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey('OcCustomer', models.DO_NOTHING, blank=True, null=True, related_name='address_customer')
    company = models.CharField(max_length=40, blank=True, null=True)
    branch = models.CharField(max_length=255, blank=True, null=True)
    fullname = models.CharField(max_length=255, blank=True, null=True)
    firstname = models.CharField(max_length=32)
    lastname = models.CharField(max_length=32)
    telephone = models.CharField(max_length=32)
    email = models.CharField(max_length=255)
    address_1 = models.CharField(max_length=256)
    address_2 = models.CharField(max_length=128, blank=True, null=True)
    city = models.CharField(max_length=128, blank=True, null=True)
    postcode = models.CharField(max_length=10)
    area = models.CharField(max_length=255, blank=True, null=True)
    country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, blank=True, null=True)
    zone_id = models.IntegerField(blank=True, null=True)
    custom_field = models.TextField(blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)
    default_shipping = models.BooleanField(blank=True, null=True, default=0)
    default_billing = models.BooleanField(blank=True, null=True, default=0)

    @property
    def full_address(self):
        return f"{self.address_1}, {self.city}, {self.postcode}"

    class Meta:
        managed = False
        db_table = 'oc_address'


class OcTsgContactDocuments(models.Model):
    contact = models.ForeignKey(OcCustomer, models.DO_NOTHING, blank=True, null=True)
    type = models.ForeignKey(OcTsgFileTypes, models.DO_NOTHING, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    filename = models.FileField(upload_to='medusa/customer/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cache_path = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_contact_documents'

    @property
    def cdn_name(self):
        return f"{settings.MEDIA_URL}{self.filename.name}"








