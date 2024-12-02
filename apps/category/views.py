from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from apps.category.models import OcCategory, OcCategoryDescriptionBase, OcCategoryDescription, OcCategoryToStore, OcTsgCategoryStoreParent
from apps.category.forms import CategoryEditForm, CategoryBaseDescriptionForm, CategoryStoreDescriptionForm, CategoryStoreForm, CategoryStoreParentForm
from apps.sites.models import OcStore
from .serializers import CategorySerialise, CategoryDescriptionSerialize, CategoryToStoreSerializer, CategoryStoreParentPaths, StoreCategoriesSerializer,CategoryBaseDescriptionSerializer
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView
from itertools import chain

# Create your views here.

def all_cats(request):
    template_name = 'category/cats-list.html'
    context = {'heading': 'Categories'}
    return render(request, template_name, context)


class Categories(viewsets.ModelViewSet):
    queryset = OcCategoryDescriptionBase.objects.filter(category_id__gt=0).order_by('category_id')
    serializer_class = CategoryBaseDescriptionSerializer


class CategoryDescriptions(viewsets.ModelViewSet):
    queryset = OcCategoryDescription.objects.all()
    serializer_class = CategoryDescriptionSerialize

    def retrieve(self, request, pk=None):
        queryset = OcCategoryDescription.objects.filter(category_id=pk)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CategoryToStoreDescriptions(viewsets.ModelViewSet):
    queryset = OcCategoryToStore.objects.all()
    serializer_class = CategoryToStoreSerializer

    def retrieve(self, request, pk=None):
        queryset = OcCategoryToStore.objects.filter(category_id=pk)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CategoryStoreToParents(viewsets.ModelViewSet):
    queryset = OcTsgCategoryStoreParent.objects.all()
    serializer_class = CategoryStoreParentPaths

    def retrieve(self, request, pk=None):
        queryset = OcTsgCategoryStoreParent.objects.filter(category_store__category__category_id=pk)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class CategoryStoreEdit(UpdateView):
    queryset = OcCategoryToStore.objects.all()
    form_class = CategoryStoreForm
    template_name = 'category/category_store_edit.html'
    success_url = reverse_lazy('allcategories')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_obj = get_object_or_404(OcCategoryToStore, pk=self.kwargs['pk'])

        breadcrumbs = []
        breadcrumbs.append({'name': 'Categories', 'url': reverse_lazy('allcategories')})
        breadcrumbs.append({'name': category_obj.category.name, 'url': reverse_lazy('categorydetails', kwargs={'pk': category_obj.category_id})})
        context['breadcrumbs'] = breadcrumbs
        context['heading'] = "SITE text"
        context['category_name'] = category_obj.category.name
        context['store_thumb'] = category_obj.store.thumb
        return context

    def get_success_url(self):
        category_obj = get_object_or_404(OcCategoryToStore, pk=self.kwargs['pk'])
        return reverse_lazy('categorydetails', kwargs={'pk': category_obj.category_id})


class CategoryEdit(UpdateView):
    queryset = OcCategoryDescriptionBase.objects.all()
    form_class = CategoryBaseDescriptionForm
    template_name = 'category/category_base_edit.html'
    success_url = reverse_lazy('allcategories')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_obj = get_object_or_404(OcCategoryDescriptionBase, pk=self.kwargs['pk'])
        context['heading'] = "BASE text"
        breadcrumbs = []
        breadcrumbs.append({'name': 'Categories', 'url': reverse_lazy('allcategories')})
        breadcrumbs.append({'name': category_obj.name, 'url': reverse_lazy('categorydetails', kwargs={'pk': category_obj.category_id})})
        context['breadcrumbs'] = breadcrumbs

        return context

    def get_success_url(self):
        return reverse_lazy('categorydetails', kwargs={'pk': self.kwargs['pk']})




def category_details(request, pk):
    template = 'category/category_layout.html'
    context = {}
    category_obj = get_object_or_404(OcCategoryDescriptionBase, pk=pk)
    breadcrumbs = []
    breadcrumbs.append({'name': 'Categories', 'url': reverse_lazy('allcategories')})
    context['breadcrumbs'] = breadcrumbs
    context['heading'] = category_obj.name

    context['category_obj'] = category_obj

    return render(request, template, context)


def category_create(request):

    category_obj = OcCategory()
    category_obj.status = 0
    category_obj.name = 'New Category Title'
    category_obj.sort_order = 999
    category_obj.category_type_id = 1
    category_obj.parent_id = 0
    category_obj.top = False
    category_obj.column = 0



    is_valid = category_obj.save()
    new_category_id = category_obj.category_id

    base_desc_obj = OcCategoryDescriptionBase()
    base_desc_obj.category_id = new_category_id
    base_desc_obj.language_id = 1
    base_desc_obj.name = 'New Category Title'
    base_desc_obj.title = 'New Category Title'
    base_desc_obj.description = 'New Description'
    base_desc_obj.image = ''
    base_desc_obj.meta_title = 'Meta Title'
    base_desc_obj.meta_description = 'Meta Description'
    base_desc_obj.meta_keyword = 'Meta Keywords'
    base_desc_obj.adwords_name = 'Adwords Name'
    base_desc_obj.clean_url = ''
    base_desc_obj.save()

    success_url =  reverse_lazy('categorydetails', kwargs={'pk': new_category_id})
    return HttpResponseRedirect(success_url)


