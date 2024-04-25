from django.shortcuts import render
from rest_framework import viewsets
from apps.templating.models import OcTsgTemplates
from apps.templating.serializers import TemplateSerializer
from apps.templating.forms import TemplateDetailsEditForm
from apps.sites.forms import StoreEditForm
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string


class Templates(viewsets.ModelViewSet):
    queryset = OcTsgTemplates.objects.all()
    serializer_class = TemplateSerializer


def all_templates(request):
    template_name = 'templating/template_list.html'
    context = {'heading': "Templates"}
    return render(request, template_name, context)


class TemplateUpdate(UpdateView):
    model = OcTsgTemplates
    form_class = TemplateDetailsEditForm
    template_name = 'templating/template_details.html'
    success_url = reverse_lazy('alltemplates')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = super().get_object()
        breadcrumbs = []
        breadcrumbs.append({'name': 'Templates', 'url': reverse_lazy('alltemplates')})
        context['breadcrumbs'] = breadcrumbs
        context['heading'] = obj.name
        return context

