from django.shortcuts import render
from rest_framework import viewsets
from apps.sites.models import OcStore
from apps.sites.serializers import StoreSerializer
from apps.sites.forms import StoreEditForm
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string


class Sites(viewsets.ModelViewSet):
    queryset = OcStore.objects.filter(store_id__gt=0)
    serializer_class = StoreSerializer


class SiteUpdate(UpdateView):
    model = OcStore
    form_class = StoreEditForm
    template_name = 'sites/site_details.html'
    success_url = reverse_lazy('allsites')


class SiteCreate(CreateView):
    model = OcStore
    form_class = StoreEditForm
    template_name = 'sites/site_create.html'
    success_url = reverse_lazy('allsites')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['testit'] = 'this is a test'
        return context


def site_delete_dlg(request, blog_id):
    data = dict()
    template_name = 'sites/site_delete.html'
    context = {'blog_id': blog_id}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


class SiteDelete(DeleteView):
    model = OcStore
    form_class = StoreEditForm
    success_message = 'Site deleted'
    success_url = reverse_lazy('allsites')


def site_create(request):
    template = 'sites/site_create.html'
    context = {}
    context['heading'] = "Sites"

    if request.method == 'POST':
        form = StoreEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allsites')
            return HttpResponseRedirect(success_url)

    else:
        blog_obj = OcStore
        blog_iniitials = {
            'name': 'New Site',
            'url': 'http://',
            'code': '',
            'thumb': '',
            'logo': '',
            'medusa_logo': '',
            'telephone': '',
            'company_name': '',
            'website': '',
            'vat_number': '',
            'registration_number': '',
            'footer_text': ' is a trading name of Safety Signs and Notices LTD',
            'email_address': '',
            'prefix': '',
            'address': '',
            'postcode': '',
            'country': '',
            'logo_paperwork': '',
            'status': False,
            'currency': 1,
        }

    form = StoreEditForm(instance=blog_obj, initial=blog_iniitials)
    context['form'] = form
    return render(request, template, context)


def all_sites(request):
    template_name = 'sites/sites_list.html'
    context = {'pageview': 'Sites'}
    context['heading'] = ""
    return render(request, template_name, context)

