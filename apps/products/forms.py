from django import forms
from apps.products.models import OcProduct, OcProductDescriptionBase, OcProductToStore, \
    OcProductToCategory, OcTsgProductVariantCore, OcTsgProductVariants, OcStoreProductImages, OcProductImage, \
    OcTsgProductDocuments, OcProductRelated, OcTsgProductToCategory, OcTsgProductStandard

from apps.options.models import OcTsgProductVariantCoreOptions, OcTsgProductVariantOptions,  OcTsgProductOption, OcTsgProductOptionValues

from tinymce.widgets import TinyMCE
from django_svg_image_form_field import SvgAndImageFormField
from crispy_bootstrap5.bootstrap5 import FloatingField
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column


from apps.products import artwork_service
from apps.products.artwork import ArtworkError

# The new-image columns are written by the artwork upload, never by an ordinary form post.
# A form built on '__all__' would blank them every time it was saved.
ARTWORK_COLUMNS = ['image_feed', 'image_page', 'image_tile', 'artwork_drive_id',
                   'artwork_filename', 'artwork_checks', 'artwork_date']


class ArtworkUploadMixin:
    """Adds a 'print-ready PDF' upload to a product or variant form.

    The PDF is rendered and checked in clean(), so a PDF that cannot be used is turned down
    on the form and nothing is saved. save() then writes the images (and the Drive copy).
    """
    artwork_label = ''
    artwork_code = ''

    def _add_artwork_field(self):
        self.fields['artwork_pdf'] = forms.FileField(
            required=False, label='Print-ready PDF',
            help_text='Upload the print PDF and the website images are made from it: the Google '
                      'feed picture, the product page picture and the grid tile.',
            widget=forms.ClearableFileInput(attrs={'accept': 'application/pdf'}))

    def clean_artwork_pdf(self):
        upload = self.cleaned_data.get('artwork_pdf')
        self._artwork = None
        if not upload:
            return upload
        keep = bool(self.data.get('artwork_keep_colours')) if 'artwork_keep_colours' in self.fields else False
        try:
            self._artwork = artwork_service.prepare(upload.read(), filename=upload.name, keep_colours=keep)
        except ArtworkError as exc:
            raise forms.ValidationError(str(exc))
        return upload

    def save(self, commit=True):
        instance = super().save(commit=commit)
        prepared = getattr(self, '_artwork', None)
        if commit and prepared:
            artwork_service.save_prepared(instance, prepared, self.artwork_label_for(instance),
                                          self.artwork_code_for(instance))
            self.artwork_saved(instance)
        return instance

    def artwork_label_for(self, instance):
        return self.artwork_label or 'product'

    def artwork_code_for(self, instance):
        return self.artwork_code

    def artwork_saved(self, instance):
        """Hook: called after new images were written to the instance."""


