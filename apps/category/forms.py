from django import forms
from apps.category import bespoke_offer
from apps.category.models import OcCategory, OcCategoryDescription, OcCategoryDescriptionBase, OcCategoryToStore, OcTsgCategoryStoreParent, OcTsgCategory, OcTsgCategoryParent
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

class CategoryDescriptionForm(forms.ModelForm):
    bespoke_symbol_id = forms.TypedChoiceField(
        label='Make-your-own symbol', required=False, coerce=int, empty_value=None,
        widget=forms.Select(attrs={'class': 'form-select form-select-sm', 'size': 6}),
        help_text='Shows a "make your own" card on this category\'s page that opens the designer with this symbol. '
                  'Which designer follows from the symbol\'s type. Leave empty for no card.')
    bespoke_template_id = forms.TypedChoiceField(
        label='Make-your-own designer', required=False, coerce=int, empty_value=None,
        help_text='For designers that are not about a symbol (fire action notice, site board, bilingual, text only). '
                  'Leave empty to use the symbol\'s designer.')

    def __init__(self, *args, **kwargs):
        super(CategoryDescriptionForm, self).__init__(*args, **kwargs)
        self.fields['store'].empty_label = None
        self.fields['google_cat'].empty_label = None
        self.fields['bespoke_symbol_id'].choices = [('', 'No symbol (no card unless a designer is chosen)')] + [
            (sid, '%s \u2014 %s' % (code, name)) for sid, code, name, _ in bespoke_offer.symbol_options()]
        self.fields['bespoke_template_id'].choices = [('', 'None')] + bespoke_offer.template_options()

    description = forms.CharField(widget=TinyMCE(attrs={'rows': 30}), required=False)

    class Meta:
        model = OcTsgCategory

        fields = '__all__'

        labels = {
            'status': 'Visible',
            'name': 'Category Title',
            'title': 'Page Title (H1)'
        }

class CategoryParentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CategoryParentForm, self).__init__(*args, **kwargs)
        #self.fields['parent'].empty_label = None

    class Meta:
        model = OcTsgCategoryParent
        fields = '__all__'

        widgets = {
            'parent': forms.HiddenInput(),
           'category': forms.HiddenInput(),
        }

        labels = {
            'status': 'Live',
        }

class CategoryEditParentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CategoryEditParentForm, self).__init__(*args, **kwargs)
        #self.fields['parent'].empty_label = None

    class Meta:
        model = OcTsgCategoryParent
        fields = '__all__'

        widgets = {
            'category': forms.HiddenInput()
        }

        labels = {
            'status': 'Live',
        }