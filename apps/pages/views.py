from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from apps.pages.models import OcTsgBlogs, OcInformationDescription, OcInformationToStore
from apps.pages.serializers import BlogSerializer, InformationSerializer
from apps.pages.forms import BlogDetailsEditForm, InformationDetailsEditForm
from django.urls import reverse_lazy
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string


class Blogs(viewsets.ModelViewSet):
    queryset = OcTsgBlogs.objects.all()
    serializer_class = BlogSerializer

class BlogUpdate(UpdateView):
    model = OcTsgBlogs
    form_class = BlogDetailsEditForm
    template_name = 'pages/blogs/blog_details.html'
    success_url = reverse_lazy('allblogs')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = 'Blogs'
        return context


class BlogCreate(CreateView):
    model = OcTsgBlogs
    form_class = BlogDetailsEditForm
    template_name = 'pages/blogs/blog_details.html'
    success_url = reverse_lazy('allblogs')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['header'] = 'Blogs'
        return context


def blog_delete_dlg(request, blog_id):
    data = dict()
    template_name = 'pages/blogs/blog_delete.html'
    context = {'blog_id': blog_id}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


class BlogDelete(DeleteView):
    model = OcTsgBlogs
    form_class = BlogDetailsEditForm
    success_message = 'Blog deleted'
    success_url = reverse_lazy('allblogs')


def blog_create(request):
    template = 'pages/blogs/blog_create.html'
    context = {}
    context['heading'] = "Blogs"
    context['pageview'] = "blog number"

    if request.method == 'POST':
        form = BlogDetailsEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allblogs')
            return HttpResponseRedirect(success_url)

    else:
        blog_obj = OcTsgBlogs
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

    form = BlogDetailsEditForm(instance=blog_obj, initial=blog_iniitials)
    context['form'] = form
    return render(request, template, context)


def allBlogs(request):
    template_name = 'pages/blogs/blogs_list.html'
    context = {'heading': 'Blogs'}
    return render(request, template_name, context)

def allInfo(request):
    template_name = 'pages/info/information_list.html'
    context = {'heading': "Information"}
    return render(request, template_name, context)


class BlogUpdate(UpdateView):
    model = OcTsgBlogs
    form_class = BlogDetailsEditForm
    template_name = 'pages/blogs/blog_details.html'
    success_url = reverse_lazy('allblogs')

    def get_context_data(self, **kwargs):
         context = super().get_context_data(**kwargs)
         obj = super().get_object()
         breadcrumbs = []
         breadcrumbs.append({'name': 'Blogs', 'url': reverse_lazy('allblogs')})
         context['breadcrumbs'] = breadcrumbs
         context['heading'] = obj.title
         return context


class Information(viewsets.ModelViewSet):
    queryset = OcInformationDescription.objects.all()
    serializer_class = InformationSerializer


class InfoUpdate(UpdateView):
    model = OcInformationDescription
    form_class = InformationDetailsEditForm
    template_name = 'pages/info/information_details.html'
    success_url = reverse_lazy('allinfo')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = super().get_object()
        breadcrumbs = []
        breadcrumbs.append({'name': 'Infomation', 'url': reverse_lazy('allinfo')})
        context['breadcrumbs'] = breadcrumbs
        context['heading'] = obj.title
        return context


def info_create(request):
    template = 'pages/info/information_create.html'
    context = {}
    context['heading'] = "Information"
    context['pageview'] = "New Info"

    if request.method == 'POST':
        form = InformationDetailsEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allinfo')
            return HttpResponseRedirect(success_url)

    else:
        info_obj = OcInformationDescription
        info_iniitials = {
            'title': 'New Information',
            'description': 'Some nice information in here',
            'meta_title': '',
            'meta_description': '',
            'meta_keyword': '',
            'store': 1,
            'language': 1,
            'sort_order': 1,
            'bottom': False,
            'status': False,

        }

    form = InformationDetailsEditForm(instance=info_obj, initial=info_iniitials)
    context['form'] = form
    return render(request, template, context)

def info_delete_dlg(request, information_id):
    data = dict()
    template_name = 'pages/info/information_delete.html'
    context = {'information_id': information_id}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


class InfoDelete(DeleteView):
    model = OcInformationDescription
    form_class = InformationDetailsEditForm
    success_message = 'Information deleted'
    success_url = reverse_lazy('allinfo')



