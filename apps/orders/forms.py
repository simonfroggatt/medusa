from django import forms
from .models import OcOrderProduct, OcOrder, OcOrderTotal, OcTsgOrderShipment, OcTsgOrderDocuments
from medusa.models import OcTsgOrderProductStatus
from apps.shipping.models import OcTsgShippingMethod
from apps.sites.models import OcStore
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Field

class ProductEditForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(ProductEditForm, self).__init__(*args, **kwargs)
        self.fields['status'].empty_label = None
        self.fields['supplier'].empty_label = None

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
            'width',
            'height',
            'material_name',
            'orientation_name',
            'is_bespoke',
            'exclude_discount',
            'bulk_discount',
            'bulk_used',
            'single_unit_price',
            'base_unit_price',
            'supplier',
            'supplier_code'
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
            'width',
            'height',
            'material_name',
            'orientation_name',
            'is_bespoke',
            'product_id',
            'product_variant',
            'order',
            'status',
            'exclude_discount',
            'bulk_discount',
            'bulk_used',
            'single_unit_price',
            'base_unit_price',
            'supplier',
            'supplier_code'
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
    def __init__(self, *args, **kwargs):
        super(OrderDetailsEditForm, self).__init__(*args, **kwargs)
        self.fields['order_status'].empty_label = None
        self.fields['payment_status'].empty_label = None
        self.fields['payment_method'].empty_label = None
        self.fields['order_type'].empty_label = None
        self.fields['store'].empty_label = None
        self.fields['store'].queryset = OcStore.objects.filter(store_id__gt=0)

    class Meta:
        model = OcOrder

        fields = ['order_id',
                  'order_status',
                  'payment_status',
                  'order_type',
                  'customer_order_ref',
                  'payment_method',
                  'comment',
                  'printed',
                  'store',
                  'plain_label',

                  ]

        labels = {
            'payment_method': 'Payment Method',
            'order_type': 'Order Source',

        }


        widgets = {
            'comment': forms.Textarea(attrs={'rows': 2}),
            'printed': forms.CheckboxInput,
            'plain_label': forms.CheckboxInput,
        }


class OrderTaxChangeForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(OrderTaxChangeForm, self).__init__(*args, **kwargs)
        self.fields['tax_rate'].empty_label = None

    class Meta:
        model = OcOrder
        fields = ['tax_rate']


class OrderShippingChoiceEditForm(forms.ModelForm):

    class Meta:
        model = OcOrderTotal

        fields = ['order',
                  'code',
                  'title',
                  'value'
                  ]


class ShippingMethodForms(forms.ModelForm):

    class Meta:
        model = OcTsgShippingMethod

        fields = ['shipping_method_id']


class OrderShipItForm(forms.ModelForm):

    class Meta:
        model = OcTsgOrderShipment
        fields = '__all__'


class OrderDiscountForm(forms.ModelForm):

    class Meta:
        model = OcOrderTotal

        fields = ['order',
                  'code',
                  'title',
                  'value'
                  ]


class OrderDocumentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(OrderDocumentForm, self).__init__(*args, **kwargs)
        self.fields['type'].empty_label = None
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Field('type', css_class='custom-class'),
        )

    class Meta:
        model = OcTsgOrderDocuments
        fields = '__all__'

    widgets = {
        'order': forms.Select(attrs={"hidden": True}),
    }
