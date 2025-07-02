from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views import View
from rest_framework.generics import ListAPIView
from .models import OcTsgComplianceStandards
from .serializers import OcTsgComplianceStandardsSerializer
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from .forms import OcTsgComplianceStandardsForm


class StarterPageView(View):
    def get(self, request):
        greeting = {}
        greeting['heading'] = "Starter Page"
        greeting['pageview'] = "Pages"
        return render(request, 'pages-starter.html',greeting)


class ComplianceStandardsListAPIView(ListAPIView):
    queryset = OcTsgComplianceStandards.objects.all()
    serializer_class = OcTsgComplianceStandardsSerializer

def compliance_standards_list(request):
    context = {'heading': 'Compliance Standards'}
    return render(request, 'medusa/compliance_standards_list.html', context)

class ComplianceStandardsCreateView(CreateView):
    model = OcTsgComplianceStandards
    form_class = OcTsgComplianceStandardsForm
    template_name = 'medusa/compliance_standards_form.html'
    success_url = reverse_lazy('compliance-standards-list')

class ComplianceStandardsUpdateView(UpdateView):
    model = OcTsgComplianceStandards
    form_class = OcTsgComplianceStandardsForm
    template_name = 'medusa/compliance_standards_form.html'
    success_url = reverse_lazy('compliance-standards-list')

class ComplianceStandardsDeleteView(DeleteView):
    model = OcTsgComplianceStandards
    template_name = 'medusa/compliance_standards_confirm_delete.html'
    success_url = reverse_lazy('compliance-standards-list')