def category_store_add_text_dlg(request, pk):
    data = dict()
    template = 'category/dialogs/category_add_store_text.html'
    site_cat_defined = OcCategoryToStore.objects.filter(category_id=pk).values_list('store_id')
    store_cat_list = list(chain(*site_cat_defined))

    store_obj = OcStore.objects.exclude(store_id__in=store_cat_list).exclude(store_id=0)

    context = {'store_obj': store_obj, 'category_id' : pk}
    data['html_form'] = render_to_string(template,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def category_store_add_text(request):
    data = dict()

    if request.method == 'POST':
        if request.POST['category_id']:
            category_id = request.POST['category_id']
            store_id = request.POST['store_id']
            cat_desc_obj = OcCategoryToStore()
            cat_desc_obj.store_id = store_id
            cat_desc_obj.category_id = category_id
            cat_desc_obj.language_id = 1
            cat_desc_obj.save(force_insert=True)
            success_url = reverse_lazy('categorystoreeditpk', kwargs={'pk': cat_desc_obj.pk})
            return HttpResponseRedirect(success_url)

            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    else:
        data['form_is_valid'] = False

    return JsonResponse(data)


def category_store_text_delete_dlg(request, pk):
    context = {}
    data = dict()
    template_name = 'category/dialogs/delete_category_site_text.html'

    if request.method == 'POST':
        pk_post = request.POST['pk']
        category_obj = get_object_or_404(OcCategoryToStore, pk=pk_post)
        refresh_url = reverse_lazy('categorydetails', kwargs={'pk': category_obj.category_id})
        category_obj.delete()
        return HttpResponseRedirect(refresh_url)

    context['return_url'] = reverse_lazy('categorydetails', kwargs={'pk': pk})
    context['pk'] = pk
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def category_store_parent_edit_dlg(request, pk):
    context = {}
    data = dict()
    template_name = 'category/dialogs/category_site_parent_edit.html'
    category_obj = get_object_or_404(OcTsgCategoryStoreParent, pk=pk)
    if request.method == 'POST':
        form = CategoryStoreParentForm(request.POST, instance=category_obj)
        if form.is_valid():
            form_instance = form.instance
            form.save()
            refresh_url = reverse_lazy('categorydetails', kwargs={'pk': form_instance.category_store.category_id})
            return HttpResponseRedirect(refresh_url)

    else:
        form = CategoryStoreParentForm(instance=category_obj)

    context = {'form': form, 'pk': pk}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def category_store_parent_delete_dlg(request, pk):
    context = {}
    data = dict()
    template_name = 'category/dialogs/delete_category_site_parent.html'

    if request.method == 'POST':
        pk_post = request.POST['pk']
        category_obj = get_object_or_404(OcTsgCategoryStoreParent, pk=pk_post)
        refresh_url = reverse_lazy('categorydetails', kwargs={'pk': category_obj.category_store.category_id})
        category_obj.delete()
        return HttpResponseRedirect(refresh_url)

    context['pk'] = pk
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def category_store_parent_add(request, base_category_id):
    template = 'category/sub_layouts/category_site_parent_add.html'
    context = {}
    context['heading'] = "Category"
    context['pageview'] = "New Site Parent"

    if request.method == 'POST':
        cat_iniitials = {
            'category_store': request.POST.get('cat_store_id'),
            'parent': request.POST.get('parent_id'),
        }
        store_cat_obj = OcCategoryToStore.objects.filter( category_id=base_category_id,
                                          store_id=request.POST.get('store_id'))

        #store_cat_obj = get_object_or_404(OcCategoryToStore, category_id=base_category_id, store_id=request.POST.get('store_id'))
        if store_cat_obj:
            store_cat_id = store_cat_obj.first().category_store_id
        else:
            store_cat_id = create_category_to_store(base_category_id, request.POST.get('store_id'))

        form = CategoryStoreParentForm(request.POST)
        form_instance = form.instance
        new_category_obj = OcTsgCategoryStoreParent()
        new_category_obj.sort_order = form_instance.sort_order
        new_category_obj.status = form_instance.status
        new_category_obj.path = form_instance.path
        new_category_obj.level = form_instance.level
        new_category_obj.top = form_instance.top
        new_category_obj.homepage = form_instance.homepage
        new_category_obj.is_base = form_instance.is_base
        new_category_obj.category_store_id = store_cat_id
        new_category_obj.parent_id = request.POST.get('parent_id')
        new_category_obj.save()

        success_url = reverse_lazy('categorydetails', kwargs={'pk': base_category_id})
        return HttpResponseRedirect(success_url)

    else:
        category_obj = OcTsgCategoryStoreParent

    cat_iniitials = {
        'sort_order': 999,
        'top': False,
        'status': False,
        'homepage': False,
        'is_base': False,
        'path': '',
        'level': ''
    }
    form = CategoryStoreParentForm(instance=category_obj, initial=cat_iniitials)
    base_cat_obj = get_object_or_404(OcCategoryDescriptionBase, pk=base_category_id)
    context['form'] = form
    context['base_category_id'] = base_category_id
    context['return_url'] = reverse_lazy('categorydetails', kwargs={'pk': base_category_id})
    context['base_category'] = base_cat_obj
    context['store_obj'] = OcStore.objects.filter(store_id__gt=0)
    return render(request, template, context)


class StoreCategories(viewsets.ModelViewSet):
    queryset = OcCategoryToStore.objects.all()
    serializer_class = StoreCategoriesSerializer

    def retrieve(self, request, pk=None):
        queryset = OcCategoryToStore.objects.filter(store_id=pk).order_by('category_id')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


def create_category_to_store(category_id, store_id):
    cat_desc_obj = OcCategoryToStore()
    cat_desc_obj.store_id = store_id
    cat_desc_obj.category_id = category_id
    cat_desc_obj.language_id = 1
    cat_desc_obj.save()
    return cat_desc_obj.category_store_id
