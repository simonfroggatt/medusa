from django.shortcuts import render
from rest_framework import viewsets
from apps.sites.models import OcStore
from apps.sites.serializers import StoreSerializer
from apps.sites.forms import StoreEditForm
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string
from medusa.decorators import group_required
from apps.sites import search_terms


class Sites(viewsets.ModelViewSet):
    queryset = OcStore.objects.filter(store_id__gt=0)
    serializer_class = StoreSerializer


class SiteUpdate(UpdateView):
    model = OcStore
    form_class = StoreEditForm
    template_name = 'sites/site_details.html'
    success_url = reverse_lazy('allsites')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = super().get_object()
        breadcrumbs = []
        breadcrumbs.append({'name': 'Sites', 'url': reverse_lazy('allsites')})
        context['breadcrumbs'] = breadcrumbs
        context['heading'] = obj.name
        return context


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
    context = {'heading': "Sites"}
    return render(request, template_name, context)



@group_required('superuser')
def search_terms_report(request):
    """What people search for on the storefronts, and which searches find nothing."""
    site_id, days = search_terms.parse_filters(request.GET)
    context = {
        'pageview': 'Search Terms',
        'breadcrumbs': [{'name': 'Admin', 'url': '#'}],
        'heading': 'Search Terms',
        'site_id': site_id,
        'days': days,
        'periods': search_terms.PERIODS,
        'stores': search_terms.store_choices(),
        'report': search_terms.build_report(site_id, days),
    }
    return render(request, 'sites/search_terms.html', context)
