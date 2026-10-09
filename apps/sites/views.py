from django.shortcuts import render
from rest_framework import viewsets
from apps.sites.models import OcStore, OcTsgSearchRule, OcTsgBanner, OcTsgCategoryBespoke
from apps.sites.serializers import StoreSerializer
from apps.sites.forms import StoreEditForm, SearchRuleForm, BannerForm, CategoryBespokeForm
from apps.sites import bespoke_offers
from django.shortcuts import get_object_or_404, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string
from django.db.utils import ProgrammingError, DatabaseError
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
    }
    try:
        context['report'] = search_terms.build_report(site_id, days)
    except ProgrammingError as error:
        # 1146 = table doesn't exist: the log table hasn't been created on this database yet
        if not error.args or error.args[0] != 1146:
            raise
        context['table_missing'] = True
    return render(request, 'sites/search_terms.html', context)


@group_required('superuser')
def search_rules_list(request):
    """Ranking rules the storefront search uses (pushing NHS/Prestige/etc. signs down)."""
    stores = dict(OcStore.objects.filter(store_id__gt=0).values_list('store_id', 'name'))
    try:
        rules = list(OcTsgSearchRule.objects.order_by('rule_type', 'label'))
        table_missing = False
    except ProgrammingError as error:
        if not error.args or error.args[0] != 1146:
            raise
        rules, table_missing = [], True
    for rule in rules:
        rule.store_name = stores.get(rule.store_id, 'All stores')
    context = {'pageview': 'Search Rules', 'heading': 'Search Rules',
               'breadcrumbs': [{'name': 'Admin', 'url': '#'}],
               'rules': rules, 'table_missing': table_missing}
    return render(request, 'sites/search_rules.html', context)


def _search_rule_form(request, rule=None):
    form = SearchRuleForm(request.POST or None, instance=rule)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Search rule saved. The storefront picks it up within the hour.')
        return redirect('searchrules')
    context = {'pageview': 'Search Rules', 'heading': 'Search rule', 'form': form, 'rule': rule,
               'breadcrumbs': [{'name': 'Search Rules', 'url': reverse_lazy('searchrules')}]}
    return render(request, 'sites/search_rule_form.html', context)


@group_required('superuser')
def search_rule_create(request):
    return _search_rule_form(request)


@group_required('superuser')
def search_rule_edit(request, pk):
    return _search_rule_form(request, get_object_or_404(OcTsgSearchRule, pk=pk))


@group_required('superuser')
@require_POST
def search_rule_delete(request, pk):
    get_object_or_404(OcTsgSearchRule, pk=pk).delete()
    messages.success(request, 'Search rule deleted.')
    return redirect('searchrules')


def _banner_store_filter(params):
    try:
        return max(int(params.get('site', 0)), 0)
    except (TypeError, ValueError):
        return 0


@group_required('superuser')
def banners_list(request):
    """Homepage banners for each store."""
    site_id = _banner_store_filter(request.GET)
    stores = list(OcStore.objects.filter(store_id__gt=0).order_by('name').values_list('store_id', 'name'))
    names = dict(stores)
    try:
        banners = OcTsgBanner.objects.all()
        if site_id:
            banners = banners.filter(store_id=site_id)
        banners = list(banners)
        table_missing = False
    except DatabaseError as error:
        # 1146 = no table yet, 1054 = a column added by a later SQL file (text_align) isn't there yet
        code = error.args[0] if error.args else None
        if code not in (1146, 1054):
            raise
        banners, table_missing, needs_update = [], code == 1146, code == 1054
    else:
        needs_update = False
    for banner in banners:
        banner.store_name = names.get(banner.store_id, 'Store %s' % banner.store_id)
    context = {'pageview': 'Banners', 'heading': 'Banners', 'breadcrumbs': [{'name': 'Sites', 'url': reverse_lazy('allsites')}],
               'banners': banners, 'stores': stores, 'site_id': site_id, 'table_missing': table_missing,
               'needs_update': needs_update}
    return render(request, 'sites/banners.html', context)


