from django.db import models
from apps.orders.models import OcOrder, OcOrderProduct
from apps.sites.models import OcStore

class OcTsgReturnStatus(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    icon = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_return_status'

    def __str__(self):
        return self.title

class OcTsgReturnAction(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_return_action'

    def __str__(self):
        return self.title


class OcTsgReturnReason(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_return_reason'

    def __str__(self):
        return self.title


class OcTsgReturnOrder(models.Model):
    order = models.ForeignKey(OcOrder, models.DO_NOTHING, blank=True, null=True, related_name='returnorder')
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True, related_name='returnstore')
    action = models.ForeignKey(OcTsgReturnAction, models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey(OcTsgReturnStatus, models.DO_NOTHING, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    comment = models.TextField(blank=True, null=True)
    contact_requested = models.BooleanField(blank=True, null=True, default=False)
    contact_email = models.CharField(max_length=255, blank=True, null=True)
    contact_telephone = models.CharField(max_length=255, blank=True, null=True)
    contact_name = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_return_order'


class OcTsgReturnOrderHistory(models.Model):
    id = models.IntegerField(primary_key=True)
    return_field = models.ForeignKey(OcTsgReturnOrder, models.DO_NOTHING, db_column='return_id', blank=True, null=True)  # Field renamed because it was a Python reserved word.
    status = models.ForeignKey(OcTsgReturnStatus, models.DO_NOTHING, blank=True, null=True)
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    comment = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_return_order_history'


class OcTsgReturnOrderProduct(models.Model):
    return_field = models.ForeignKey(OcTsgReturnOrder, models.DO_NOTHING, db_column='return_id', blank=True, null=True)  # Field renamed because it was a Python reserved word.
    order_product = models.ForeignKey(OcOrderProduct, models.DO_NOTHING, blank=True, null=True, related_name='returnorderproduct')
    reason = models.ForeignKey(OcTsgReturnReason, models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey(OcTsgReturnStatus, models.DO_NOTHING, blank=True, null=True)
    comment = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_return_order_product'


class OcTsgReturnOrderProductHistory(models.Model):
    return_product = models.ForeignKey(OcTsgReturnOrderProduct, models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey(OcTsgReturnStatus, models.DO_NOTHING, blank=True, null=True)
    date_added = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    comment = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_return_order_product_history'




