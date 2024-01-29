from django.db import models
from django.conf import settings
from apps.products.models import OcProduct
from apps.category.models import OcTsgCategoryTypes


class OcTsgProductSymbols(models.Model):
    product = models.OneToOneField(OcProduct, models.DO_NOTHING, primary_key=True, related_name='productsymbols')
    symbol = models.ForeignKey('OcTsgSymbols', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_symbols'
        unique_together = (('product', 'symbol'),)


class OcTsgSymbolCategory(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=2048, blank=True, null=True)
    default_colour_rgb = models.CharField(db_column='default_colour_RGB', max_length=20, blank=True, null=True)  # Field name made lowercase.
    default_colour_hex = models.CharField(db_column='default_colour_HEX', max_length=10, blank=True, null=True)  # Field name made lowercase.
    default_text_hex = models.CharField(db_column='default_text_HEX', max_length=10, blank=True, null=True)  # Field name made lowercase.
    default_colour = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbol_category'

    def __str__(self):
        return self.title


class OcTsgSymbolStandards(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    target_url = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbol_standards'

    def __str__(self):
        return self.title


class OcTsgSymbols(models.Model):
    image_path = models.ImageField(upload_to='symbols/thumbs/', blank=True, null=True)
    refenceno = models.CharField(max_length=48, blank=True, null=True)
    referent = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=1024, blank=True, null=True)
    content = models.CharField(max_length=1024, blank=True, null=True)
    hazard = models.CharField(max_length=1024, blank=True, null=True)
    humanbehav = models.CharField(max_length=1024, blank=True, null=True)
    svg_path = models.ImageField(upload_to='symbols/svg/', width_field='image_width', height_field='image_height')
    category = models.ForeignKey(OcTsgCategoryTypes, models.DO_NOTHING, db_column='category', blank=True, null=True, related_name='symbolcats')
    standard = models.ForeignKey(OcTsgSymbolStandards, models.DO_NOTHING, blank=True, null=True, related_name='symbolstandards')
    image_width = models.IntegerField(blank=True, null=True)
    image_height = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbols'

    @property
    def symbol_image_url(self):
        if self.image_path:
            return f"{settings.MEDIA_URL}{self.image_path}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"