def _banner_form(request, banner=None):
    initial = {}
    if banner is None:
        initial = {'store_id': _banner_store_filter(request.GET) or None}
    form = BannerForm(request.POST or None, request.FILES or None, instance=banner, initial=initial)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Banner saved.')
        return redirect('banners')
    context = {'pageview': 'Banners', 'heading': 'Banner', 'form': form, 'banner': banner,
               'breadcrumbs': [{'name': 'Banners', 'url': reverse_lazy('banners')}]}
    return render(request, 'sites/banner_form.html', context)


@group_required('superuser')
def banner_create(request):
    return _banner_form(request)


@group_required('superuser')
def banner_edit(request, pk):
    return _banner_form(request, get_object_or_404(OcTsgBanner, pk=pk))


@group_required('superuser')
@require_POST
def banner_delete(request, pk):
    get_object_or_404(OcTsgBanner, pk=pk).delete()
    messages.success(request, 'Banner deleted.')
    return redirect('banners')


def _offer_store(params):
    try:
        return int(params.get('site', 1)) or 1
    except (TypeError, ValueError):
        return 1


@group_required('superuser')
def bespoke_offers_list(request):
    """Every shop category with the "make your own" offer it would show, and why."""
    site_id = _offer_store(request.GET)
    stores = list(OcStore.objects.filter(store_id__gt=0).order_by('name').values_list('store_id', 'name'))
    context = {'pageview': 'Bespoke Offers', 'heading': 'Bespoke Offers', 'stores': stores, 'site_id': site_id,
               'breadcrumbs': [{'name': 'Sites', 'url': reverse_lazy('allsites')}], 'table_missing': False}
    try:
        rules = {rule.category_id: rule for rule in OcTsgCategoryBespoke.objects.all()}
    except DatabaseError as error:
        if not error.args or error.args[0] != 1146:
            raise
        context.update(table_missing=True, rows=[], counts={})
        return render(request, 'sites/bespoke_offers.html', context)
    categories, parents = bespoke_offers.load_categories(site_id)
    products = dict(bespoke_offers.designer_products())
    rows = bespoke_offers.tree_rows(categories, rules, parents)
    names = {cid: name for cid, name, _ in categories}
    counts = {}
    for row in rows:
        row['product_title'] = products.get(row['effective'].bespoke_product_id) if row['effective'] else None
        row['inherited_name'] = names.get(row['inherited_from'])
        counts[row['kind']] = counts.get(row['kind'], 0) + 1
    context.update(rows=rows, counts=counts)
    return render(request, 'sites/bespoke_offers.html', context)


def _offer_form(request, rule=None):
    site_id = _offer_store(request.GET)
    categories, _ = bespoke_offers.load_categories(site_id)
    taken = set() if rule else set(OcTsgCategoryBespoke.objects.values_list('category_id', flat=True))
    choices = [(cid, name) for cid, name, _ in categories if cid not in taken]
    initial = {}
    if rule is None:
        try:
            initial = {'category_id': int(request.GET.get('category'))}
        except (TypeError, ValueError):
            pass
    form = CategoryBespokeForm(request.POST or None, instance=rule, initial=initial, categories=choices,
                               products=bespoke_offers.designer_products())
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Bespoke offer saved.')
        return redirect('bespokeoffers')
    context = {'pageview': 'Bespoke Offers', 'heading': 'Bespoke offer', 'form': form, 'rule': rule,
               'breadcrumbs': [{'name': 'Bespoke Offers', 'url': reverse_lazy('bespokeoffers')}]}
    return render(request, 'sites/bespoke_offer_form.html', context)


@group_required('superuser')
def bespoke_offer_create(request):
    return _offer_form(request)


@group_required('superuser')
def bespoke_offer_edit(request, pk):
    return _offer_form(request, get_object_or_404(OcTsgCategoryBespoke, pk=pk))


@group_required('superuser')
@require_POST
def bespoke_offer_delete(request, pk):
    get_object_or_404(OcTsgCategoryBespoke, pk=pk).delete()
    messages.success(request, 'Bespoke offer removed. That category now follows its parent.')
    return redirect('bespokeoffers')
