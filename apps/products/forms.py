from django import forms
from apps.products.models import OcProduct, OcProductDescriptionBase, OcProductToStore, \
    OcProductToCategory, OcTsgProductVariantCore, OcTsgProductVariants, OcStoreProductImages, OcProductImage

from apps.options.models import OcTsgProductVariantCoreOptions, OcTsgProductVariantOptions

from tinymce.widgets import TinyMCE
from django_svg_image_form_field import SvgAndImageFormField


class ProductForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        self.fields['tax_class'].empty_label = None
        self.fields['supplier'].empty_label = None
        self.fields['bulk_group'].empty_label = None

    class Meta:
        model = OcProduct

        fields = ['product_id', 'supplier', 'status', 'mib_logo', 'tax_class', 'bulk_group', 'image']

        labels = {
            'mib_logo': 'Made in Britain',
            'status': 'Product is visable',
        }

        field_classes = {
            'image': SvgAndImageFormField,
        }


class ProductDescriptionBaseForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProductDescriptionBaseForm, self).__init__(*args, **kwargs)
        self.fields['language'].empty_label = None

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


class VariantCoreOptionsOrderForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductVariantCoreOptions
        fields = '__all__'

        widgets = {
            'product_variant': forms.HiddenInput,
            'option_value': forms.HiddenInput,
            'option_class': forms.HiddenInput,
        }

        labels = {
            'order_by': 'New order position',
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
    def __init__(self, *args, **kwargs):
        super(VariantCoreEditForm, self).__init__(*args, **kwargs)
        self.fields['supplier'].empty_label = None

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
            'bl_live': 'LIVE',
        }



class SiteVariantOptionsForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductVariantOptions
        fields = '__all__'

        widgets = {
            'product_variant': forms.HiddenInput,
            'product_var_core_option': forms.HiddenInput
        }

        labels = {
            'order_by': 'New order position',
        }


class SiteProductVariantForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductVariants
        fields = '__all__'

        widgets = {
            'prod_var_core_id': forms.HiddenInput,
            'store': forms.HiddenInput,
            'digital_artwork': forms.HiddenInput,
            'digital_artwork_price': forms.HiddenInput,
            'digital_artwork_def': forms.HiddenInput,
            'isdeleted': forms.HiddenInput,
        }


class AdditionalProductStoreImages(forms.ModelForm):
    class Meta:
        model = OcStoreProductImages
        fields = '__all__'

        widgets = {
            'store_product_id': forms.HiddenInput,
            'image_id': forms.HiddenInput,
        }

        labels = {
            'order_id': 'Image order position',
            'alt_text': 'Image ALT-TEXT for this website',
        }

class AddionalProductImageForm(forms.ModelForm):
    class Meta:
        model = OcProductImage
        fields = '__all__'


class AddionalProductImageEditForm(forms.ModelForm):
    class Meta:
        model = OcProductImage
        fields = ['product_image_id', 'sort_order', 'alt_text']