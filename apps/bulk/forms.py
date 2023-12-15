from django import forms
from apps.products.models import OcTsgBulkdiscountGroups, OcTsgBulkdiscountGroupBreaks


class BulkGroupEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgBulkdiscountGroups
        fields = '__all__'
