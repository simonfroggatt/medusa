from django import forms
from apps.products.models import OcTsgSymbols
from django.conf import settings
from tinymce.widgets import TinyMCE

class SymbolsForm(forms.ModelForm):
    humanbehav = forms.CharField(widget=TinyMCE(attrs={'rows': 2}))

    def get_symbol_image_url(self, symbol):
        return f"{settings.MEDIA_URL}{symbol.image_path}"

    class Meta:
        model = OcTsgSymbols
        fields = ['refenceno','referent', 'function', 'content',  'hazard', 'humanbehav',
                  'svg_path', 'category', 'standard', 'title', 'image_path' ]