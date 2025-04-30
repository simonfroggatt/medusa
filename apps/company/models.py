from django.db import models
from medusa.models import OcTaxRate, OcTsgPaymentTerms, OcTsgCountryIso, OcTsgAccountType, OcTsgFileTypes
from apps.sites.models import OcStore, OcCurrency
from django.conf import settings

class OcTsgCustomerStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    status_title = models.CharField(max_length=32, blank=True, null=True)
    status_description = models.CharField(max_length=512, blank=True, null=True)
    status_image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_customer_status'

    def __str__(self):
        return self.status_title


class OcTsgCompanyType(models.Model):
    company_type_id = models.AutoField(primary_key=True)
    company_type_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_company_type'

    def __str__(self):
        return self.company_type_name


class OcTsgCompany(models.Model):
    company_id = models.AutoField(primary_key=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    xero_id = models.CharField(max_length=255, blank=True, null=True)
    payment_terms = models.ForeignKey(OcTsgPaymentTerms, models.DO_NOTHING, db_column='payment_terms', blank=True, null=True)
    payment_days = models.IntegerField(blank=True, null=True)
    status = models.ForeignKey(OcTsgCustomerStatus, models.DO_NOTHING, db_column='status', blank=True, null=True)
    account_type = models.ForeignKey(OcTsgAccountType, models.DO_NOTHING, db_column='account_type', blank=True, null=True)
    credit_limit = models.FloatField(blank=True, null=True)
    discount = models.FloatField(blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    company_type = models.ForeignKey(OcTsgCompanyType, models.DO_NOTHING, db_column='company_type', blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, blank=True, null=True)
    notes = models.CharField(max_length=2048, blank=True, null=True)
    accounts_contact_firstname = models.CharField(max_length=255)
    accounts_contact_lastname = models.CharField(max_length=255)
    accounts_email = models.CharField(max_length=255)
    accounts_telephone = models.CharField(max_length=40)
    accounts_address = models.CharField(max_length=512)
    accounts_city = models.CharField(max_length=255)
    accounts_area = models.CharField(max_length=255)
    accounts_postcode = models.CharField(max_length=10)
    accounts_country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, related_name='accounts_country')

    class Meta:
        managed = False
        db_table = 'oc_tsg_company'

    @property
    def accounts_contact_fullname(self):
        return f"{self.accounts_contact_firstname} {self.accounts_contact_lastname}".strip()


    def __str__(self):
        return self.company_name



class OcTsgCompanyDocuments(models.Model):
    company = models.ForeignKey(OcTsgCompany, models.DO_NOTHING, blank=True, null=True)
    type = models.ForeignKey(OcTsgFileTypes, models.DO_NOTHING, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    filename = models.FileField(upload_to='medusa/company/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cache_path = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_company_documents'

    @property
    def cdn_name(self):
        return f"{settings.MEDIA_URL}{self.filename.name}"


    def __str__(self):
        return self.title
