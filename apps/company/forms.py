from django import forms
from .models import OcTsgCompany


class CompanyEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgCompany
        fields = '__all__'

        labels = {
            'fullname': 'Main contact',
            'payment_days': 'Day(s)'
        }

        widgets = {
            'email': forms.EmailInput,
            'company_name': forms.TextInput(attrs={'autofocus': True}),
            'address': forms.Textarea(attrs={'rows': 4}),
        }


