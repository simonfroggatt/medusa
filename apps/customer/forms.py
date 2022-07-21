from django import forms
from .models import OcAddress, OcCustomer



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
            'default_shipping': forms.CheckboxInput()
        }

