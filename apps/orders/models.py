from django.db import models
from apps.sites.models import OcStore
from django.utils import timezone
import datetime as dt
from apps.customer.models import OcCustomer
from apps.products.models import OcTsgProductVariants, OcTsgBulkdiscountGroups
from apps.shipping.models import OcTsgCourier
from apps.options.models import  OcTsgOptionClass, OcTsgOptionValues, OcOptionValues, OcTsgProductOption, OcTsgOptionTypes
from decimal import Decimal
from medusa.models import OcTsgCountryIso, OcTaxRate, OcTsgFileTypes
from medusa.models import OcTsgOrderProductStatus
from django.core.validators import FileExtensionValidator
from decimal import Decimal, ROUND_HALF_UP
from django.conf import settings
import os
import json

from django.db.models.signals import pre_save
from django.dispatch import receiver

class OcOrderQuerySet(models.QuerySet):
    def successful(self):
        valid_status = [2, 3, 8]
        order_status_excl = [4,5]
        return self.exclude(order_status_id__in=order_status_excl).filter(payment_status_id__in=valid_status)

    def live(self):
        valid_status = [2, 3, 8]
        order_status_excl = [99, 1, 7]
        return self.exclude(order_status_id__in=order_status_excl).filter(payment_status_id__in=valid_status)

    def new(self):
        valid_status = [2, 3, 8]
        return self.filter(order_status_id=1).filter(payment_status_id__in=valid_status)

    def failed(self):
        valid_status = [2, 3, 8]
        return self.exclude(payment_status_id__in=valid_status).exclude(order_status_id=99)

    def days_since(self):
       #ß today_data = '2019-06-17'
        return 1

    def order_range(self, start_date, end_date):
        return self.filter(date_added__gte=start_date, date_added__lt=end_date)



class OcOrderManager(models.Manager):
    def get_queryset(self):
        return OcOrderQuerySet(self.model, using=self._db)

    def successful(self):
        return self.get_queryset().successful()

    def live(self):
        return self.get_queryset().live()

    def new(self):
        return self.get_queryset().new()

    def failed(self):
        return self.get_queryset().failed()

    def days_since(self):
        return 3

    def orders_range(self, start_date, end_date, bl_successful = True):
        if bl_successful:
            return self.get_queryset().order_range(start_date, end_date).successful()
        else:
            return self.get_queryset().order_range(start_date, end_date)



