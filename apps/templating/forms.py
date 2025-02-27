from django import forms
from apps.templating.models import OcTsgTemplates
from tinymce.widgets import TinyMCE


class TemplateDetailsEditForm(forms.ModelForm):
   # main = forms.CharField(widget=TinyMCE(attrs={'rows': 30}))
    def __init__(self, *args, **kwargs):
        super(TemplateDetailsEditForm, self).__init__(*args, **kwargs)
        self.fields['template_type'].empty_label = None
        self.fields['store'].empty_label = None

    class Meta:
        model = OcTsgTemplates

        fields = '__all__'

        labels = {

        }

        widgets = {
            'status': forms.CheckboxInput,
            'main': forms.Textarea,
        }
