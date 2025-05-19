from django.db import models
from apps.sites.models import OcStore
from django.conf import settings
from medusa.models import OcTsgCountryIso

class OcTsgShippingMethodTypes(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'oc_tsg_shipping_method_types'

    def __str__(self):
        return self.name


class OcTsgShippingMethod(models.Model):
    shipping_method_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    code = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    description = models.CharField(max_length=2058, blank=True, null=True)
    lower_range = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    upper_range = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    method_type = models.ForeignKey(OcTsgShippingMethodTypes, models.DO_NOTHING, blank=True, null=True, related_name='shippingtype')
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    iso = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, blank=True, null=True)
    orderby = models.IntegerField(blank=True, null=True)
    status = models.BooleanField(blank=True, null=True)
    #tax_class_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_shipping_method'

    def __str__(self):
        return self.title


class OcTsgCourier(models.Model):
    courier_id = models.AutoField(primary_key=True)
    courier_title = models.CharField(max_length=255)
    courier_logo = models.CharField(max_length=255, blank=True, null=True)
    courier_api_url = models.CharField(max_length=1024, blank=True, null=True)
    courier_username = models.CharField(max_length=255, blank=True, null=True)
    courier_key = models.CharField(max_length=255, blank=True, null=True)
    courier_tracking_url = models.CharField(max_length=512, blank=True, null=True)
    courier_email_image = models.ImageField(upload_to='stores/couriers/', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_courier'

    def __str__(self):
        return self.courier_title

    def email_image_url(self):
        if self.courier_email_image:
            return f"{settings.MEDIA_URL}{self.courier_email_image.name}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"


class OcTsgCourierOptions(models.Model):
    courier_opion_id = models.AutoField(primary_key=True)
    courier_option_title = models.CharField(max_length=255, blank=True, null=True)
    courier_option_description = models.CharField(max_length=255, blank=True, null=True)
    courier = models.ForeignKey(OcTsgCourier, models.DO_NOTHING, related_name='courierdetails')

    class Meta:
        managed = False
        db_table = 'oc_tsg_courier_options'

    def __str__(self):
        return self.courier_option_title