class OcTsgFlags(models.Model):
    flag_id = models.AutoField(primary_key=True)
    flag_name = models.CharField(max_length=255, blank=True, null=True)
    flag_description = models.CharField(max_length=255, blank=True, null=True)
    flag_icon = models.CharField(max_length=255, blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_flags'

    def __str__(self):
        return self.flag_name


class OcOrderStatus(models.Model):
    order_status_id = models.AutoField(primary_key=True)
    language_id = models.IntegerField()
    name = models.CharField(max_length=32)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_order_status'
        ordering = ['order_by']
        unique_together = (('order_status_id', 'language_id'),)

    def __str__(self):
        return self.name


class OcTsgPaymentMethod(models.Model):
    payment_method_id = models.AutoField(primary_key=True)
    method_name = models.CharField(max_length=255, blank=True, null=True)
    payment_method_icon = models.CharField(max_length=255, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)
    chart_colour = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_method'
        ordering = ['order_by']

    def __str__(self):
        return self.method_name


class OcTsgOrderType(models.Model):
    order_type_id = models.AutoField(primary_key=True)
    order_type_name = models.CharField(max_length=255, blank=True, null=True)
    order_type_icon = models.CharField(max_length=255, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_type'
        ordering = ['order_by']

    def __str__(self):
        return self.order_type_name



class OcTsgPaymentStatus(models.Model):
    payment_status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_status'
        ordering = ['order_by']

    def __str__(self):
        return self.name



class OcOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    invoice_no = models.IntegerField(blank=True, null=True)
    invoice_prefix = models.CharField(max_length=26, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    store_name = models.CharField(max_length=64)
    store_url = models.CharField(max_length=255, blank=True, null=True)
    customer = models.ForeignKey(OcCustomer, models.DO_NOTHING, db_column='customer_id', blank=True, null=True, related_name='customer_orders')
    customer_group_id = models.IntegerField(blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    fullname = models.CharField(max_length=255, blank=True, null=True)
    firstname = models.CharField(max_length=32, blank=True, null=True)
    lastname = models.CharField(max_length=32, blank=True, null=True)
    email = models.CharField(max_length=96, blank=True, null=True)
    telephone = models.CharField(max_length=32, blank=True, null=True)
    fax = models.CharField(max_length=32, blank=True, null=True)
    custom_field = models.TextField(blank=True, null=True)
    payment_fullname = models.CharField(max_length=255, blank=True, null=True)
    payment_firstname = models.CharField(max_length=32, blank=True, null=True)
    payment_lastname = models.CharField(max_length=32, blank=True, null=True)
    payment_email = models.CharField(max_length=512, blank=True, null=True)
    payment_telephone = models.CharField(max_length=50, blank=True, null=True)
    payment_company = models.CharField(max_length=255, blank=True, null=True)
    payment_address_1 = models.CharField(max_length=512, blank=True, null=True)
    payment_address_2 = models.CharField(max_length=128, blank=True, null=True)
    payment_city = models.CharField(max_length=128, blank=True, null=True)
    payment_area = models.CharField(max_length=255, blank=True, null=True)
    payment_postcode = models.CharField(max_length=10, blank=True, null=True)
    payment_country = models.CharField(max_length=128, blank=True, null=True)
    payment_country_name = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, db_column='payment_country_id', blank=True, null=True, related_name='billinghippingcountry')  # Field renamed because of name conflict.
    payment_zone = models.CharField(max_length=128, blank=True, null=True)
    payment_zone_id = models.IntegerField(blank=True, null=True)
    payment_address_format = models.TextField(blank=True, null=True)
    payment_custom_field = models.TextField(blank=True, null=True)
    payment_method_name = models.CharField(max_length=128)
    payment_code = models.CharField(max_length=128)
    shipping_fullname = models.CharField(max_length=255, blank=True, null=True)
    shipping_firstname = models.CharField(max_length=32, blank=True, null=True)
    shipping_lastname = models.CharField(max_length=32, blank=True, null=True)
    shipping_email = models.CharField(max_length=512, blank=True, null=True)
    shipping_telephone = models.CharField(max_length=50, blank=True, null=True)
    shipping_company = models.CharField(max_length=255, blank=True, null=True)
    shipping_address_1 = models.CharField(max_length=512, blank=True, null=True)
    shipping_address_2 = models.CharField(max_length=128, blank=True, null=True)
    shipping_city = models.CharField(max_length=128, blank=True, null=True)
    shipping_area = models.CharField(max_length=255, blank=True, null=True)
    shipping_postcode = models.CharField(max_length=10, blank=True, null=True)
    shipping_country = models.CharField(max_length=128, blank=True, null=True)
    shipping_country_name = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, db_column='shipping_country_id', blank=True, null=True, related_name='ordershippingcountry')  # Field renamed because of name conflict.
    shipping_zone = models.CharField(max_length=128, blank=True, null=True)
    shipping_zone_id = models.IntegerField(blank=True, null=True)
    shipping_address_format = models.TextField(blank=True, null=True)
    shipping_custom_field = models.TextField(blank=True, null=True)
    shipping_method = models.CharField(max_length=128, blank=True, null=True)
    shipping_code = models.CharField(max_length=128, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    total = models.DecimalField(max_digits=15, decimal_places=4)
    affiliate_id = models.IntegerField(blank=True, null=True)
    commission = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    marketing_id = models.IntegerField(blank=True, null=True)
    tracking = models.CharField(max_length=64, blank=True, null=True)
    language_id = models.IntegerField(blank=True, null=True)
    currency_id = models.IntegerField(blank=True, null=True)
    currency_code = models.CharField(max_length=3, blank=True, null=True)
    currency_value = models.DecimalField(max_digits=15, decimal_places=8)
    ip = models.CharField(max_length=40, blank=True, null=True)
    forwarded_ip = models.CharField(max_length=40, blank=True, null=True)
    user_agent = models.CharField(max_length=255, blank=True, null=True)
    accept_language = models.CharField(max_length=255, blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    date_due = models.DateField(blank=True, null=True)
    order_status = models.ForeignKey(OcOrderStatus, models.DO_NOTHING, blank=True, null=True)
    order_type = models.ForeignKey('OcTsgOrderType', models.DO_NOTHING)
    payment_method = models.ForeignKey('OcTsgPaymentMethod', models.DO_NOTHING, blank=True, null=True)
    payment_status = models.ForeignKey(OcTsgPaymentStatus, models.DO_NOTHING, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    payment_ref = models.CharField(max_length=255, blank=True, null=True)
    xero_id = models.CharField(max_length=256, blank=True, null=True)
    customer_order_ref = models.CharField(max_length=255, blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, db_column='tax_rate', blank=True, null=True)
    printed = models.BooleanField(default=False)  #note - must be BooleanField
    plain_label = models.BooleanField(default=False)
    order_hash = models.CharField(max_length=256, blank=True, null=True)

    @property

    def is_order(self):
        #return self.order_status.order_status_id == 15
        return self.successful

    def dow(self):
        return self.date_added.strftime('%a')

    def days_since_order(self):
        today = dt.datetime.now()
        ordered = dt.datetime(self.date_added.year, self.date_added.month, self.date_added.day)
        delta = today - ordered
        return delta.days

    def short_date(self):
        return self.date_added.strftime('%-d %b, %H:%M')

    def get_order_status(self):
        status = ''
        payment_status = [2, 3, 8];
        # 2 = paid, 3 = processing, 8 = shipped
        order_status_excl = [4, 5, 99, 1]
        # 4 = cancelled, 5 = refunded, 99 = complete, 1 = pending
        order_status_live = [99, 1] #
        legacy_order_id = [7]
        if self.payment_status_id in payment_status:
            if self.order_status_id not in order_status_excl:
                status = 'LIVE'
            else:
                status = 'NEW'
        else:
            status = 'FAILED'

        if self.order_status_id in legacy_order_id:
            status = 'FAILED'

        return status

    def save(self, *args, **kwargs):

        if self.payment_status_id == 2:
            self.payment_date = dt.datetime.now()

        #update the status
        if self.order_id:
            add_order_status_history(self.order_id, self.order_status_id)
            add_payment_status_history(self.order_id, self.payment_method_id, self.payment_status_id)
        super(OcOrder, self).save(*args, **kwargs)

    class Meta:
        managed = False
        db_table = 'oc_order'

    objects = OcOrderManager()


class OcTsgShippingStatus(models.Model):
    shipping_status_id = models.AutoField(primary_key=True)
    status_title = models.CharField(max_length=255, blank=True, null=True)
    status_colour = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_shipping_status'

    def __str__(self):
        return self.status_title


class OcTsgOrderShipment(models.Model):
    order_shipment_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True, related_name='ordershipping')
    tracking_number = models.CharField(max_length=255)
    shipping_courier = models.ForeignKey(OcTsgCourier, models.DO_NOTHING, blank=True, null=True, related_name='shipmentcourier')
    shipping_courier_method = models.CharField(max_length=255, blank=True, null=True)
    shipping_status = models.ForeignKey(OcTsgShippingStatus, models.DO_NOTHING, blank=True, null=True, related_name='ordershippingstatus')
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_shipment'





class OcOrderFlags(models.Model):
    order = models.ForeignKey(OcOrder,  models.DO_NOTHING, related_name='orderflags')
    flag = models.ForeignKey(OcTsgFlags, models.DO_NOTHING, blank=True, null=True, related_name='flagdetails')
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_order_flags'
        unique_together = (('order', 'flag'),)


class OcTsgDiscountType(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_discount_type'


class OcOrderProduct(models.Model):
    order_product_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, db_column='order_id', related_name='order_products')
    product_id = models.IntegerField()
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=64)
    supplier_code = models.CharField(max_length=64)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=15, decimal_places=2)
    discount = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    discount_type = models.ForeignKey(OcTsgDiscountType, models.DO_NOTHING, db_column='discount_type', blank=True,
                                      null=True, default=1, related_name='discounttype')
    total = models.DecimalField(max_digits=15, decimal_places=2)
    tax = models.DecimalField(max_digits=15, decimal_places=2)
    tax_rate_desc = models.CharField(max_length=10, blank=True, null=True)
    reward = models.IntegerField()
    size_name = models.CharField(max_length=256, blank=True, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=0)
    height = models.DecimalField(max_digits=10, decimal_places=0)
    orientation_name = models.CharField(max_length=255, blank=True, null=True)
    material_name = models.CharField(max_length=255, blank=True, null=True)
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True, default=None,  related_name='order_product_variant')
    is_bespoke = models.BooleanField(blank=True, null=True, default=0)
    status = models.ForeignKey(OcTsgOrderProductStatus, models.DO_NOTHING, blank=True, null=True, related_name='productstatus')
    exclude_discount = models.BooleanField(default=False)  # note - must be BooleanField
    bulk_discount = models.ForeignKey(OcTsgBulkdiscountGroups, models.DO_NOTHING, blank=True, null=True, related_name='order_product_bulkgrp')
    bulk_used = models.BooleanField(default=True)
    single_unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, default=0.00)
    base_unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, default=0.00)


    class Meta:
        managed = False
        db_table = 'oc_order_product'

    @property
    def product_image_url(self):
        if self.product_variant.alt_image_url:
            return self.product_variant.alt_image_url
        else:
            return ''



   # def save(self, *args, **kwargs):
        #do the total stuff in here
    #    super(OcOrderProduct, self).save(*args, **kwargs)
     #   calc_order_totals(self.order.order_id)

    def __init__(self, *args, **kwargs):
        super(OcOrderProduct, self).__init__(*args, **kwargs)
        self.old_status_id = self.status_id



    def delete(self, using=None, keep_parents=False):
        super(OcOrderProduct, self).delete(using, keep_parents)
        #calc_order_totals(self.order.order_id)

    def save(self, *args, **kwargs):
        if self.base_unit_price <= 0:
            self.base_unit_price = self.single_unit_price
        super(OcOrderProduct, self).save(*args, **kwargs)
        add_order_product_history(self.order_product_id, self.old_status_id, self.status_id)

        return self



