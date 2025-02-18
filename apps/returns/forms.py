from django import forms
from .models import OcTsgReturnOrderProduct, OcTsgReturnOrder
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Field

class ReturnProductEditForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(ReturnProductEditForm, self).__init__(*args, **kwargs)
        self.fields['status'].empty_label = None
        self.fields['reason'].empty_label = None

    class Meta:
        model = OcTsgReturnOrderProduct
        fields = ['status', 'reason']


class ReturnEditForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(ReturnEditForm, self).__init__(*args, **kwargs)
        self.fields['status'].empty_label = None
        self.fields['action'].empty_label = None

    class Meta:
        model = OcTsgReturnOrder
        fields = ['status', 'action', 'contact_requested', 'contact_email', 'contact_telephone', 'contact_name']