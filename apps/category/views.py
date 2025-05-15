from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from apps.category.models import (OcCategory, OcCategoryDescriptionBase, OcCategoryDescription, OcCategoryToStore,
                                  OcTsgCategoryStoreParent, OcTsgCategory, OcTsgCategoryParent)
from apps.category.forms import (CategoryEditForm, CategoryBaseDescriptionForm, CategoryStoreDescriptionForm,
                                 CategoryStoreForm, CategoryStoreParentForm,CategoryDescriptionForm, CategoryParentForm,
                                 CategoryEditParentForm)
from apps.sites.models import OcStore
from .serializers import CategorySerializer, CategoryDescriptionSerialize, CategoryToStoreSerializer, CategoryStoreParentPaths, StoreCategoriesSerializer,CategoryParentPaths
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
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
    queryset = OcTsgCategory.objects.all().order_by('id')
    serializer_class = CategorySerializer

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
    queryset = OcTsgCategoryParent.objects.all()
    serializer_class = CategoryParentPaths

    def retrieve(self, request, pk=None):
        queryset = OcTsgCategoryParent.objects.filter(category_id=pk)
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
    queryset = OcTsgCategory.objects.all()
    form_class = CategoryDescriptionForm
    template_name = 'category/category_edit.html'
    success_url = reverse_lazy('allcategories')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_obj = get_object_or_404(OcTsgCategory, pk=self.kwargs['pk'])
        context['heading'] = "BASE text"
        breadcrumbs = []
        breadcrumbs.append({'name': 'Categories', 'url': reverse_lazy('allcategories')})
        breadcrumbs.append({'name': category_obj.name, 'url': reverse_lazy('categorydetails', kwargs={'pk': category_obj.id})})
        context['breadcrumbs'] = breadcrumbs

        return context

    def get_success_url(self):
        return reverse_lazy('categorydetails', kwargs={'pk': self.kwargs['pk']})




def category_details(request, pk):
    template = 'category/category_layout.html'
    context = {}
    category_obj = get_object_or_404(OcTsgCategory, pk=pk)
    breadcrumbs = []
    breadcrumbs.append({'name': 'Categories', 'url': reverse_lazy('allcategories')})
    context['breadcrumbs'] = breadcrumbs
    context['heading'] = category_obj.name

    context['category_obj'] = category_obj

    return render(request, template, context)


def category_create(request):

    category_obj = OcTsgCategory()
    category_obj.status = 0
    category_obj.name = 'New Category Title'
    category_obj.sort_order = 999
    category_obj.parent_id = None
    category_obj.top = False
    category_obj.column = 0
    category_obj.name = 'New Category Title'
    category_obj.title = 'New Category Title'
    category_obj.description = 'New Description'
    category_obj.image = ''
    category_obj.meta_title = 'Meta Title'
    category_obj.meta_description = 'Meta Description'
    category_obj.meta_keywords = 'Meta Keywords'
    category_obj.adwords_name = 'Adwords Name'
    category_obj.priority = 0
    category_obj.clean_url = ''
    category_obj.status = False
    category_obj.store_id = 1
    category_obj.save()
    new_category_id = category_obj.pk

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
    category_parent_obj = get_object_or_404(OcTsgCategoryParent, pk=pk)
    if request.method == 'POST':
        form = CategoryEditParentForm(request.POST, instance=category_parent_obj)
        if form.is_valid():
            form_instance = form.instance
            form.save()
            refresh_url = reverse_lazy('categorydetails', kwargs={'pk': form_instance.category_id})
            return HttpResponseRedirect(refresh_url)

    else:
        form = CategoryEditParentForm(instance=category_parent_obj)

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
        category_obj = get_object_or_404(OcTsgCategoryParent, pk=pk_post)
        refresh_url = reverse_lazy('categorydetails', kwargs={'pk': category_obj.category_id})
        category_obj.delete()
        return HttpResponseRedirect(refresh_url)

    context['pk'] = pk
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def category_store_parent_add(request, category_id):
    template = 'category/sub_layouts/category_structure_add.html'
    context = {}
    cat_obj = get_object_or_404(OcTsgCategory, pk=category_id)

    context['heading'] = "Parent Category"
    breadcrumbs = []
    breadcrumbs.append({'name': 'Categories', 'url': reverse_lazy('allcategories')})
    breadcrumbs.append(
        {'name': cat_obj.name, 'url': reverse_lazy('categorydetails', kwargs={'pk': category_id})})
    context['breadcrumbs'] = breadcrumbs

    if request.method == 'POST':
        parent_id = request.POST['parent_id']
        form = CategoryParentForm(request.POST)
        if form.is_valid():
            new_cat_parent = form.save(commit=False)
            new_cat_parent.category_id = category_id
            new_cat_parent.parent_id = parent_id
            new_cat_parent.save()

            refresh_url = reverse_lazy('categorydetails', kwargs={'pk': category_id})
            return HttpResponseRedirect(refresh_url)
        else:
            context['form'] = form
            context['category_id'] = category_id
            context['return_url'] = reverse_lazy('categorydetails', kwargs={'pk': category_id})
            context['category'] = cat_obj
            context['error_message'] = "Error saving category parent"
            return render(request, template, context)
    else:
        category_obj = OcTsgCategoryParent()
        cat_initials = {
            'sort_order': 999,
            'top': False,
            'status': False,
            'homepage': False,
            'parent': None,
            'category': cat_obj
        }
        form = CategoryParentForm(instance=category_obj, initial=cat_initials)

    context['form'] = form
    context['category_id'] = category_id
    context['return_url'] = reverse_lazy('categorydetails', kwargs={'pk': category_id})
    context['category'] = cat_obj
    return render(request, template, context)


class StoreCategories(viewsets.ModelViewSet):
    queryset = OcTsgCategory.objects.all()
    serializer_class = CategorySerializer

    def retrieve(self, request, pk=None):
        queryset = OcTsgCategory.objects.filter(store_id=pk).order_by('id')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


def create_category_to_store(category_id, store_id):
    cat_desc_obj = OcCategoryToStore()
    cat_desc_obj.store_id = store_id
    cat_desc_obj.category_id = category_id
    cat_desc_obj.language_id = 1
    cat_desc_obj.save()
    return cat_desc_obj.category_store_id
