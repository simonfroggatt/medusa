from django.db import models
from apps.orders.models import OcOrder

# Create your models here.
class OcTsgStripePayments(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, default='GBP')
    status = models.CharField(max_length=20, blank=True, null=True)
    stripe_payment_intent_id = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_created=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_stripe_payments'

    def __str__(self):
        return f"Payment {self.id} - {self.amount} {self.currency}"