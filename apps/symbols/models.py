from django.db import models
from django.conf import settings
from apps.products.models import OcProduct
from apps.category.models import OcTsgCategoryTypes
from medusa.models import OcTsgComplianceStandards

class OcTsgSymbolShape(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbol_shape'

    def __str__(self):
        return self.name





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



class OcTsgSymbols(models.Model):
    image_path = models.ImageField(upload_to='symbols/thumbs/', blank=True, null=True, )
    svg_path = models.ImageField(upload_to='stores/symbols/svg/', width_field='image_width',
                                 height_field='image_height', blank=True)
    referent = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=1024, blank=True, null=True)
    content = models.CharField(max_length=1024, blank=True, null=True)
    hazard = models.CharField(max_length=1024, blank=True, null=True)
    humanbehav = models.CharField(max_length=1024, blank=True, null=True)
    image_width = models.IntegerField(blank=True, null=True)
    image_height = models.IntegerField(blank=True, null=True)
    shape = models.ForeignKey(OcTsgSymbolShape, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbols'
        ordering = ['id']

    @property
    def symbol_image_url(self):
        if self.svg_path:
            return f"{settings.MEDIA_URL}{self.svg_path}"
        else:
            return f"{settings.MEDIA_URL}no-image.png"



class OcTsgSymbolPurposes(models.Model):
    category = models.ForeignKey(OcTsgSymbolCategory, models.DO_NOTHING)
    title = models.CharField(max_length=200)
    description = models.TextField(db_comment='Specific purpose/location for template use')
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbol_purposes'

    def __str__(self):
        return self.title


class OcTsgSymbolStandard(models.Model):
    symbol = models.ForeignKey(OcTsgSymbols, models.DO_NOTHING)
    compliance = models.ForeignKey(OcTsgComplianceStandards, models.DO_NOTHING)
    category = models.ForeignKey(OcTsgSymbolCategory, models.DO_NOTHING, blank=True, null=True)
    code = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True, db_comment='Any specific notes for this combination')
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_created=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    photolume = models.BooleanField(default=False)
    reflective = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'oc_tsg_symbol_standard'
        unique_together = (('symbol', 'compliance'),)

    @property
    def symbol_image_url(self):
        return self.symbol.symbol_image_url

    def __str__(self):
        return self.code


class OcTsgLinkedSymbol(models.Model):
    symbol = models.OneToOneField(OcTsgSymbolStandard, models.DO_NOTHING, primary_key=True)  # The composite primary key (symbol_id, linked_symbol_id) found, that is not supported. The first column is selected.
    linked_symbol = models.ForeignKey(OcTsgSymbolStandard, models.DO_NOTHING, related_name='octsglinkedsymbol_linked_symbol_set')

    class Meta:
        managed = False
        db_table = 'oc_tsg_linked_symbol'
        unique_together = (('symbol', 'linked_symbol'),)



class OcTsgProductSymbols(models.Model):
    product = models.OneToOneField(OcProduct, models.DO_NOTHING, primary_key=True, related_name='productsymbols')
    symbol_standard = models.ForeignKey(OcTsgSymbolStandard, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'oc_tsg_product_symbols'
        unique_together = (('product', 'symbol_standard'),)

    @property
    def symbol_image_url(self):
        return self.symbol_standard.symbol.symbol_image_url