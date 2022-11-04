from django.db import models
from medusa.models import OcStore, OcTaxRate, OcCurrency, OcTsgPaymentTerms, OcTsgCountryIso


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


class OcTsgAccountType(models.Model):
    account_type_id = models.AutoField(primary_key=True)
    account_type_name = models.CharField(max_length=32, blank=True, null=True)
    account_type_description = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_account_type'

    def __str__(self):
        return self.account_type_name


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
    fullname = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    telephone = models.CharField(max_length=40)
    website = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=512)
    city = models.CharField(max_length=255)
    area = models.CharField(max_length=255)
    postcode = models.CharField(max_length=255)
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
    country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING)


    class Meta:
        managed = False
        db_table = 'oc_tsg_company'

    def __str__(self):
        return self.company_name
