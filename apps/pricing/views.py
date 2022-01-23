from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.template.loader import render_to_string
from .models import OcTsgProductSizes, OcTsgProductMaterial, OcTsgSizeMaterialComb
from .serializers import SizesSerializer, MaterialsSerializer, BasePricesSerializer
from .forms import SizesBSForm, MaterialsBSForm, MaterialForm
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalUpdateView, BSModalDeleteView
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView


def all_sizes(request):
    template_name = 'pricing/sizes/sizes-list.html';

    context = {'pageview': 'Sizes'}
    return render(request, template_name, context)

def all_materials(request):
    template_name = 'pricing/materials/materials-list.html';
    context = {'pageview': 'Materials'}
    return render(request, template_name, context)


def all_base_prices(request):
    template_name = 'pricing/price-comb-list.html';
    context = {'pageview': 'Base Prices'}
    return render(request, template_name, context)


def material_details(request, material_id):
    template_name = 'pricing/materials/material-details.html'
    material_obj = get_object_or_404(OcTsgProductMaterial, pk=material_id)
    context = {"material_obj": material_obj}
    return render(request, template_name, context)


class Sizes(viewsets.ModelViewSet):
    queryset = OcTsgProductSizes.objects.all()
    serializer_class = SizesSerializer


class Materials(viewsets.ModelViewSet):
    queryset = OcTsgProductMaterial.objects.all()
    serializer_class = MaterialsSerializer


class BasePrices(viewsets.ModelViewSet):
    queryset = OcTsgSizeMaterialComb.objects.all()
    serializer_class = BasePricesSerializer


class SizeCreateView(BSModalCreateView):
    template_name = 'pricing/sizes/sizes-create.html'
    form_class = SizesBSForm
    success_message = 'Success: Size was created.'
    success_url = reverse_lazy('allsizes')


class SizeUpdateView(BSModalUpdateView):
    model = OcTsgProductSizes
    template_name = 'pricing/sizes/sizes-edit.html'
    form_class = SizesBSForm
    success_message = 'Success: Size was updated.'
    success_url = reverse_lazy('allsizes')




class SizeDeleteView(BSModalDeleteView):
    model = OcTsgProductSizes
    template_name = 'pricing/sizes/sizes-delete.html'
    success_message = 'Success: Size was deleted.'
    success_url = reverse_lazy('allsizes')


class MaterialCreateView(BSModalCreateView):
    template_name = 'pricing/materials/materials-create.html'
    form_class = MaterialsBSForm
    success_message = 'Success: Material was created.'
    success_url = reverse_lazy('allmaterials')


class MaterialUpdateViewDlg(BSModalUpdateView):
    model = OcTsgProductMaterial
    template_name = 'pricing/materials/materials-edit-dialog.html'
    form_class = MaterialsBSForm
    success_message = 'Success: Material was updated.'
    success_url = reverse_lazy('allmaterials')


class MaterialDeleteView(BSModalDeleteView):
    model = OcTsgProductMaterial
    template_name = 'pricing/materials/materials-delete.html'
    success_message = 'Success: Material was deleted.'
    success_url = reverse_lazy('allmaterials')


class MaterialUpdateView(UpdateView):
    model = OcTsgProductMaterial
    form_class = MaterialForm
    template_name = 'pricing/materials/materials-edit.html'
    success_url = reverse_lazy('allmaterials')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = 'Materials'
        context['pageview_url'] = reverse_lazy('allmaterials')
        return context
