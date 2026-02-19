from django.db import models
from django.conf import settings


class OcTsgGoogleShoppingCategory(models.Model):
    google_cat_id = models.IntegerField(primary_key=True)
    google_cat_name = models.CharField(max_length=2048, blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_google_shopping_category'
        ordering = ['sort_order', 'google_cat_name']

    def __str__(self):
        return self.google_cat_name


class OcTaxClass(models.Model):
    tax_class_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=255)
    date_added = models.DateTimeField()
    date_modified = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'oc_tax_class'

    def __str__(self):
        return self.title

class OcTaxRate(models.Model):
    tax_rate_id = models.AutoField(primary_key=True)
    geo_zone_id = models.IntegerField()
    name = models.CharField(max_length=32)
    rate = models.DecimalField(max_digits=15, decimal_places=4)
    type = models.CharField(max_length=1)
    date_added = models.DateTimeField()
    date_modified = models.DateTimeField()
    accounting_code = models.CharField(max_length=32)

    class Meta:
        managed = False
        db_table = 'oc_tax_rate'

    def __str__(self):
        return self.name


class OcTsgCategoryTypes(models.Model):
    category_type_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    default_colour_rgb = models.CharField(db_column='default_colour_RGB', max_length=20, blank=True, null=True)  # Field name made lowercase.
    default_colour_hex = models.CharField(db_column='default_colour_HEX', max_length=10, blank=True, null=True)  # Field name made lowercase.
    default_text_hex = models.CharField(db_column='default_text_HEX', max_length=10, blank=True, null=True)  # Field name made lowercase.
    default_colour = models.CharField(max_length=20, blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_category_types'

    def __str__(self):
        return self.title


class OcLanguage(models.Model):
    language_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=32)
    code = models.CharField(max_length=5)
    locale = models.CharField(max_length=255)
    image = models.CharField(max_length=64)
    directory = models.CharField(max_length=32)
    sort_order = models.IntegerField()
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'oc_language'

    def __str__(self):
        return self.name


class OcTsgCountryIso(models.Model):
    iso_id = models.IntegerField(primary_key=True)
    iso2 = models.CharField(max_length=2, blank=True, null=True)
    iso3 = models.CharField(max_length=3, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_country_iso'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name



class OcTsgPaymentTerms(models.Model):
    terms_id = models.AutoField(primary_key=True)
    term_title = models.CharField(max_length=255, blank=True, null=True)
    shortcode = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_payment_terms'

    def __str__(self):
        return self.term_title


class OcTsgAccountType(models.Model):
    account_type_id = models.AutoField(primary_key=True)
    account_type_name = models.CharField(max_length=32, blank=True, null=True)
    account_type_description = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_account_type'

    def __str__(self):
        return self.account_type_name


class OcSupplier(models.Model):
    code = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    main_contact = models.CharField(max_length=255, blank=True, null=True)
    order_email = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    area = models.CharField(max_length=255, blank=True, null=True)
    postcode = models.CharField(max_length=255, blank=True, null=True)
    country = models.ForeignKey(OcTsgCountryIso, models.DO_NOTHING, blank=True, null=True)
    main_telephone = models.CharField(max_length=255, blank=True, null=True)
    alt_telephone = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_supplier'

    def __str__(self):
        return self.company


class OcTsgFileTypes(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_file_types'

    def __str__(self):
        return self.name

class OcTsgFiletypeImages(models.Model):
    extension = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_filetype_images'

    @property
    def image_url(self):
        return f"{settings.STATIC_URL}images/filetypes/{self.image}"


    def __str__(self):
        return self.image


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


class OcTsgComplianceStandards(models.Model):
    code = models.CharField(unique=True, max_length=50, db_comment='bs-5499, iso-3864, solas-chapter-iii')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    authority = models.CharField(max_length=100, blank=True, null=True, db_comment='BSI, IMO, DfT, HSE')
    regulation_url = models.CharField(max_length=500, blank=True, null=True)
    effective_date = models.DateField(blank=True, null=True)
    region = models.CharField(max_length=50, blank=True, null=True, db_comment='UK, EU, International, UAE')
    mandatory = models.IntegerField(blank=True, null=True)
    industry_sectors = models.CharField(max_length=255, blank=True, null=True, db_comment='Comma-separated: maritime,construction,general-workplace')
    status = models.IntegerField(blank=True, null=True)
    benefit = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_compliance_standards'

    def __str__(self):
        return self.code


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'