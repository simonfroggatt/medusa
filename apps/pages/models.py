from django.db import models
from medusa.models import OcLanguage
from apps.sites.models import OcStore


class OcTsgBlogs(models.Model):
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    slug = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255)
    sub_title = models.CharField(max_length=1024)
    blog_text = models.TextField()
    image = models.ImageField( upload_to='stores/blogs/', null=True, blank=True)
    status = models.BooleanField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now=True)
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING)
    key_words = models.CharField(max_length=1024, blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    read_count = models.IntegerField(blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.CharField(max_length=512, blank=True, null=True)
    meta_keywords = models.CharField(max_length=512, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_blogs'

    def __str__(self):
        return self.title


class OcInformationDescription(models.Model):
    information_id = models.AutoField(primary_key=True)
    language = models.ForeignKey(OcLanguage, models.DO_NOTHING, blank=True, null=True)
    store = models.ForeignKey(OcStore, models.DO_NOTHING, blank=True, null=True)
    title = models.CharField(max_length=64)
    description = models.TextField()
    meta_title = models.CharField(max_length=255,blank=True, null=True)
    meta_description = models.CharField(max_length=255,blank=True, null=True)
    meta_keyword = models.CharField(max_length=255,blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    bottom = models.BooleanField(blank=True)
    status = models.BooleanField(blank=True)
    clean_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_information_description'
        unique_together = (('information_id', 'language'),)

    def __str__(self):
        return self.title



