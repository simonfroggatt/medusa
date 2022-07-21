from django import forms
from .models import OcOrderProduct, OcTsgOrderProductStatus, OcOrder


class ProductEditForm(forms.ModelForm):

    class Meta:
        model = OcOrderProduct
        fields = [
            'name',
            'model',
            'quantity',
            'price',
            'total',
            'tax',
            'status',
            'size_name',
            'material_name',
            'orientation_name',
            'is_bespoke',
        ]

        labels = {
            #"model": "Nome da Key",
            'size_name' : "Size",
            'material_name': "Material"
        }

        widgets = {
            'is_bespoke': forms.CheckboxInput(),
         }


class ProductAddForm(forms.ModelForm):

    class Meta:
        model = OcOrderProduct
        fields = [
            'name',
            'model',
            'quantity',
            'price',
            'total',
            'tax',
            'status',
            'size_name',
            'material_name',
            'orientation_name',
            'is_bespoke',
            'product_id',
            'product_variant',
            'order',
            'status',
        ]

        labels = {
            #"model": "Nome da Key",
            'size_name' : "Size",
            'material_name': "Material"
        }

        widgets = {
            'is_bespoke': forms.CheckboxInput(),
         }


class OrderBillingForm(forms.ModelForm):

    class Meta:
        model = OcOrder
        fields = [
            'payment_fullname',
            'payment_email',
            'payment_telephone',
            'payment_company',
            'payment_address_1',
            'payment_city',
            'payment_area',
            'payment_country',
            'payment_country_name',
            'payment_postcode',
        ]

        labels = {
            'payment_fullname': 'Contact Name',
            'payment_email': 'Email',
            'payment_telephone': 'Telephone',
            'payment_company': 'Company',
            'payment_address_1': 'Address',
            'payment_city': 'City',
            'payment_area': 'Area',
            'payment_postcode': 'Postcode',
            'payment_country_name': 'Country',

        }

        widgets = {
            'payment_email': forms.EmailInput,
            'payment_address_1': forms.Textarea(attrs={'rows': 4}),
        }


class OrderShippingForm(forms.ModelForm):

    class Meta:
        model = OcOrder
        fields = [
            'shipping_fullname',
            'shipping_email',
            'shipping_telephone',
            'shipping_company',
            'shipping_address_1',
            'shipping_city',
            'shipping_area',
            'shipping_country',
            'shipping_country_name',
            'shipping_postcode'
        ]

        labels = {
            'shipping_fullname': 'Contact Name',
            'shipping_email': 'Email',
            'shipping_telephone': 'Telephone',
            'shipping_company': 'Company',
            'shipping_address_1': 'Address',
            'shipping_city': 'City',
            'shipping_area': 'Area',
            'shipping_postcode': 'Postcode',
            'shipping_country_name': 'Country',

        }

        widgets = {
            'shipping_email': forms.EmailInput,
            'shipping_address_1': forms.Textarea(attrs={'rows': 4}),
        }


class OrderDetailsEditForm(forms.ModelForm):

    class Meta:
        model = OcOrder

        fields = ['order_id',
                  'order_status',
                  'payment_status',
                  'payment_type',
                  'customer_order_ref',
                  'payment_method',
                  'comment'
                  ]

        widgets = {
            'comment': forms.Textarea(attrs={'rows': 2}),
        }
