from django.db import models


class OcStore(models.Model):
    store_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    url = models.CharField(max_length=255)
    ssl = models.CharField(max_length=255)
    code = models.CharField(max_length=30, blank=True, null=True)
    thumb = models.CharField(max_length=255, blank=True, null=True)
    logo = models.CharField(max_length=255, blank=True, null=True)
    medusa_logo = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_store'

    def __str__(self):
        return self.name


class OcTaxRate(models.Model):
    tax_rate_id = models.AutoField(primary_key=True)
    geo_zone_id = models.IntegerField()
    name = models.CharField(max_length=32)
    rate = models.DecimalField(max_digits=15, decimal_places=4)
    type = models.CharField(max_length=1)
    date_added = models.DateTimeField()
    date_modified = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'oc_tax_rate'


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

