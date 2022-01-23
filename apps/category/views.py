from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from .models import OcCategory
from .serializers import CategorySerialise
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
    queryset = OcCategory.objects.all()
    serializer_class = CategorySerialise
