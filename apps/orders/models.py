from django.db import models
from apps.sites.models import OcStore
from django.utils import timezone
import datetime as dt
from apps.customer.models import OcCustomer
from apps.products.models import OcTsgProductVariants, OcTsgBulkdiscountGroups
from apps.shipping.models import OcTsgCourier
from decimal import Decimal
from medusa.models import OcTsgCountryIso, OcTaxRate
from decimal import Decimal, ROUND_HALF_UP

class OcOrderQuerySet(models.QuerySet):
    def successful(self):
        valid_status = [2]
        return self.filter(payment_status_id__in=valid_status)

    def live(self):
        valid_status = [2, 3, 8]
        return self.exclude(order_status_id=99).filter(payment_status_id__in=valid_status)

    def failed(self):
        valid_status = [2, 3, 8]
        return self.exclude(payment_status_id__in=valid_status).exclude(order_status_id=99)

    def days_since(self):
       #ß today_data = '2019-06-17'
        return 1

    def test_it_qs(self):
        return '123'


class OcOrderManager(models.Manager):
    def get_queryset(self):
        return OcOrderQuerySet(self.model, using=self._db)

    def successful(self):
        return self.get_queryset().successful()

    def live(self):
        return self.get_queryset().live()

    def failed(self):
        return self.get_queryset().failed()

    def days_since(self):
        return 3

    def test_it_mm(self):
        return self.get_queryset().test_it_qs()


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
    payment_method_name = models.CharField(max_length=255, blank=True, null=True)
    payment_method_icon = models.CharField(max_length=255, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_method'
        ordering = ['order_by']

    def __str__(self):
        return self.payment_method_name


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


class OcTsgOrderProductStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    icon_path = models.CharField(max_length=255, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)
    is_flag = models.IntegerField(blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_product_status'
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
    payment_company = models.CharField(max_length=60, blank=True, null=True)
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
    shipping_company = models.CharField(max_length=40, blank=True, null=True)
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
    payment_method = models.ForeignKey('OcTsgPaymentMethod', models.DO_NOTHING, blank=True, null=True)
    order_type = models.ForeignKey('OcTsgOrderType', models.DO_NOTHING)
    payment_status = models.ForeignKey(OcTsgPaymentStatus, models.DO_NOTHING, blank=True, null=True)
    xero_id = models.CharField(max_length=256, blank=True, null=True)
    customer_order_ref = models.CharField(max_length=255, blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, db_column='tax_rate', blank=True, null=True)
    printed = models.BooleanField(default=False)  #note - must be BooleanField
    plain_label = models.BooleanField(default=False)

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
        return self.date_added.strftime('%-m %b, %H:%M')

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


class OcOrderFlags(models.Model):
    order = models.ForeignKey(OcOrder,  models.DO_NOTHING, related_name='orderflags')
    flag = models.ForeignKey(OcTsgFlags, models.DO_NOTHING, blank=True, null=True, related_name='flagdetails')
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_order_flags'
        unique_together = (('order', 'flag'),)


class OcOrderProduct(models.Model):
    order_product_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, db_column='order_id', related_name='order_products')
    product_id = models.IntegerField()
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=64)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=15, decimal_places=2)
    discount = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    total = models.DecimalField(max_digits=15, decimal_places=2)
    tax = models.DecimalField(max_digits=15, decimal_places=2)
    tax_rate_desc = models.CharField(max_length=10, blank=True, null=True)
    reward = models.IntegerField()
    size_name = models.CharField(max_length=256, blank=True, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=0)
    height = models.DecimalField(max_digits=10, decimal_places=0)
    orientation_name = models.CharField(max_length=255, blank=True, null=True)
    material_name = models.CharField(max_length=255, blank=True, null=True)
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True, related_name='order_product_variant')
    is_bespoke = models.BooleanField(blank=True, null=True, default=0)
    status = models.ForeignKey(OcTsgOrderProductStatus, models.DO_NOTHING, blank=True, null=True, related_name='productstatus')
    exclude_discount = models.BooleanField(default=False)  # note - must be BooleanField
    bulk_discount = models.ForeignKey(OcTsgBulkdiscountGroups, models.DO_NOTHING, blank=True, null=True, related_name='order_product_bulkgrp')
    bulk_used = models.BooleanField(default=True)
    single_unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_order_product'

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


class OcOrderOption(models.Model):
    order_option_id = models.AutoField(primary_key=True)
    order_id = models.IntegerField()
    order_product = models.ForeignKey('OcOrderProduct', models.DO_NOTHING, related_name='order_product_option')
    product_option_id = models.IntegerField()
    product_option_value_id = models.IntegerField()
    name = models.CharField(max_length=255)
    value = models.TextField()
    type = models.CharField(max_length=32)

    class Meta:
        managed = False
        db_table = 'oc_order_option'


class OcOrderHistory(models.Model):
    order_history_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, related_name='order_history')
    order_status = models.CharField(max_length=128, blank=True, null=True)
    notify = models.IntegerField()
    comment = models.TextField()
    date_added = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'oc_order_history'


class OcTsgPaymentHistory(models.Model):
    payment_history_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True, related_name='payment_history')
    payment_status = models.CharField(max_length=128, blank=True, null=True)
    payment_method = models.CharField(max_length=128, blank=True, null=True)
    comment = models.CharField(max_length=255, blank=True, null=True)
    date_added = models.DateTimeField(blank=True, null=True)

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


class OcTsgFileTypes(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_file_types'

    def __str__(self):
        return self.name


class OcTsgOrderArtwork(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    filename = models.CharField(max_length=255, blank=True, null=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True)
    version = models.CharField(max_length=255, blank=True, null=True)
    approved = models.BooleanField(default=False)
    approved_by = models.CharField(max_length=255, blank=True, null=True)
    added_date = models.DateTimeField(blank=True, null=True)
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
    filename = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_documents'

    def __str__(self):
        return self.title



def add_order_product_history(order_product_id, old_id, new_id):
    if old_id != new_id:
        new_history_obj = OcTsgOrderProductStatusHistory()
        new_history_obj.order_product_id= order_product_id
        new_history_obj.old_status_id = old_id
        new_history_obj.status_id = new_id
        new_history_obj.save()

