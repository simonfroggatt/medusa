from django import forms
from .models import OcTsgProductSizes, OcTsgOrientation, OcTsgProductMaterial
from bootstrap_modal_forms.forms import BSModalModelForm
from django.conf import settings
from tinymce.widgets import TinyMCE


class SizesBSForm(BSModalModelForm):
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
    material_desc = forms.CharField(widget=TinyMCE(attrs={'rows': 2}))
    material_desc_full = forms.CharField(widget=TinyMCE(attrs={'rows': 5}), required=False)

    def get_material_image_url(self, material):
        return f"{settings.MEDIA_URL}{material.image}"

    class Meta:
        model = OcTsgProductMaterial
        fields = ['material_id','material_name', 'code', 'material_desc',  'material_desc_full', 'image',
                  'mounting_desc_full', 'mounting_desc', 'thickness_desc', 'thickness_desc_full', 'fixing_desc', 'fixing_desc_full',
                  'colour_desc', 'colour_desc_full']

