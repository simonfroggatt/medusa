"""Models for the customer quote system (quotes_web).

Tables created by hand (tsg_medusa/docs/quotes_web_v1_plan.md), so everything here is
managed=False like the rest of Medusa. These are the V1 customer quote tables - the older
staff quote tool lives in apps.quotes on oc_tsg_quote / oc_tsg_quote_product.

Business rules are not in here: status changes go through services/transitions.py, totals
and quote creation through services/quotes.py.
"""
from django.db import models
from django.utils import timezone

from apps.customer.models import OcCustomer
from apps.options.models import OcTsgOptionClass, OcTsgOptionTypes, OcTsgOptionValues
from apps.products.models import OcProduct, OcTsgBulkdiscountGroups, OcTsgProductVariants
from apps.sites.models import OcCurrency, OcStore
from apps.suppliers.models import OcSupplier
from medusa.models import AuthUser

from . import constants


class QuoteStatus(models.Model):
    """Lookup, seeded in the database. Read-only from Medusa."""
    status_id = models.AutoField(primary_key=True)
    status_code = models.CharField(unique=True, max_length=32)
    status_name = models.CharField(max_length=255)
    status_description = models.TextField(blank=True, null=True)
    color_hex = models.CharField(max_length=7, blank=True, null=True)
    sort_order = models.IntegerField(db_column='order', blank=True, null=True)
    is_terminal = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_status'
        ordering = ['sort_order']

    def __str__(self):
        return self.status_name


class QuoteStatusTransition(models.Model):
    """Which status may follow which, and who is allowed to do it. Seeded lookup."""
    transition_id = models.AutoField(primary_key=True)
    from_status = models.ForeignKey(QuoteStatus, models.DO_NOTHING, db_column='from_status_id',
                                    related_name='transitions_from')
    to_status = models.ForeignKey(QuoteStatus, models.DO_NOTHING, db_column='to_status_id',
                                  related_name='transitions_to')
    transition_name = models.CharField(max_length=255, blank=True, null=True)
    role_required = models.CharField(max_length=64, default=constants.ROLE_STAFF)
    is_allowed = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_status_transition'

    def __str__(self):
        return f'{self.transition_name} ({self.from_status_id} -> {self.to_status_id})'


class Quote(models.Model):
    """A customer quote request. Header only - lines are QuoteItem."""
    quote_id = models.AutoField(primary_key=True)
    quote_number = models.CharField(unique=True, max_length=32)
    public_token = models.CharField(unique=True, max_length=64)

    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=32)
    customer_email = models.CharField(max_length=96, blank=True, null=True)
    medusa_customer = models.ForeignKey(OcCustomer, models.DO_NOTHING, db_column='medusa_customer_id',
                                        blank=True, null=True, related_name='web_quotes')

    status = models.ForeignKey(QuoteStatus, models.DO_NOTHING, db_column='status_id',
                               related_name='quotes')
    created_from = models.CharField(max_length=7, default=constants.CREATED_FROM_WEBSITE)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, db_column='store_id',
                              blank=True, null=True, related_name='web_quotes')
    currency = models.ForeignKey(OcCurrency, models.DO_NOTHING, db_column='currency_id',
                                 related_name='web_quotes')

    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    tax_total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    shipping_cost = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, default=0.00)
    discount_amount = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, default=0.00)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    viewed_at = models.DateTimeField(blank=True, null=True)
    accepted_at = models.DateTimeField(blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    date_sent = models.DateTimeField(blank=True, null=True)

    pdf_url = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_request'
        ordering = ['-created_at']

    def __str__(self):
        return self.quote_number

    def is_expired(self):
        """Expiry is checked when the quote is read; nothing writes the expired status in V1."""
        return bool(self.expiry_date) and self.expiry_date < timezone.now()

    def is_editable(self):
        return self.status.status_code in constants.EDITABLE_STATUS_CODES

    def is_whatsapp_region(self):
        """UAE customers are quoted by WhatsApp, everyone else by email."""
        store_country = self.store.country if self.store_id else None
        return store_country in constants.WHATSAPP_COUNTRIES


class QuoteItem(models.Model):
    """A quote line, priced when the quote was requested.

    single_unit_price is the price before the bulk discount, INCLUDING option add-ons -
    the figure the storefront applies the bulk band to. (On an order line the same column
    holds the base price only.) Keeping it lets staff change the quantity and have the
    line repriced the way the cart would.
    """
    quote_item_id = models.AutoField(primary_key=True)
    quote = models.ForeignKey(Quote, models.CASCADE, db_column='quote_id', related_name='items')
    product = models.ForeignKey(OcProduct, models.DO_NOTHING, db_column='product_id',
                                blank=True, null=True, related_name='web_quote_items')
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING,
                                        db_column='product_variant_id', blank=True, null=True,
                                        related_name='web_quote_items')
    product_name = models.CharField(max_length=255)
    variant_code = models.CharField(max_length=255, blank=True, null=True)

    # line detail, named as on oc_order_product / oc_tsg_quote_product so a quote line can be
    # copied to an order and the same dialogs work on both
    size_name = models.CharField(max_length=256, blank=True, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    height = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    orientation_name = models.CharField(max_length=255, blank=True, null=True)
    material_name = models.CharField(max_length=255, blank=True, null=True)
    supplier = models.ForeignKey(OcSupplier, models.DO_NOTHING, db_column='supplier_id',
                                 blank=True, null=True, related_name='web_quote_items')
    supplier_code = models.CharField(max_length=64, blank=True, null=True)

    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=15, decimal_places=4)
    single_unit_price = models.DecimalField(max_digits=15, decimal_places=4, default=0.0000)
    base_unit_price = models.DecimalField(max_digits=15, decimal_places=4, default=0.0000)
    bulk_discount = models.ForeignKey(OcTsgBulkdiscountGroups, models.DO_NOTHING,
                                      db_column='bulk_discount_id', blank=True, null=True,
                                      related_name='web_quote_items')
    bulk_used = models.BooleanField(default=True)
    line_discount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    exclude_discount = models.BooleanField(default=False)
    line_total = models.DecimalField(max_digits=15, decimal_places=4)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True, default=0.0000)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    product_image = models.CharField(max_length=255, blank=True, null=True)
    is_bespoke = models.BooleanField(default=False)
    bespoke_data = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    line_order = models.IntegerField(blank=True, null=True, default=0)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_item'
        ordering = ['line_order', 'quote_item_id']

    def __str__(self):
        return f'{self.quantity} x {self.product_name}'


