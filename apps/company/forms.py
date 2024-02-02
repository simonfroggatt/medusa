from django import forms
from .models import OcTsgCompany, OcTsgCompanyDocuments


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


class CompanyDocumentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(CompanyDocumentForm, self).__init__(*args, **kwargs)
        self.fields['type'].empty_label = None

    class Meta:
        model = OcTsgCompanyDocuments
        fields = '__all__'

    widgets = {
        'company': forms.Select(attrs={"hidden": True}),
    }