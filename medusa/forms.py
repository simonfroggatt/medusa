from django import forms
from .models import OcTsgComplianceStandards

class OcTsgComplianceStandardsForm(forms.ModelForm):
    class Meta:
        model = OcTsgComplianceStandards
        fields = '__all__' 