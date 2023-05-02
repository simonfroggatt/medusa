from django import forms
from apps.symbols.models import OcTsgSymbols
from django.conf import settings
from tinymce.widgets import TinyMCE

class SymbolsForm(forms.ModelForm):
    humanbehav = forms.CharField(widget=TinyMCE(attrs={'rows': 2}), required=False, label='Human Behaviour')

    def get_symbol_image_url(self, symbol):
        return f"{settings.MEDIA_URL}{symbol.image_path}"

    class Meta:
        model = OcTsgSymbols
        fields = '__all__'

