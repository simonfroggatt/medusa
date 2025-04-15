from django.db import models
from django.conf import settings
from medusa.models import OcTaxRate

class OcCurrency(models.Model):
    currency_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=32)
    code = models.CharField(max_length=3)
    symbol_left = models.CharField(max_length=12)
    symbol_right = models.CharField(max_length=12)
    decimal_place = models.CharField(max_length=1)
    value = models.FloatField()
    status = models.IntegerField()
    date_modified = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'oc_currency'

    def __str__(self):
        return self.code


class OcStore(models.Model):
    store_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    url = models.CharField(max_length=255)
    ssl = models.CharField(max_length=255, blank=True, null=True)
    code = models.CharField(max_length=30, blank=True, null=True)
    thumb = models.CharField(max_length=255, blank=True, null=True)
    logo = models.CharField(max_length=255, blank=True, null=True)
    medusa_logo = models.CharField(max_length=255, blank=True, null=True)
    currency = models.ForeignKey(OcCurrency, models.DO_NOTHING, blank=True, null=True)
    telephone = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    vat_number = models.CharField(max_length=25, blank=True, null=True)
    registration_number = models.CharField(max_length=25, blank=True, null=True)
    footer_text = models.CharField(max_length=255, blank=True, null=True)
    email_address = models.CharField(max_length=255, blank=True, null=True)
    accounts_email_address = models.CharField(max_length=255, blank=True, null=True)
    base_email = models.CharField(max_length=255, blank=True, null=True)
    prefix = models.CharField(max_length=10, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    postcode = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    logo_paperwork = models.CharField(max_length=255, blank=True, null=True)
    status = models.BooleanField(blank=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, blank=True, null=True)
    email_header_logo = models.CharField(max_length=255, blank=True, null=True)
    email_foot_logo = models.CharField(max_length=255, blank=True, null=True)
    product_code_template = models.CharField(max_length=1024, blank=True, null=True)
    email_footer_text = models.TextField(blank=True, null=True)
    meta_title = models.CharField(max_length=128, blank=True, null=True)
    meta_description = models.CharField(max_length=256, blank=True, null=True)
    meta_keywords = models.CharField(max_length=256, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_store'
        ordering = ['store_id']

    @property
    def store_thumb_url(self):
        if self.thumb:
            return f"{settings.MEDIA_URL}{self.thumb}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    @property
    def store_logo_url(self):
        if self.logo:
            return f"{settings.MEDIA_URL}{self.logo}"
        else:
            return f"{settings.MEDIA.URL}no-image.png"

    def __str__(self):
        return self.name



class OcTsgNotificationTypes(models.Model):
    title = models.CharField(max_length=50, blank=True, null=True)
    value = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_notification_types'

    def __str__(self):
        return self.title


class OcTsgNotifications(models.Model):
    is_active = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    notification = models.TextField(blank=True, null=True)
    dismissible = models.IntegerField(blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)
    notification_type = models.ForeignKey(OcTsgNotificationTypes, models.DO_NOTHING, db_column='notification_type', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_notifications'

    def __str__(self):
        return self.title
