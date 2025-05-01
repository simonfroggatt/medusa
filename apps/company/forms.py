from django import forms
from .models import OcTsgCompany, OcTsgCompanyDocuments


class CompanyEditForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CompanyEditForm, self).__init__(*args, **kwargs)
        self.fields['payment_terms'].empty_label = None
        self.fields['status'].empty_label = None
        self.fields['account_type'].empty_label = None
        self.fields['store'].empty_label = None
        self.fields['company_type'].empty_label = None
        self.fields['accounts_country'].empty_label = None
        self.fields['tax_rate'].empty_label = None


    class Meta:
        model = OcTsgCompany
        fields = '__all__'

        labels = {
            'fullname': 'Main contact',
            'payment_days': 'Day(s)',
        }

        widgets = {
            'company_name': forms.TextInput(attrs={'autofocus': True}),
            'accounts_address': forms.Textarea(attrs={'rows': 4}),
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
