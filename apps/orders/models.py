from django.db import models
from medusa.models import OcStore
from django.utils import timezone
import datetime as dt
from apps.customer.models import OcCustomer
from apps.products.models import OcTsgProductVariants
from decimal import Decimal
from medusa.models import OcTsgCountryIso, OcTaxRate

class OcOrderQuerySet(models.QuerySet):
    def successful(self):
        valid_status = [2, 3, 4]
        return self.filter(payment_status_id__in=valid_status)

    def days_since(self):
       #ß today_data = '2019-06-17'
        return 1


class OcOrderManager(models.Manager):
    def get_queryset(self):
        return OcOrderQuerySet(self.model, using=self._db)

    def successful(self):
        return self.get_queryset().successful()

    def days_since(self):
        return 3


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


class OcTsgPaymentType(models.Model):
    payment_type_id = models.AutoField(primary_key=True)
    payment_type_name = models.CharField(max_length=255, blank=True, null=True)
    payment_type_icon = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_type'

    def __str__(self):
        return self.payment_type_name


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

    class Meta:
        managed = False
        db_table = 'oc_tsg_order_product_status'

    def __str__(self):
        return self.name


class OcOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    invoice_no = models.IntegerField()
    invoice_prefix = models.CharField(max_length=26)
    store = models.ForeignKey(OcStore, models.DO_NOTHING)
    store_name = models.CharField(max_length=64)
    store_url = models.CharField(max_length=255)
    customer = models.ForeignKey(OcCustomer, models.DO_NOTHING, blank=True, null=True)
    customer_group_id = models.IntegerField()
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
    language_id = models.IntegerField()
    currency_id = models.IntegerField()
    currency_code = models.CharField(max_length=3)
    currency_value = models.DecimalField(max_digits=15, decimal_places=8)
    ip = models.CharField(max_length=40)
    forwarded_ip = models.CharField(max_length=40)
    user_agent = models.CharField(max_length=255)
    accept_language = models.CharField(max_length=255, blank=True, null=True)
    date_added = models.DateTimeField()
    date_modified = models.DateTimeField()
    date_due = models.DateField(blank=True, null=True)
    order_status = models.ForeignKey(OcOrderStatus, models.DO_NOTHING, blank=True, null=True)
    payment_method = models.ForeignKey(OcTsgPaymentMethod, models.DO_NOTHING, db_column='payment_method_id', blank=True, null=True)  # Field renamed because of name conflict.
    payment_type = models.ForeignKey(OcTsgPaymentType, models.DO_NOTHING, blank=True, null=True)
    payment_status = models.ForeignKey(OcTsgPaymentStatus, models.DO_NOTHING, blank=True, null=True)
    xero_id = models.CharField(max_length=256, blank=True, null=True)
    customer_order_ref = models.CharField(max_length=255, blank=True, null=True)
    tax_rate = models.ForeignKey(OcTaxRate, models.DO_NOTHING, db_column='tax_rate', blank=True, null=True)

    @property
    def is_order(self):
        return self.order_status.order_status_id == 15

    def dow(self):
        return self.date_added.strftime('%a')

    def days_since_order(self):
        today = dt.datetime.now()
        ordered = dt.datetime(self.date_added.year, self.date_added.month, self.date_added.day)
        delta = today - ordered
        return delta.days

    def testit(self):
        return 1


    class Meta:
        managed = False
        db_table = 'oc_order'

    objects = OcOrderManager()


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
    order = models.OneToOneField(OcOrder, models.DO_NOTHING, primary_key=True, related_name='orderflags')
    flag = models.ForeignKey(OcTsgFlags, models.DO_NOTHING)
    date_added = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_order_flags'
        unique_together = (('order', 'flag'),)


class OcOrderProduct(models.Model):
    order_product_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, related_name='order_products')
    product_id = models.IntegerField()
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=64)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=15, decimal_places=2)
    total = models.DecimalField(max_digits=15, decimal_places=2)
    tax = models.DecimalField(max_digits=15, decimal_places=2)
    reward = models.IntegerField()
    size_name = models.CharField(max_length=256, blank=True, null=True)
    orientation_name = models.CharField(max_length=255, blank=True, null=True)
    material_name = models.CharField(max_length=255, blank=True, null=True)
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True, related_name='order_product_variant')
    is_bespoke = models.BooleanField(blank=True, null=True, default=0)
    status = models.ForeignKey(OcTsgOrderProductStatus, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_order_product'

    def save(self, *args, **kwargs):
        #do the total stuff in here
        super(OcOrderProduct, self).save(*args, **kwargs)
        calc_order_totals(self.order.order_id)

    def delete(self, using=None, keep_parents=False):
        super(OcOrderProduct, self).delete(using, keep_parents)
        calc_order_totals(self.order.order_id)


class OcOrderTotal(models.Model):
    order_total_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING)
    code = models.CharField(max_length=32)
    title = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=15, decimal_places=4)
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_order_total'
        ordering = ['sort_order']


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


def calc_order_totals(order_id):
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

    order_total = sub_total * Decimal(1.2) #todo - get the localised VAT rate
    tax_total = order_total - sub_total

    qs_total.value = float(order_total)
    qs_total.save()
    qs_sub.value = float(sub_total_lines)
    qs_sub.save()
    qs_tax.value = float(tax_total)
    qs_tax.save()

    #now update the order
    qs_order = OcOrder.objects.get(order_id=order_id)
    qs_order.total = order_total
    qs_order.save()

