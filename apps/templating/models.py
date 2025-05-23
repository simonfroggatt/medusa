from django.db import models
from apps.sites.models import OcStore

class OcTsgTemplatePredefines(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    enum_val = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_template_predefines'

    def __str__(self):
        return self.title


class OcTsgTemplateTypes(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_template_types'

    def __str__(self):
        return self.name


class OcTsgTemplates(models.Model):
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    template_type = models.ForeignKey(OcTsgTemplatePredefines, models.DO_NOTHING, db_column='template_type', blank=True,
                                         null=True, related_name='template_type')

    name = models.CharField(max_length=255, blank=True, null=True)
    subject = models.CharField(max_length=512, blank=True, null=True)
    main = models.TextField(blank=True, null=True)
    plain_text = models.BooleanField()
    description = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_templates'

    def __str__(self):
        return self.name
