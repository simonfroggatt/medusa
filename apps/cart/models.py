from django.db import models
from apps.sites.models import OcStore
from apps.products.models import OcTsgProductVariants


class OcCart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    api_id = models.IntegerField()
    customer_id = models.IntegerField()
    session_id = models.CharField(max_length=32)
    product_id = models.IntegerField()
    recurring_id = models.IntegerField()
    option = models.TextField()
    quantity = models.IntegerField()
    product_variant = models.ForeignKey(OcTsgProductVariants, models.DO_NOTHING, blank=True, null=True, related_name='cart_variant')
    line_discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tsg_options = models.TextField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_cart'