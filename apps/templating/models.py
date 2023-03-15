from django.db import models
from apps.sites.models import OcStore


class OcTsgTemplateTypes(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_template_types'

    def __str__(self):
        return self.name


class OcTsgTemplates(models.Model):
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    template_type = models.ForeignKey(OcTsgTemplateTypes, models.DO_NOTHING, db_column='template_type', blank=True,
                                         null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    header = models.CharField(max_length=512, blank=True, null=True)
    main = models.TextField(blank=True, null=True)
    plain_text = models.BooleanField()
    description = models.CharField(max_length=1024, blank=True, null=True)



    class Meta:
        managed = False
        db_table = 'oc_tsg_templates'

    def __str__(self):
        return self.name
