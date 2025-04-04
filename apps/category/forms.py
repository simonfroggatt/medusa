from django import forms
from apps.category.models import OcCategory, OcCategoryDescription, OcCategoryDescriptionBase, OcCategoryToStore, OcTsgCategoryStoreParent
from tinymce.widgets import TinyMCE
from django_svg_image_form_field import SvgAndImageFormField
from django.conf import settings


class CategoryEditForm(forms.ModelForm):
    blog_text = forms.CharField(widget=TinyMCE(attrs={'rows': 30}))

    class Meta:
        model = OcCategory

        fields = '__all__'

        labels = {

        }

        widgets = {

        }

class CategoryBaseDescriptionForm(forms.ModelForm):

    description = forms.CharField(widget=TinyMCE(attrs={'rows': 30}))

    class Meta:
        model = OcCategoryDescriptionBase

        fields = '__all__'

        widgets = {
            'category': forms.HiddenInput()
        }


class CategoryStoreDescriptionForm(forms.ModelForm):

    description = forms.CharField(widget=TinyMCE(attrs={'rows': 30}), required=False)

    class Meta:
        model = OcCategoryDescription

        fields = '__all__'

        widgets = {
            'store': forms.HiddenInput(),
            'category': forms.HiddenInput()
        }


class CategoryStoreForm(forms.ModelForm):

    description = forms.CharField(widget=TinyMCE(attrs={'rows': 30}), required=False)

    class Meta:
        model = OcCategoryToStore

        fields = '__all__'

        widgets = {
            'store': forms.HiddenInput(),
            'id': forms.HiddenInput(),
            'category': forms.HiddenInput()
        }


class CategoryStoreParentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(CategoryStoreParentForm, self).__init__(*args, **kwargs)
        #self.fields['parent'].empty_label = None

    class Meta:
        model = OcTsgCategoryStoreParent
        fields = '__all__'

        widgets = {
            'category_store': forms.HiddenInput(),
        }

        labels = {
            'status': 'live'
        }

        field_classes = {
            'image': SvgAndImageFormField,
        }






