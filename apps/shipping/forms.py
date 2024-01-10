from django import forms
from .models import OcTsgShippingMethod, OcTsgShippingMethodTypes, OcTsgCourier, OcTsgCourierOptions

class CourierEditForm(forms.ModelForm):

    #def __init__(self, *args, **kwargs):
    #    super(ProductEditForm, self).__init__(*args, **kwargs)
     #   self.fields['status'].empty_label = None

    class Meta:
        model = OcTsgCourier
        fields = '__all__'

        labels = {
            #"model": "Nome da Key",
        }

        widgets = {
            #'is_bespoke': forms.CheckboxInput(),
         }


class MethodsEditForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(MethodsEditForm, self).__init__(*args, **kwargs)
        self.fields['iso'].empty_label = None
        self.fields['store'].empty_label = None
        #self.fields['tax_class_id'].empty_label = None
        self.fields['method_type'].empty_label = None

    class Meta:
        model = OcTsgShippingMethod
        fields = '__all__'

        labels = {
            "iso": "Country",
            "status": "Available",
        }

        widgets = {
            'status': forms.CheckboxInput(),
            'description': forms.Textarea(attrs={'rows': 5}),
         }


class CourierOptionEditForm(forms.ModelForm):

    class Meta:
        model = OcTsgCourierOptions
        fields = '__all__'


