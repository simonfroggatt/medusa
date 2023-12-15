from django import forms
from apps.options.models import OcTsgOptionClass, OcTsgOptionValues, OcTsgOptionTypes, OcTsgOptionClassGroups, \
    OcTsgOptionClassGroupValues, OcTsgOptionClassValues
from apps.products.models import OcProduct

class ClassEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgOptionClass

        fields = '__all__'

        labels = {
            'descr': 'Description',
            'name' : 'Name - used internally for reference'
        }

        widgets = {
            #'blog_text': TinyMCE(attrs={'rows': 20}),
            #'status': forms.CheckboxInput,
        }

class ValueEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgOptionValues

        fields = '__all__'

        labels = {
            'descr': 'Description',
            'internal_descr' : 'Internal Decription - used internally for reference'
        }

        widgets = {
            'product_id' : forms.HiddenInput
        }


class TypesEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgOptionTypes

        fields = '__all__'

        labels = {
            'descr': 'Description',
        }


class GroupEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgOptionClassGroups

        fields = '__all__'


class GroupValueEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgOptionClassGroupValues

        fields = '__all__'

        widgets = {
            'group': forms.HiddenInput
        }


class ClassValuesOrderForm(forms.ModelForm):

    class Meta:
        model = OcTsgOptionClassValues

        fields = '__all__'
        widgets = {
            'id': forms.HiddenInput,
            'option_class': forms.HiddenInput,
            'option_value': forms.HiddenInput,
        }