class OcOrderTotal(models.Model):
    order_total_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, related_name='order_totals')
    code = models.CharField(max_length=32)
    title = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=15, decimal_places=4)
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_order_total'
        ordering = ['sort_order']

    #def save(self, *args, **kwargs):
        #do the total stuff in here
     #   super(OcOrderTotal, self).save(*args, **kwargs)
     #   calc_order_totals(self.order.order_id)



class OcOrderHistory(models.Model):
    order_history_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, related_name='order_history')
    order_status = models.ForeignKey(OcOrderStatus, models.DO_NOTHING, blank=True, null=True)
    notify = models.IntegerField()
    comment = models.TextField()
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_order_history'


class OcTsgPaymentHistory(models.Model):
    payment_history_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True, related_name='payment_history')
    payment_status = models.ForeignKey(OcTsgPaymentStatus, models.DO_NOTHING, db_column='payment_status', blank=True,
                                       null=True)
    payment_method = models.ForeignKey(OcTsgPaymentMethod, models.DO_NOTHING, db_column='payment_method', blank=True,
                                       null=True)
    comment = models.CharField(max_length=255, blank=True, null=True)
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_history'


class OcTsgOrderProductStatusHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    order_product = models.ForeignKey('OcOrderProduct', models.DO_NOTHING, blank=True, null=True)
    old_status = models.ForeignKey(OcTsgOrderProductStatus, models.DO_NOTHING, blank=True, null=True, related_name='old_product_status')
    status = models.ForeignKey(OcTsgOrderProductStatus, models.DO_NOTHING, blank=True, null=True, related_name='current_product_status')
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    user_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_product_status_history'