class ProductForm(ArtworkUploadMixin, forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        self._add_artwork_field()
        self.fields['tax_class'].empty_label = None
        self.fields['supplier'].empty_label = None
        self.fields['bulk_group'].empty_label = None
        self.fields['template'].empty_label = None
        self.fields['bespoke_template'].empty_label = None
        self.fields['default_order_status'].empty_label = None

    def artwork_label_for(self, instance):
        base = getattr(instance, 'productdescbase', None)
        return (base.title if base and base.title else 'product')

    def artwork_code_for(self, instance):
        return str(instance.pk)

    class Meta:
        model = OcProduct

        fields = ['product_id', 'supplier', 'status', 'mib_logo', 'tax_class', 'bulk_group', 'image', 'template', 'bespoke_template', 'is_bespoke', 'exclude_bespoke', 'default_order_status']

        labels = {
            'mib_logo': 'Made in Britain',
            'status': 'Product is visable',
            'is_bespoke': 'This IS a bespoke product',
            'exclude_bespoke': 'Never offer a bespoke version',
        }

        help_texts = {
            # Without this a new blank looks like an ordinary sign to the shop:
            # it is badged "I'm customisable" and does not open the designer.
            'is_bespoke': 'One of the Custom … Sign products the designer runs on, not a sign we print from stock.',
            'exclude_bespoke': 'Hides the customise wand on a stock sign, and keeps it out of the AI recreation runs.',
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
    sign_reads = forms.CharField(widget=TinyMCE(attrs={'rows': 10}), required=False)

    class Meta:
        model = OcProductDescriptionBase

        fields = '__all__'

        widgets = {
            'product': forms.HiddenInput,

        }

        labels = {
            'mib_logo': 'Made in Britain',
            'name': 'Product Title',
            'title': 'Page Title (H1)'
        }


class SiteProductDetailsForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(SiteProductDetailsForm, self).__init__(*args, **kwargs)
        self.fields['tax_class'].empty_label = None
        self.fields['bulk_group'].empty_label = None
        self.fields['image'].default = None

    description = forms.CharField(widget=TinyMCE(attrs={'rows': 10}), required=False)
    long_description = forms.CharField(widget=TinyMCE(attrs={'rows': 20}), required=False)
    #sign_reads = forms.CharField(widget=TinyMCE(attrs={'rows': 10}), required=False)

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

        field_classes = {
            'image': SvgAndImageFormField,
        }


class ProductCategoryForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductToCategory
        fields = '__all__'

        labels = {
            'status': 'Product is visible',
        }

        widgets = {
            'product': forms.HiddenInput,
            'category': forms.HiddenInput,
            'status': forms.CheckboxInput,

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


class VariantCoreForm(ArtworkUploadMixin, forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(VariantCoreForm, self).__init__(*args, **kwargs)
        self._add_artwork_field()
        self.fields['supplier'].empty_label = None

    apply_same_shape = forms.BooleanField(
        required=False, initial=True, label='Also use for this product\'s other variants of the same shape',
        help_text='For example 150x200 and 450x600 are the same shape. Variants that already have new '
                  'images, and photoluminescent ones, are left alone.')

    def artwork_saved(self, instance):
        self.shared_with = 0
        if self.cleaned_data.get('apply_same_shape') and instance.product_id:
            self.shared_with = artwork_service.share_with_same_shape(instance)

    def artwork_label_for(self, instance):
        base = getattr(instance.product, 'productdescbase', None) if instance.product_id else None
        return (base.title if base and base.title else 'variant')

    def artwork_code_for(self, instance):
        return instance.supplier_code or str(instance.pk)


    class Meta:
        model = OcTsgProductVariantCore
        fields = '__all__'
        exclude = ARTWORK_COLUMNS

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
            'cos_details': 'COS Details',
            'artwork_keep_colours': 'Keep the PDF\'s own colours (photoluminescent)',
        }

        field_classes = {
            'variant_image': SvgAndImageFormField,
        }



class VariantCoreEditForm(ArtworkUploadMixin, forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(VariantCoreEditForm, self).__init__(*args, **kwargs)
        self._add_artwork_field()
        self.fields['supplier'].empty_label = None

    apply_same_shape = forms.BooleanField(
        required=False, initial=True, label='Also use for this product\'s other variants of the same shape',
        help_text='For example 150x200 and 450x600 are the same shape. Variants that already have new '
                  'images, and photoluminescent ones, are left alone.')

    def artwork_saved(self, instance):
        self.shared_with = 0
        if self.cleaned_data.get('apply_same_shape') and instance.product_id:
            self.shared_with = artwork_service.share_with_same_shape(instance)

    def artwork_label_for(self, instance):
        base = getattr(instance.product, 'productdescbase', None) if instance.product_id else None
        return (base.title if base and base.title else 'variant')

    def artwork_code_for(self, instance):
        return instance.supplier_code or str(instance.pk)


    class Meta:
        model = OcTsgProductVariantCore
        fields = '__all__'
        exclude = ARTWORK_COLUMNS

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
            'cos_details': 'COS Details',
            'artwork_keep_colours': 'Keep the PDF\'s own colours (photoluminescent)',
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

        field_classes = {
            'alt_image': SvgAndImageFormField,
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

class AdditionalProductImageForm(forms.ModelForm):
    class Meta:
        model = OcProductImage
        fields = '__all__'

        field_classes = {
            'image': SvgAndImageFormField,
        }


class AddionalProductImageEditForm(forms.ModelForm):
    class Meta:
        model = OcProductImage
        fields = ['product_image_id', 'sort_order', 'alt_text']


class ProductDocumentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(ProductDocumentForm, self).__init__(*args, **kwargs)
        self.fields['type'].empty_label = None


    class Meta:
        model = OcTsgProductDocuments
        fields = '__all__'

    widgets = {
        'product': forms.Select(attrs={"hidden": True}),
    }

class RelatedEditForm(forms.ModelForm):

    class Meta:
        model = OcProductRelated
        fields = '__all__'


class ProductOptionEditForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(ProductOptionEditForm, self).__init__(*args, **kwargs)
        self.fields['option_type'].empty_label = None
    class Meta:
        model = OcTsgProductOption
        fields = '__all__'


class ProductOptionSortEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgProductOptionValues
        fields = ['sort_order']


class OcTsgProductStandardForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductStandard
        fields = '__all__'