from django import forms
from apps.suppliers.models import OcSupplier


class SuppliersEditForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(SuppliersEditForm, self).__init__(*args, **kwargs)
        self.fields['account_type'].empty_label = None
        self.fields['payment_terms'].empty_label = None
        self.fields['payment_days'].empty_label = None
        self.fields['country'].empty_label = None

    class Meta:
        model = OcSupplier

        fields = '__all__'

        labels = {
            'order_email': 'Email',
        }

        widgets = {
            'order_email': forms.EmailInput,
            'address': forms.Textarea(attrs={'rows': 4}),
        }

