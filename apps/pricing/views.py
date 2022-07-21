from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.template.loader import render_to_string
from .models import OcTsgProductSizes, OcTsgProductMaterial, OcTsgSizeMaterialComb, OcTsgSizeMaterialCombPrices
from .serializers import SizesSerializer, MaterialsSerializer, BasePricesSerializer, StorePriceSerializer
from .forms import SizesBSForm, MaterialsBSForm, MaterialForm
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalUpdateView, BSModalDeleteView
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView
import json
from django.db import connection


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

def quick_prices(request):
    template_name = 'dialogs/quick_price.html'
    context = dict()
    data = dict()

    # return render(request, template_name, context)
    data['html_dlg'] = render_to_string(template_name,
                                         context,
                                         request=request)

    return render(request, template_name, context)
    return JsonResponse(data)

class Sizes(viewsets.ModelViewSet):
    queryset = OcTsgProductSizes.objects.all()
    serializer_class = SizesSerializer


class Materials(viewsets.ModelViewSet):
    queryset = OcTsgProductMaterial.objects.all()
    serializer_class = MaterialsSerializer


class BasePrices(viewsets.ModelViewSet):
    queryset = OcTsgSizeMaterialComb.objects.all()
    serializer_class = BasePricesSerializer


class StorePrices(viewsets.ModelViewSet):

    queryset = OcTsgSizeMaterialCombPrices.objects.all()
    serializer_class = StorePriceSerializer

    def retrieve(self, request, pk=None):
        prices = OcTsgSizeMaterialCombPrices.objects.filter(store_id=pk)
        serializer = self.get_serializer(prices, many=True)
        return Response(serializer.data)


class BespokePrices(viewsets.ModelViewSet):
    queryset = OcTsgSizeMaterialComb.objects.all()
    serializer_class = BasePricesSerializer

    def retrieve(self, request, pk=None):
        return

    def list(self, request, *args, **kwargs):
        req = self.request
        width = int(req.query_params.get('width'))
        height = int(req.query_params.get('height'))
        material_id = int(req.query_params.get('material_id'))
        margin = int(req.query_params.get('margin',10))
        margin_diff = margin/100
        width_upper = width * (1 + margin_diff)
        height_upper = height * (1 + margin_diff)
        width_lower = width * (1-margin_diff)
        height_lower = height * (1-margin_diff)
        sql_string = "SELECT oc_tsg_size_material_comb.id, ( oc_tsg_product_sizes.size_width / 1000 ) * ( oc_tsg_product_sizes.size_height / 1000 ) AS sq, oc_tsg_size_material_comb.price, oc_tsg_product_sizes.size_name," \
                     "( ( %(width)s/ 1000 ) * (%(height)s / 1000 ) ) - ( oc_tsg_product_sizes.size_width / 1000 ) * ( oc_tsg_product_sizes.size_height / 1000 ) AS diff " \
                     "FROM oc_tsg_size_material_comb INNER JOIN oc_tsg_product_sizes ON oc_tsg_size_material_comb.product_size_id = oc_tsg_product_sizes.size_id " \
                     "INNER JOIN oc_tsg_product_material ON oc_tsg_size_material_comb.product_material_id = oc_tsg_product_material.material_id " \
                     "WHERE oc_tsg_product_material.material_id = %(material_id)s " \
                     "AND (" \
                     "( ( oc_tsg_product_sizes.size_width / 1000 ) * ( oc_tsg_product_sizes.size_height / 1000 ) ) < ( (%(width_upper)s / 1000 ) * ( %(height_upper)s / 1000 ) ) " \
                     "AND ( ( oc_tsg_product_sizes.size_width / 1000 ) * ( oc_tsg_product_sizes.size_height / 1000 ) ) > ( ( %(width_lower)s / 1000 ) * ( %(height_lower)s / 1000 ) ) " \
                     ") ORDER BY diff LIMIT 10"

        stock_prices = OcTsgSizeMaterialComb.objects.raw(sql_string, {'width': width,
                                                                      'height': height,
                                                                      'width_upper': width_upper,
                                                                      'height_upper': height_upper,
                                                                      'width_lower': width_lower,
                                                                      'height_lower': height_lower,
                                                                      'material_id': material_id})
        serializer = self.get_serializer(stock_prices, many=True)
        return Response(serializer.data)



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
