from django import forms
from apps.sites.models import OcStore
from tinymce.widgets import TinyMCE


class StoreEditForm(forms.ModelForm):


    def __init__(self, *args, **kwargs):
        super(StoreEditForm, self).__init__(*args, **kwargs)
        self.fields['currency'].empty_label = None
        self.fields['tax_rate'].empty_label = None

    class Meta:
        model = OcStore

        fields = '__all__'

        labels = {
            'status': 'Site Live',
            'logo': 'Website Logo',
            'prefix': 'Order Ref Prefix',
            'name': 'Title',
            'footer_text' : 'Website Footer Text'
        }

        widgets = {
            'status': forms.CheckboxInput,
            'email_address': forms.EmailInput,
            'accounts_email_address': forms.EmailInput,
            'address': forms.Textarea(attrs={'rows': 5}),
        }

