from django import forms
from apps.symbols.models import OcTsgSymbols, OcTsgSymbolStandard, OcTsgSymbolShape, OcTsgSymbolPurposes, OcTsgSymbolCategory
from django.conf import settings
from tinymce.widgets import TinyMCE
from django_svg_image_form_field import SvgAndImageFormField

class SymbolsForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(SymbolsForm, self).__init__(*args, **kwargs)
        self.fields['shape'].empty_label = None
        #self.fields['standard'].empty_label = None


    def get_symbol_image_url(self, symbol):
        return f"{settings.MEDIA_URL}{symbol.image_path}"

    class Meta:
        model = OcTsgSymbols
        fields = '__all__'
        field_classes = {
            'svg_path': SvgAndImageFormField,
        }

        labels = {
            'referent': 'Description',
        }

class OcTsgSymbolStandardForm(forms.ModelForm):
    class Meta:
        model = OcTsgSymbolStandard
        fields = '__all__'




class SymbolShapeForm(forms.ModelForm):
    class Meta:
        model = OcTsgSymbolShape
        fields = '__all__'



class SymbolPurposeForm(forms.ModelForm):
    class Meta:
        model = OcTsgSymbolPurposes
        fields = '__all__'

class SymbolCategoryForm(forms.ModelForm):
    class Meta:
        model = OcTsgSymbolCategory
        fields = '__all__'