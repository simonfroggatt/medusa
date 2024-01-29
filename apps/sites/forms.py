from django import forms
from apps.sites.models import OcStore
from tinymce.widgets import TinyMCE


class StoreEditForm(forms.ModelForm):

    class Meta:
        model = OcStore

        fields = '__all__'

        labels = {
            'status': 'Site Live',
            'logo': 'Website Logo',
            'prefix': 'Order Ref Prefix',
        }

        widgets = {
            'status': forms.CheckboxInput,
            'email_address': forms.EmailInput,
            'address': forms.Textarea(attrs={'rows': 5}),
        }

