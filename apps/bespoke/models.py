from django.db import models

# Create your models here.


class OcTsgBespokeDesigns(models.Model):
    """A sign drawn in Medusa that belongs to nobody yet.

    Table created by sql/2026-09-24_bespoke_designs.sql. Every other design in
    the system hangs off a product, a basket line or an order line; these are
    free-standing — worked up for a customer who rang, or tried out before
    quoting.
    """
    KINDS = {
        'standard': 'Basic / Advanced',
        'bilingual': 'Two languages',
        'board': 'Site safety board',
        'roadsign': 'Temporary site sign',
    }

    design_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=160, blank=True, default='')
    kind = models.CharField(max_length=20, default='standard')
    design = models.TextField(blank=True, null=True)
    svg_raw = models.TextField(blank=True, null=True)
    svg_export = models.BinaryField(blank=True, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    height = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    order_product_id = models.IntegerField(blank=True, null=True)
    created_by_id = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_designs'
        ordering = ['-updated_at']

    @property
    def kind_label(self):
        return self.KINDS.get(self.kind, self.kind)

    @property
    def size_label(self):
        if self.width and self.height:
            return f'{self.width:.0f} × {self.height:.0f} mm'
        return ''

    def __str__(self):
        return self.name or f'Design {self.pk}'
