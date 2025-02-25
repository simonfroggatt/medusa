from django import forms
from apps.pages.models import OcTsgBlogs, OcInformationDescription
from tinymce.widgets import TinyMCE
from django_svg_image_form_field import SvgAndImageFormField


class BlogDetailsEditForm(forms.ModelForm):
    blog_text = forms.CharField(widget=TinyMCE(attrs={'rows': 30}))

    class Meta:
        model = OcTsgBlogs

        fields = '__all__'

        labels = {
            'slug': 'Pretty URL',
            'date_available': 'Goes live',
            'blog_text': 'Article',
            'status': 'Article Approved',
        }

        widgets = {
            #'blog_text': TinyMCE(attrs={'rows': 20}),
            'status': forms.CheckboxInput,

        }

        field_classes = {
            'image': SvgAndImageFormField,
        }


class InformationDetailsEditForm(forms.ModelForm):
    description = forms.CharField(widget=TinyMCE(attrs={'rows': 30}))

    class Meta:
        model = OcInformationDescription

        fields = '__all__'

        labels = {
            'status': 'Information Live',
            'bottom': 'Show in footer',
        }
