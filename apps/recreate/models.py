import json

from django.db import models


# Table created by sql/2026-09-17_bespoke_recreations.sql
class OcTsgBespokeRecreations(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_REVIEW = 'review'
    STATUS_NEEDS_SYMBOL = 'needs_symbol'
    STATUS_UNSUITABLE = 'unsuitable'
    STATUS_APPROVED = 'approved'
    STATUS_FAILED = 'failed'
    STATUSES = {
        STATUS_PENDING: 'Not recreated yet',
        STATUS_REVIEW: 'To review',
        STATUS_NEEDS_SYMBOL: 'Needs a symbol',
        STATUS_UNSUITABLE: 'Not suitable',
        STATUS_APPROVED: 'Approved',
        STATUS_FAILED: 'Failed',
    }

    product_id = models.IntegerField(unique=True)
    store_id = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default=STATUS_PENDING)
    source_image = models.CharField(max_length=255, blank=True, null=True)
    sign_reads = models.TextField(blank=True, null=True)
    size_id = models.IntegerField(blank=True, null=True)
    recipe = models.TextField(blank=True, null=True)
    design = models.TextField(blank=True, null=True)
    missing_symbols = models.TextField(blank=True, null=True)
    confidence = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    ai_notes = models.TextField(blank=True, null=True)
    ai_model = models.CharField(max_length=64, blank=True, null=True)
    ai_cost_usd = models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
    error = models.TextField(blank=True, null=True)
    attempts = models.IntegerField(default=0)
    reviewed_by_id = models.IntegerField(blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_recreations'

    @property
    def status_label(self):
        return self.STATUSES.get(self.status, self.status)

    @property
    def missing_list(self):
        try:
            value = json.loads(self.missing_symbols or '[]')
            return value if isinstance(value, list) else []
        except ValueError:
            return []

    def __str__(self):
        return f'Recreation of product {self.product_id} ({self.status})'
