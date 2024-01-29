from django.db import models
from medusa.models import OcTsgCountryIso, OcTsgPaymentTerms, OcTsgAccountType


class OcSupplier(models.Model):
    code = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    main_contact = models.CharField(max_length=255, blank=True, null=True)
    order_email = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    area = models.CharField(max_length=255, blank=True, null=True)
    postcode = models.CharField(max_length=255, blank=True, null=True)
    country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, blank=True, null=True, related_name='supplier_country')
    main_telephone = models.CharField(max_length=255, blank=True, null=True)
    alt_telephone = models.CharField(max_length=255, blank=True, null=True)
    lead_time = models.IntegerField(blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    logo = models.ImageField(upload_to='medusa/suppliers/logos/', blank=True, null=True)
    account_type = models.ForeignKey(OcTsgAccountType, models.DO_NOTHING, blank=True, null=True)
    payment_terms = models.ForeignKey(OcTsgPaymentTerms, models.DO_NOTHING, blank=True, null=True)
    payment_days = models.IntegerField(blank=True, null=True)
    xero_id = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_supplier'

    def __str__(self):
        return self.company


class OcTsgSupplierDocuments(models.Model):
    supplier = models.ForeignKey(OcSupplier, models.DO_NOTHING, blank=True, null=True)
    filepath = models.FileField(upload_to='medusa/supplier/documents/')
    title = models.CharField(max_length=255, blank=True, null=True)
    date_added = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_supplier_documents'

    def __str__(self):
        return self.title


class OcTsgSupplierMaterials(models.Model):
    supplier = models.ForeignKey(OcSupplier, models.DO_NOTHING)
    code = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    image = models.FileField(upload_to='medusa/supplier/materials/images/', blank=True, null=True)
    spec_sheet = models.FileField(upload_to='medusa/supplier/materials/specs/', blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_supplier_materials'