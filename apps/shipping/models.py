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


class AddressVerification(models.Model):
    class Status(models.TextChoices):
        VERIFIED = "verified", "Verified"
        NEEDS_REVIEW = "needs_review", "Needs review"
        FAILED = "failed", "Failed"
        OVERRIDDEN = "overridden", "Overridden"


    order = models.ForeignKey('orders.OcOrder', models.DO_NOTHING, related_name='address_verification')

    # Customer-provided (input) fields
    input_name = models.CharField(max_length=255, null=True, blank=True)
    input_company = models.CharField(max_length=255, null=True, blank=True)
    input_phone = models.CharField(max_length=50, null=True, blank=True)
    input_email = models.CharField(max_length=255, null=True, blank=True)

    input_line1 = models.CharField(max_length=255)
    input_line2 = models.CharField(max_length=255, null=True, blank=True)
    input_line3 = models.CharField(max_length=255, null=True, blank=True)
    input_city = models.CharField(max_length=100, null=True, blank=True)
    input_area = models.CharField(max_length=100, null=True, blank=True)
    input_postcode = models.CharField(max_length=20, null=True, blank=True)
    input_country_code = models.CharField(max_length=2)
    input_hash = models.CharField(max_length=64)

    # Verified / cleansed fields
    verified_company = models.CharField(max_length=255, null=True, blank=True)
    verified_line1 = models.CharField(max_length=255, null=True, blank=True)
    verified_line2 = models.CharField(max_length=255, null=True, blank=True)
    verified_line3 = models.CharField(max_length=255, null=True, blank=True)
    verified_city = models.CharField(max_length=100, null=True, blank=True)
    verified_area = models.CharField(max_length=100, null=True, blank=True)
    verified_postcode = models.CharField(max_length=20, null=True, blank=True)
    verified_country_code = models.CharField(max_length=2, null=True, blank=True)

    # Provider metadata
    provider = models.CharField(max_length=50, default="loqate")
    provider_reference = models.CharField(max_length=128, null=True, blank=True)
    verification_level = models.CharField(max_length=50, null=True, blank=True)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    result_codes = models.CharField(max_length=255, null=True, blank=True)

    # Raw payloads (kept as text to match LONGTEXT)
    provider_request_json = models.TextField(null=True, blank=True)
    provider_response_json = models.TextField(null=True, blank=True)

    # State / audit
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEEDS_REVIEW,
    )
    override_reason = models.CharField(max_length=255, null=True, blank=True)
    overridden_by_user_id = models.IntegerField(null=True, blank=True)

    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = "oc_tsg_address_verification"
        constraints = [
            models.UniqueConstraint(
                fields=["input_hash", "input_country_code"],
                name="uq_input_hash_country",
            )
        ]
        indexes = [
            models.Index(fields=["order"], name="idx_order_id"),
            models.Index(fields=["status"], name="idx_status"),
            models.Index(fields=["verified_at"], name="idx_verified_at"),
        ]
