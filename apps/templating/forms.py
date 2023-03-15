from django import forms
from apps.templating.models import OcTsgTemplates
from tinymce.widgets import TinyMCE


class TemplateDetailsEditForm(forms.ModelForm):
   # main = forms.CharField(widget=TinyMCE(attrs={'rows': 30}))

    class Meta:
        model = OcTsgTemplates

        fields = '__all__'

        labels = {

        }

        widgets = {
            'status': forms.CheckboxInput,
            'header': forms.Textarea,
            'main': forms.Textarea,
            'description': forms.Textarea,
        }
