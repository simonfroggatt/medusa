from django import forms
from .models import OcTsgProductSizes, OcTsgOrientation, OcTsgProductMaterial, OcTsgSizeMaterialComb, \
    OcTsgSizeMaterialCombPrices, OcTsgMaterialSpec
from bootstrap_modal_forms.forms import BSModalModelForm
from django.conf import settings
from tinymce.widgets import TinyMCE


class SizesForm(forms.ModelForm):
    class Meta:
        model = OcTsgProductSizes
        fields = ['size_id', 'size_code', 'size_name', 'size_width', 'size_height', 'size_units', 'orientation']


class MaterialsBSForm(BSModalModelForm):

   # image_path = forms.ImageField()
    material_desc = forms.CharField(widget=TinyMCE(attrs={'rows': 20}))


    def get_material_image_url(self, material):
        return f"{settings.MEDIA_URL}{material.image}"

    class Meta:
        model = OcTsgProductMaterial
        fields = ['material_id','material_name', 'code', 'material_desc',  'material_desc_full', 'image',
                  'mounting_desc_full', 'mounting_desc', 'thickness_desc', 'thickness_desc_full', 'fixing_desc', 'fixing_desc_full',
                  'colour_desc', 'colour_desc_full']
        #fields = "__all__"


class MaterialForm(forms.ModelForm):
    material_desc = forms.CharField(widget=TinyMCE(attrs={'rows': 2}), required=True)
    material_desc_full = forms.CharField(widget=TinyMCE(attrs={'rows': 5}), required=False)

    def get_material_image_url(self, material):
        return f"{settings.MEDIA_URL}{material.image}"

    class Meta:
        model = OcTsgProductMaterial
        fields = ['material_id','material_name', 'code', 'material_desc',  'material_desc_full', 'image',
                  'mounting_desc_full', 'mounting_desc', 'thickness_desc', 'thickness_desc_full', 'fixing_desc', 'fixing_desc_full',
                  'colour_desc', 'colour_desc_full']


class SizeMaterialCombo(forms.ModelForm):

    class Meta:
        model = OcTsgSizeMaterialComb
        fields = '__all__'
        depth = 2


class StorePriceComboForm(forms.ModelForm):

    class Meta:
        model = OcTsgSizeMaterialCombPrices
        fields = '__all__'

    widgets = {
        'size_material_comb': forms.Select(attrs={"hidden":True}),
        'store_id': forms.HiddenInput,
    }


class MaterialSpecForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(MaterialSpecForm, self).__init__(*args, **kwargs)

    class Meta:
        model = OcTsgMaterialSpec
        fields = '__all__'

    widgets = {
        'material': forms.Select(attrs={"hidden": True}),
    }