class QuoteItemOption(models.Model):
    """An option chosen on a quote line - drill holes, laminate, and the like.

    Mirrors oc_tsg_order_product_options so a won quote can be copied to an order. Names are
    stored alongside the ids because an option's wording may change after the quote was given,
    and the customer must keep seeing what they were quoted.
    """
    id = models.AutoField(primary_key=True)
    quote_item = models.ForeignKey(QuoteItem, models.CASCADE, db_column='quote_item_id',
                                   related_name='options')
    class_field = models.ForeignKey(OcTsgOptionClass, models.DO_NOTHING, db_column='class_id',
                                    blank=True, null=True, related_name='web_quote_item_options')
    class_name = models.CharField(max_length=255, blank=True, null=True)
    value = models.ForeignKey(OcTsgOptionValues, models.DO_NOTHING, db_column='value_id',
                              blank=True, null=True, related_name='web_quote_item_options')
    value_name = models.CharField(max_length=255, blank=True, null=True)
    bl_dynamic = models.BooleanField(default=False)
    dynamic_class_id = models.IntegerField(blank=True, null=True, default=0)
    dynamic_value_id = models.IntegerField(blank=True, null=True, default=0)
    class_type = models.ForeignKey(OcTsgOptionTypes, models.DO_NOTHING, db_column='class_type_id',
                                   blank=True, null=True, related_name='web_quote_item_options')
    price_modifier = models.DecimalField(max_digits=15, decimal_places=4, default=0.0000)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_item_options'

    def __str__(self):
        return f'{self.class_name}: {self.value_name}'


class QuoteAction(models.Model):
    """Audit trail. Staff actions carry the user; customer actions carry ip/user agent."""
    action_id = models.AutoField(primary_key=True)
    quote = models.ForeignKey(Quote, models.CASCADE, db_column='quote_id', related_name='actions')
    action_type = models.CharField(max_length=32)
    action_data = models.TextField(blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING, db_column='user_id',
                             blank=True, null=True, related_name='web_quote_actions')
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_quote_action'
        # created_at only has second resolution, and several actions can share a second
        # (send, then the customer opening the link), so fall back to insertion order
        ordering = ['-created_at', '-action_id']

    def __str__(self):
        return f'{self.action_type} on {self.quote_id}'
