from django import forms
from apps.products.models import OcProduct, OcProductDescriptionBase, OcProductDescription, OcProductToStore, \
    OcProductToCategory, OcTsgProductVariantCore

from apps.options.models import OcTsgProductVariantCoreOptions

from tinymce.widgets import TinyMCE


class ProductForm(forms.ModelForm):

    class Meta:
        model = OcProduct

        fields = ['product_id', 'supplier', 'status', 'mib_logo', 'tax_class']

        labels = {
            'mib_logo': 'Made in Britain',
            'status': 'Product is visable',
        }


class ProductDescriptionBaseForm(forms.ModelForm):
    description = forms.CharField(widget=TinyMCE(attrs={'rows': 10}))
    long_description = forms.CharField(widget=TinyMCE(attrs={'rows': 20}))
    sign_reads = forms.CharField(widget=TinyMCE(attrs={'rows': 10}))

    class Meta:
        model = OcProductDescriptionBase

        fields = '__all__'

        widgets = {
            'product': forms.HiddenInput,

        }

        labels = {
            'mib_logo': 'Made in Britain',
        }


class SiteProductDetailsForm(forms.ModelForm):
    description = forms.CharField(widget=TinyMCE(attrs={'rows': 10}), required=False)
    long_description = forms.CharField(widget=TinyMCE(attrs={'rows': 20}), required=False)
    sign_reads = forms.CharField(widget=TinyMCE(attrs={'rows': 10}), required=False)

    class Meta:
        model = OcProductToStore

        fields = '__all__'

        labels = {
            'status': 'Product is visible',
        }

        widgets = {
            'product': forms.HiddenInput,
            'store': forms.HiddenInput,

        }


class ProductCategoryForm(forms.ModelForm):
    class Meta:
        model = OcProductToCategory
        fields = '__all__'

        labels = {
            'status': 'Product is visible',
        }

        widgets = {
            'product': forms.HiddenInput,
            'category_store': forms.HiddenInput,

        }


class VariantCoreOptionsForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductVariantCoreOptions
        fields = '__all__'

        widgets = {
            'product_variant': forms.HiddenInput
        }


class VariantCoreForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductVariantCore
        fields = '__all__'

        widgets = {
            'product': forms.HiddenInput,
            'prod_variant_core_id': forms.HiddenInput,
            'size_material': forms.HiddenInput,

        }

        labels = {
            'exclude_fpnp': 'Exclude from Free Shipping',
            'shipping_cost': 'Cost for this Shipping',
            'gtin': 'GTIN',
            'bl_live': 'LIVE',
        }

class VariantCoreEditForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductVariantCore
        fields = '__all__'

        widgets = {
            'product': forms.HiddenInput,
            'prod_variant_core_id': forms.HiddenInput,
            'size_material': forms.HiddenInput,

        }

        labels = {
            'exclude_fpnp': 'Exclude from Free Shipping',
            'shipping_cost': 'Cost for this Shipping',
            'gtin': 'GTIN ',
        }


