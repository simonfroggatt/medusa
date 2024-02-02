from django import forms
from .models import OcAddress, OcCustomer, OcTsgContactDocuments



class AddressForm(forms.ModelForm):
    class Meta:
        model = OcAddress
        fields = [

            'company',
            'branch',
            'fullname',
            'telephone',
            'email',
            'address_1',
            'city',
            'area',
            'postcode',
            'country',
            'label',
            'default_billing',
            'default_shipping'
        ]

        widgets = {
            'email': forms.EmailInput,
            'address_1': forms.Textarea(attrs={'rows': 4}),
            'default_billing': forms.CheckboxInput,
            'default_shipping': forms.CheckboxInput(),

        }

        labels = {
            'address_1': 'address',
            'label': 'Address Nickname'
        }

class CustomerForm(forms.ModelForm):
    class Meta:
        model = OcCustomer
        fields = '__all__'

        widgets = {
            'notes': forms.Textarea(attrs={'rows': 4}),
        }

        labels = {
            'notes': 'Comments and Notes',
        }


class CustomerDocumentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(CustomerDocumentForm, self).__init__(*args, **kwargs)
        self.fields['type'].empty_label = None

    class Meta:
        model = OcTsgContactDocuments
        fields = '__all__'

    widgets = {
        'contact': forms.Select(attrs={"hidden": True}),
    }