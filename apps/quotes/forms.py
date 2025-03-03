from django import forms
from .models import OcTsgQuote, OcTsgQuoteProduct

class QuoteDetailsEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgQuote

        fields = ['quote_id',
                  'quote_ref',
                  'company',
                  'fullname',
                  'email',
                  'telephone',
                  'quote_address',
                  'quote_city',
                  'quote_area',
                  'quote_postcode',
                  'quote_country',
                  'days_valid',
                  'comment',
                  'sent',
                  'store',
                  'shipping_type',
                  'shipping_rate',
                  'currency',
                  'tax_rate',
                  ]

        labels = {
            'fullname': 'Full Name',
        }


        widgets = {
            'quote_address': forms.Textarea(attrs={'rows': 3}),
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

