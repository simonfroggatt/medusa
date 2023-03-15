from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from apps.category.models import OcCategory, OcCategoryDescriptionBase, OcCategoryDescription, OcCategoryToStore
from apps.category.forms import CategoryEditForm, CategoryBaseDescriptionForm, CategoryStoreDescriptionForm
from .serializers import CategorySerialise, CategoryDescriptionSerialize, CategoryToStoreSerializer
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView

# Create your views here.

def all_cats(request):
    template_name = 'category/cats-list.html'
    context = {'pageview': 'Categories'}
    return render(request, template_name, context)


class Categories(viewsets.ModelViewSet):
    queryset = OcCategory.objects.filter(category_id__gt=0)
    serializer_class = CategorySerialise


class CategoryDescriptions(viewsets.ModelViewSet):
    queryset = OcCategoryDescription.objects.all()
    serializer_class = CategoryDescriptionSerialize


class CategoryToStoreDescriptions(viewsets.ModelViewSet):
    queryset = OcCategoryToStore.objects.all()
    serializer_class = CategoryToStoreSerializer




class CategoryStoreEdit(UpdateView):
    queryset = OcCategoryDescription.objects.all()
    form_class = CategoryStoreDescriptionForm
    template_name = 'category/category_store_edit.html'
    success_url = reverse_lazy('allcategories')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Categories"
        context['pageview'] = "Cat info"
        category_obj = get_object_or_404(OcCategoryDescription, pk=self.kwargs['pk'])
        context['category_name'] = category_obj.category.name
        context['store_thumb'] = category_obj.store.thumb
       # success_url = reverse_lazy('categorybaseedit', kwargs={'pk': self.kwargs['pk']})
        return context

    def get_success_url(self):
        return reverse_lazy('categorydetails', kwargs={'pk': self.kwargs['pk']})


class CategoryEdit(UpdateView):
    queryset = OcCategoryDescriptionBase.objects.all()
    form_class = CategoryBaseDescriptionForm
    template_name = 'category/category_base_edit.html'
    success_url = reverse_lazy('allcategories')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Categories"
        context['pageview'] = "Cat info"
       # success_url = reverse_lazy('categorybaseedit', kwargs={'pk': self.kwargs['pk']})
        return context

    def get_success_url(self):
        return reverse_lazy('categorydetails', kwargs={'pk': self.kwargs['pk']})




def category_details(request, pk):
    template = 'category/category_layout.html'
    context = {}
    context['pageview'] = "Categories"
    context['heading'] = pk

    category_obj = get_object_or_404(OcCategoryDescriptionBase, pk=pk)
    context['category_obj'] = category_obj

    return render(request, template, context)


def category_create(request):
    template = 'pages/blogs/blog_create.html'
    context = {}
    context['heading'] = "Blogs"
    context['pageview'] = "blog number"

    if request.method == 'POST':
        form = CategoryEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allblogs')
            return HttpResponseRedirect(success_url)

    else:
        blog_obj = OcCategory
        blog_iniitials = {
            'title': 'New Blog Title',
            'sub_title': 'New Blog Sub Title',
            'blog_text': 'Some nice blog stuff',
            'key_words': '',
            'meta_title': '',
            'meta_description': '',
            'meta_keywords': '',
            'tags': '',
            'slug': 'new-blog-url',
            'status': False,
            'language_id': 1,
            'read_count': 0,
            'store': 1,
        }

    form = CategoryEditForm(instance=blog_obj, initial=blog_iniitials)
    context['form'] = form
    return render(request, template, context)

