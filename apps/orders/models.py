from django.db import models
from apps.sites.models import OcStore
from django.utils import timezone
import datetime as dt
from apps.customer.models import OcCustomer
from apps.products.models import OcTsgProductVariants
from decimal import Decimal
from medusa.models import OcTsgCountryIso, OcTaxRate
from decimal import Decimal, ROUND_HALF_UP

class OcOrderQuerySet(models.QuerySet):
    def successful(self):
        valid_status = [2]
        return self.filter(payment_status_id__in=valid_status)

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

    def days_since(self):
        return 3

    def test_it_mm(self):
        return self.get_queryset().test_it_qs()


class OcOrderStatus(models.Model):
    order_status_id = models.AutoField(primary_key=True)
    language_id = models.IntegerField()
    name = models.CharField(max_length=32)

    class Meta:
        managed = False
        db_table = 'oc_order_status'
        unique_together = (('order_status_id', 'language_id'),)

    def __str__(self):
        return self.name


class OcTsgPaymentMethod(models.Model):
    payment_method_id = models.AutoField(primary_key=True)
    payment_method_name = models.CharField(max_length=255, blank=True, null=True)
    payment_method_icon = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_method'

    def __str__(self):
        return self.payment_method_name


class OcTsgOrderType(models.Model):
    order_type_id = models.AutoField(primary_key=True)
    order_type_name = models.CharField(max_length=255, blank=True, null=True)
    order_type_icon = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_type'

    def __str__(self):
        return self.order_type_name


class OcTsgPaymentStatus(models.Model):
    payment_status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_status'

    def __str__(self):
        return self.name


class OcTsgOrderProductStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    icon_path = models.CharField(max_length=255, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)
    is_flag = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_product_status'

    def __str__(self):
        return self.name


class OcTsgCourier(models.Model):
    courier_id = models.AutoField(primary_key=True)
    courier_title = models.CharField(max_length=255, blank=True, null=True)
    courier_logo = models.CharField(max_length=255, blank=True, null=True)
    courier_api_url = models.CharField(max_length=1024, blank=True, null=True)
    courier_username = models.CharField(max_length=255, blank=True, null=True)
    courier_key = models.CharField(max_length=255, blank=True, null=True)
    courier_tracking_url = models.CharField(max_length=512, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_courier'

    def __str__(self):
        return self.courier_title


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


class OcOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    invoice_no = models.IntegerField(blank=True, null=True)
    invoice_prefix = models.CharField(max_length=26, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    store_name = models.CharField(max_length=64)
    store_url = models.CharField(max_length=255, blank=True, null=True)
    customer = models.ForeignKey(OcCustomer, models.DO_NOTHING, db_column='customer_id', blank=True, null=True, related_name='customer_orders')
    customer_group_id = models.IntegerField(blank=True, null=True)
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
    payment_method = models.CharField(max_length=128)
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
    payment_method_rel = models.ForeignKey(OcTsgPaymentMethod,  models.DO_NOTHING, db_column='payment_method_id', blank=True, null=True)  # Field renamed because of name conflict.
    order_type = models.ForeignKey('OcTsgOrderType', models.DO_NOTHING)
    payment_status = models.ForeignKey(OcTsgPaymentStatus, models.DO_NOTHING, blank=True, null=True)
    xero_id = models.CharField(max_length=256, blank=True, null=True)
    customer_order_ref = models.CharField(max_length=255, blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, db_column='tax_rate', blank=True, null=True)
    printed = models.BooleanField(default=0)  #note - must be BooleanField
    plain_label = models.BooleanField(default=0)

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
    orientation_name = models.CharField(max_length=255, blank=True, null=True)
    material_name = models.CharField(max_length=255, blank=True, null=True)
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True, related_name='order_product_variant')
    is_bespoke = models.BooleanField(blank=True, null=True, default=0)
    status = models.ForeignKey(OcTsgOrderProductStatus, models.DO_NOTHING, blank=True, null=True, related_name='productstatus')

    class Meta:
        managed = False
        db_table = 'oc_order_product'

   # def save(self, *args, **kwargs):
        #do the total stuff in here
    #    super(OcOrderProduct, self).save(*args, **kwargs)
     #   calc_order_totals(self.order.order_id)

    def delete(self, using=None, keep_parents=False):
        super(OcOrderProduct, self).delete(using, keep_parents)
        calc_order_totals(self.order.order_id)


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
    order_product = models.ForeignKey(OcOrderProduct, models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey(OcTsgOrderProductStatus, models.DO_NOTHING, blank=True, null=True)
    data_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    user_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_product_status_history'


def calc_order_totals(order_id):
    qs_order = OcOrder.objects.filter(pk=order_id).first()
    order_tax_rate = Decimal(qs_order.tax_rate.rate / 100)
    order_tax_title = qs_order.tax_rate.name
    qs_products = OcOrderProduct.objects.filter(order__order_id=order_id)
    sub_total_lines = Decimal(0.0)
    for product in qs_products.iterator():
        sub_total_lines += Decimal(product.price) * Decimal(product.quantity)


    qs_totals = OcOrderTotal.objects.filter(order_id=order_id)
    qs_shipping = qs_totals.filter(code='shipping')
    qs_discount = qs_totals.filter(code='discount')
    qs_total = qs_totals.get(code='total')
    qs_sub = qs_totals.get(code='sub_total')
    qs_tax = qs_totals.get(code='tax')

    if qs_shipping.exists():
        sub_total = sub_total_lines + Decimal(qs_shipping.first().value)

    if qs_discount.exists():
        sub_total -= Decimal(qs_discount.first().value)

    tax_rate_calc = 1 + order_tax_rate
    order_total_float = sub_total * tax_rate_calc
    order_total = Decimal(order_total_float.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
    tax_total = order_total - sub_total

    qs_total.value = float(order_total)
    qs_total.save()
    qs_sub.value = float(sub_total_lines)
    qs_sub.save()
    qs_tax.value = float(tax_total)
    qs_tax.title = order_tax_title
    qs_tax.save()

    #now update the order
    qs_order = OcOrder.objects.get(order_id=order_id)
    qs_order.total = order_total
    qs_order.save()


def calc_update_product_subtotal(order_id):
    qs_products = OcOrderProduct.objects.filter(order__order_id=order_id)
    sub_total_lines = Decimal(0.0)
    for product in qs_products.iterator():
        sub_total_lines += Decimal(product.price) * Decimal(product.quantity)

def recalc_order_product_tax(order_id):
    qs_order = OcOrder.objects.filter(pk=order_id).first()
    tax_rate_val = Decimal(qs_order.tax_rate.rate / 100)
    qs_products = OcOrderProduct.objects.filter(order__order_id=order_id)
    tax_value = 0.000
    for product in qs_products:
        tax_value = product.total * tax_rate_val
        product.tax = Decimal(tax_value.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        product.save()

    calc_order_totals(order_id)

