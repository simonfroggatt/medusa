from django import forms
from .models import OcTsgQuote, OcTsgQuoteProduct
from apps.sites.models import OcStore

class QuoteDetailsEditForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteDetailsEditForm, self).__init__(*args, **kwargs)
        self.fields['store'].empty_label = None
        self.fields['store'].queryset = OcStore.objects.filter(store_id__gt=0)


    class Meta:
        model = OcTsgQuote

        fields = ['fullname', 'email', 'telephone', 'store',
                  'days_valid', 'quote_ref', 'company', 'shipping_type',
                  'shipping_rate', 'tax_rate', 'comment', 'sent']

        labels = {
            'fullname': 'Full Name',
        }


        widgets = {
            'comment': forms.Textarea(attrs={'rows': 2}),
            'sent': forms.CheckboxInput
        }


class ProductAddForm(forms.ModelForm):

    class Meta:
        model = OcTsgQuoteProduct
        fields = [
            'name',
            'model',
            'quantity',
            'price',
            'total',
            'tax',
            'size_name',
            'width',
            'height',
            'material_name',
            'orientation_name',
            'is_bespoke',
            'product_id',
            'product_variant',
            'quote',
            'exclude_discount',
            'bulk_discount',
            'bulk_used',
            'single_unit_price',
            'base_unit_price',
            'line_discount'
        ]

        labels = {
            #"model": "Nome da Key",
            'size_name' : "Size",
            'material_name': "Material"
        }

        widgets = {
            'is_bespoke': forms.CheckboxInput(),
            'exclude_discount': forms.CheckboxInput(),
         }


class ProductEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgQuoteProduct
        fields = [
            'name',
            'model',
            'quantity',
            'price',
            'total',
            'tax',
            'size_name',
            'width',
            'height',
            'material_name',
            'orientation_name',
            'is_bespoke',
            'exclude_discount',
            'bulk_discount',
            'bulk_used',
            'single_unit_price',
            'base_unit_price'
        ]

        labels = {
            #"model": "Nome da Key",
            'size_name' : "Size",
            'material_name': "Material",
            'is_bespoke': "Bespoke"
        }

        widgets = {
            'is_bespoke': forms.CheckboxInput(),
            'exclude_discount': forms.CheckboxInput(),
         }


class QuoteTextForm(forms.ModelForm):

    class Meta:
        model = OcTsgQuoteProduct
        fields = '__all__'


class QuoteBillingForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteBillingForm, self).__init__(*args, **kwargs)
        self.fields['payment_country'].empty_label = None

    class Meta:
        model = OcTsgQuote
        fields = [
            'payment_fullname',
            'payment_email',
            'payment_telephone',
            'payment_company',
            'payment_address',
            'payment_city',
            'payment_area',
            'payment_country',
            'payment_postcode',
        ]

        labels = {
            'payment_fullname': 'Contact Name',
            'payment_email': 'Email',
            'payment_telephone': 'Telephone',
            'payment_company': 'Company',
            'payment_address': 'Address',
            'payment_city': 'City',
            'payment_area': 'Area',
            'payment_postcode': 'Postcode',
            'payment_country': 'Country',

        }

        widgets = {
            'payment_email': forms.EmailInput,
            'payment_address': forms.Textarea(attrs={'rows': 4}),
        }


class QuoteShippingForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteShippingForm, self).__init__(*args, **kwargs)
        self.fields['shipping_country'].empty_label = None

    class Meta:
        model = OcTsgQuote
        fields = [
            'shipping_fullname',
            'shipping_email',
            'shipping_telephone',
            'shipping_company',
            'shipping_address',
            'shipping_city',
            'shipping_area',
            'shipping_country',
            'shipping_postcode'
        ]

        labels = {
            'shipping_fullname': 'Contact Name',
            'shipping_email': 'Email',
            'shipping_telephone': 'Telephone',
            'shipping_company': 'Company',
            'shipping_address': 'Address',
            'shipping_city': 'City',
            'shipping_area': 'Area',
            'shipping_postcode': 'Postcode',
            'shipping_country': 'Country',

        }

        widgets = {
            'shipping_email': forms.EmailInput,
            'shipping_address': forms.Textarea(attrs={'rows': 4}),
        }
