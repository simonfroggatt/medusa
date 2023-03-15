from django import forms
from apps.category.models import OcCategory, OcCategoryDescription, OcCategoryDescriptionBase
from tinymce.widgets import TinyMCE


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


class CategoryStoreDescriptionForm(forms.ModelForm):

    description = forms.CharField(widget=TinyMCE(attrs={'rows': 30}), required=False)

    class Meta:
        model = OcCategoryDescription

        fields = '__all__'

        widgets = {
            'store': forms.HiddenInput(),
            'category': forms.HiddenInput()
        }



