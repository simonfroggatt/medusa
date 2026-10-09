from datetime import date

from django.db import models
from django.db.models.functions import Now
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
    branding_dir = models.CharField(max_length=255, blank=True, null=True)
    merchant_center_id = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_store'
        ordering = ['store_id']

    @property
    def store_thumb_url(self):
        if self.thumb:
            return f"{settings.MEDIA_URL}stores/branding/{self.branding_dir}/logos/{self.thumb}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    @property
    def store_thumb_cdn_url(self):
        if self.thumb:
            return f"{settings.MEDIA_URL}stores/branding/{self.branding_dir}/logos/{self.thumb}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

    @property
    def store_logo_url(self):
        if self.logo:
            return f"{settings.MEDIA_URL}stores/branding/{self.branding_dir}/logos/{self.logo}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"

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


class OcTsgCustomerIntent(models.Model):
    """What a visitor asked for (site search, filters, AI questions...). Written by tsg_store;
    Medusa only reads it. source_id 1 = Internal Search, intent_type_id 1 = Search."""
    intent_id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField()
    site_id = models.SmallIntegerField()
    customer_id = models.IntegerField(blank=True, null=True)
    session_id = models.CharField(max_length=64, blank=True, null=True)
    source_id = models.SmallIntegerField()
    intent_type_id = models.SmallIntegerField()
    intent_text = models.CharField(max_length=255)
    search_type = models.CharField(max_length=50, blank=True, null=True)
    results_found = models.IntegerField(blank=True, null=True)
    clicked_product_id = models.IntegerField(blank=True, null=True)
    response_ms = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_customer_intent'

    def __str__(self):
        return self.intent_text


class OcTsgSearchRule(models.Model):
    """A storefront search ranking rule (see sql/2026-10-09_search_rules.sql). Read by tsg_store."""
    DEMOTE_ONLY = 'demote_only'
    DEMOTE_ANY = 'demote_any'
    IGNORE_WORD = 'ignore_word'
    RULE_TYPES = [
        (DEMOTE_ONLY, 'Push down products that are only in these categories'),
        (DEMOTE_ANY, 'Push down products in any of these categories'),
        (IGNORE_WORD, 'Ignore these words when ranking'),
    ]

    rule_id = models.AutoField(primary_key=True)
    store_id = models.SmallIntegerField(default=0)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    label = models.CharField(max_length=100)
    category_patterns = models.CharField(max_length=1000, blank=True, null=True)
    trigger_words = models.CharField(max_length=500, blank=True, null=True)
    penalty = models.SmallIntegerField(default=300)
    status = models.BooleanField(default=True)
    date_added = models.DateTimeField(blank=True, null=True)
    date_modified = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_search_rule'

    def __str__(self):
        return self.label

    def save(self, *args, **kwargs):
        # The columns have DB defaults, but Django writes every field, so an unset date_added
        # would be sent as NULL and date_modified would never move. Let the DB clock decide.
        if self._state.adding and not self.date_added:
            self.date_added = Now()
        self.date_modified = Now()
        super().save(*args, **kwargs)

    @property
    def patterns_list(self):
        return [p.strip() for p in (self.category_patterns or '').splitlines() if p.strip()]

    @property
    def words_list(self):
        return [w.strip() for w in (self.trigger_words or '').split(',') if w.strip()]


class OcTsgBanner(models.Model):
    """A homepage banner slide for one store (see sql/2026-10-09_banners.sql). Read by tsg_store."""
    BUTTON_STYLES = [('outline', 'Outline'), ('solid', 'Solid')]
    TEXT_ALIGNS = [('left', 'Left'), ('center', 'Centre'), ('right', 'Right')]

    banner_id = models.AutoField(primary_key=True)
    store_id = models.SmallIntegerField()
    status = models.BooleanField(default=True)
    sort_order = models.SmallIntegerField(default=0)
    image = models.ImageField(upload_to='stores/banners/', blank=True, null=True)
    image_mobile = models.ImageField(upload_to='stores/banners/', blank=True, null=True)
    alt_text = models.CharField(max_length=150, blank=True, null=True)
    tag = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=150, blank=True, null=True)
    subtitle = models.CharField(max_length=400, blank=True, null=True)
    link = models.CharField(max_length=255, blank=True, null=True)
    button_text = models.CharField(max_length=60, blank=True, null=True)
    button_style = models.CharField(max_length=10, choices=BUTTON_STYLES, default='outline')
    text_align = models.CharField(max_length=10, choices=TEXT_ALIGNS, default='center')
    bg_from = models.CharField(max_length=7, default='#0B2545')
    bg_to = models.CharField(max_length=7, default='#1a3a5c')
    date_start = models.DateField(blank=True, null=True)
    date_end = models.DateField(blank=True, null=True)
    date_added = models.DateTimeField(blank=True, null=True)
    date_modified = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_banner'
        ordering = ['store_id', 'sort_order', 'banner_id']

    def __str__(self):
        return self.title or self.alt_text or 'Banner %s' % self.banner_id

    @property
    def showing_now(self):
        today = date.today()
        return bool(self.status) and (not self.date_start or self.date_start <= today) \
            and (not self.date_end or self.date_end >= today)

    def save(self, *args, **kwargs):
        # Same as OcTsgSearchRule: let the database clock stamp the dates.
        if self._state.adding and not self.date_added:
            self.date_added = Now()
        self.date_modified = Now()
        super().save(*args, **kwargs)


class OcTsgCategoryBespoke(models.Model):
    """Which bespoke designer a shop category's "make your own" offer opens (sql/2026-10-09_category_bespoke_offer.sql).
    A row with no bespoke_product means "no offer here" and stops sub-categories inheriting. Read by tsg_store."""
    id = models.AutoField(primary_key=True)
    category_id = models.IntegerField(unique=True)
    bespoke_product_id = models.IntegerField(blank=True, null=True)
    type_label = models.CharField(max_length=40, blank=True, null=True)
    headline = models.CharField(max_length=150, blank=True, null=True)
    text = models.CharField(max_length=300, blank=True, null=True)
    prefill = models.CharField(max_length=150, blank=True, null=True)
    status = models.BooleanField(default=True)
    note = models.CharField(max_length=255, blank=True, null=True)
    date_added = models.DateTimeField(blank=True, null=True)
    date_modified = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_category_bespoke'

    def __str__(self):
        return 'Category %s' % self.category_id

    def save(self, *args, **kwargs):
        if self._state.adding and not self.date_added:
            self.date_added = Now()
        self.date_modified = Now()
        super().save(*args, **kwargs)
