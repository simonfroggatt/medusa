from django import forms
from apps.symbols.models import OcTsgSymbols
from django.conf import settings
from tinymce.widgets import TinyMCE
from django_svg_image_form_field import SvgAndImageFormField

class SymbolsForm(forms.ModelForm):
    humanbehav = forms.CharField(widget=TinyMCE(attrs={'rows': 2}), required=False, label='Human Behaviour')

    def __init__(self, *args, **kwargs):
        super(SymbolsForm, self).__init__(*args, **kwargs)
        self.fields['category'].empty_label = None
        self.fields['standard'].empty_label = None


    def get_symbol_image_url(self, symbol):
        return f"{settings.MEDIA_URL}{symbol.image_path}"

    class Meta:
        model = OcTsgSymbols
        fields = '__all__'
        field_classes = {
            'svg_path': SvgAndImageFormField,
        }