class OcTsgOrderArtwork(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    filename = models.FileField(upload_to='medusa/order/artwork/', blank=True, null=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True)
    version = models.CharField(max_length=255, blank=True, null=True)
    approved = models.BooleanField(default=False)
    approved_by = models.CharField(max_length=255, blank=True, null=True)
    added_date = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    approved_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_artwork'

    def __str__(self):
        return self.title


class OcTsgOrderDocuments(models.Model):
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True)
    type = models.ForeignKey(OcTsgFileTypes, models.DO_NOTHING, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    filename = models.FileField(upload_to='medusa/order/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cache_path = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_documents'

    def __str__(self):
        return self.description

    def short_name(self):
        return os.path.basename(self.filename.name)

    @property
    def cdn_name(self):
        return f"{settings.MEDIA_URL}{self.filename.name}"


class OcTsgOrderProductOptions(models.Model):
    order_product = models.ForeignKey(OcOrderProduct, models.DO_NOTHING, related_name='order_product_variant_options')
    class_field = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING, db_column='class_id', blank=True, null=True)  # Field renamed because it was a Python reserved word.
    class_name = models.CharField(max_length=255, blank=True, null=True)
    value = models.ForeignKey(OcTsgOptionValues, models.DO_NOTHING, blank=True, null=True)
    value_name = models.CharField(max_length=255, blank=True, null=True)
    bl_dynamic = models.BooleanField(default=False)
    dynamic_class_id = models.IntegerField(blank=True, null=True)
    dynamic_value_id = models.IntegerField(blank=True, null=True)
    class_type = models.ForeignKey(OcTsgOptionTypes, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_product_options'



class OcTsgOrderOption(models.Model):
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True)
    order_product = models.ForeignKey(OcOrderProduct, models.DO_NOTHING, blank=True, null=True, related_name='order_product_option')
    option = models.ForeignKey(OcTsgProductOption, models.DO_NOTHING, blank=True, null=True)
    option_name = models.CharField(max_length=255, blank=True, null=True)
    value = models.ForeignKey(OcOptionValues, models.DO_NOTHING, blank=True, null=True)
    value_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_option'


class OcTsgOrderBespokeImage(models.Model):
    order_product = models.ForeignKey(OcOrderProduct, models.DO_NOTHING, related_name='order_product_bespoke_image')
    bespoke_category_id = models.IntegerField(blank=True, null=True)
    svg_json = models.TextField(blank=True, null=True)
    svg_export = models.BinaryField(blank=True, null=True)
    png_url = models.CharField(max_length=255, blank=True, null=True)
    svg_texts = models.TextField(blank=True, null=True)
    svg_images = models.CharField(max_length=255, blank=True, null=True)
    google_id = models.CharField(max_length=255, blank=True, null=True)
    version = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_bespoke_image'

  #  def save(self, *args, **kwargs):
  #      self.svg_export = json.dumps(self.svg_export)
  #      super(OcTsgOrderBespokeImage, self).save(*args, **kwargs)



def add_order_product_history(order_product_id, old_id, new_id):
    if old_id != new_id:
        new_history_obj = OcTsgOrderProductStatusHistory()
        new_history_obj.order_product_id= order_product_id
        new_history_obj.old_status_id = old_id
        new_history_obj.status_id = new_id
        new_history_obj.save()


def add_order_status_history(order_id, new_id):
    last_history = OcOrderHistory.objects.filter(order_id=order_id).order_by('-date_added').first()
    old_id = 0
    if last_history:
        old_id = last_history.order_status_id

    if old_id != new_id:
        new_history_obj = OcOrderHistory()
        new_history_obj.order_id = order_id
        new_history_obj.order_status_id = new_id
        new_history_obj.notify = False
        new_history_obj.save()

def add_payment_status_history(order_id, new_method_id, new_status_id):
    last_history = OcTsgPaymentHistory.objects.filter(order_id=order_id).order_by('-date_added').first()
    old_method_id = 0
    old_status_id = 0
    if last_history:
        old_method_id = last_history.payment_method_id
        old_status_id = last_history.payment_status_id

    if (old_method_id != new_method_id) or (old_status_id != new_status_id):
        new_history_obj = OcTsgPaymentHistory()
        new_history_obj.order_id = order_id
        new_history_obj.payment_method_id = new_method_id
        new_history_obj.payment_status_id = new_status_id
        new_history_obj.save()
