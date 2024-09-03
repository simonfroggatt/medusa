from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse
from django.core import serializers
from django.template.loader import render_to_string
from apps.pricing.models import OcTsgProductSizes, OcTsgProductMaterial, OcTsgSizeMaterialComb, \
    OcTsgSizeMaterialCombPrices, OcTsgMaterialSpec
from apps.pricing.serializers import SizesSerializer, MaterialsSerializer, BasePricesSerializer, StorePriceSerializer, BespokePricesSerializer
from apps.pricing.forms import SizesForm, MaterialsBSForm, MaterialForm, SizeMaterialCombo, StorePriceComboForm, \
    MaterialSpecForm
from apps.sites.models import OcStore
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalUpdateView, BSModalDeleteView
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView
from apps.products.models import OcTsgBulkdiscountGroups
from apps.products import services as prod_services
import json
from django.db import connection
from itertools import chain
from medusa import services
from django.conf import settings
import os


def all_sizes(request):
    template_name = 'pricing/sizes/sizes-list.html';

    context = {'pageview': 'Sizes'}
    return render(request, template_name, context)

def all_materials(request):
    template_name = 'pricing/materials/materials-list.html';
    context = {'pageview': 'Materials'}
    return render(request, template_name, context)


def all_base_prices(request):
    template_name = 'pricing/prices/price-comb-list.html';
    context = {'pageview': 'Base Prices'}
    return render(request, template_name, context)

def all_prices(request):
    template_name = 'pricing/prices/prices_layout.html';
    context = {'pageview': 'Prices'}
    store_obj = OcStore.objects.exclude(store_id=0)
    context = {'store_obj': store_obj}
    return render(request, template_name, context)


def material_details(request, material_id):
    template_name = 'pricing/materials/material-details.html'
    material_obj = get_object_or_404(OcTsgProductMaterial, pk=material_id)
    context = {"material_obj": material_obj}
    return render(request, template_name, context)

def quick_prices(request):
    template_name = 'pricing/dialogs/quick_price.html'
    context = dict()
    data = dict()
    qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)
    default_bulk = 1

    bulk_details = prod_services.create_bulk_arrays(qs_bulk)
    context['bulk_info'] = bulk_details
    context['material_obj'] = OcTsgProductMaterial.objects.all()
    context['price_for'] = "P"
    context['store_id'] = "1"
    context['customer_discount'] = 0
    bespoke_addon_options = []

    OcTsgProductMaterial.objects.all()

    return render(request, template_name, context)


class Sizes(viewsets.ModelViewSet):
    queryset = OcTsgProductSizes.objects.all()
    serializer_class = SizesSerializer



class Materials(viewsets.ModelViewSet):
    queryset = OcTsgProductMaterial.objects.all()
    serializer_class = MaterialsSerializer


class SizeMaterials(viewsets.ModelViewSet):
    queryset = OcTsgSizeMaterialComb.objects.all()
    serializer_class = BasePricesSerializer

    def retrieve(self, request, pk=None):
        materials_obj = OcTsgSizeMaterialComb.objects.filter(product_size__size_id=pk).order_by('price')
        serializer = self.get_serializer(materials_obj, many=True)
        return Response(serializer.data)


class BasePrices(generics.ListAPIView):
    queryset = OcTsgSizeMaterialComb.objects.all()
    serializer_class = BasePricesSerializer

   # def post(self, request, *args, **kwargs):
    #    return self.list(request, *args, **kwargs)


class StorePrices(viewsets.ModelViewSet):

    queryset = OcTsgSizeMaterialCombPrices.objects.all()
    serializer_class = StorePriceSerializer

    def retrieve(self, request, pk=None):
        prices = OcTsgSizeMaterialCombPrices.objects.filter(store_id=pk)
        serializer = self.get_serializer(prices, many=True)
        return Response(serializer.data)


class BespokePrices(viewsets.ModelViewSet):
    queryset = OcTsgSizeMaterialComb.objects.all()
    serializer_class = BespokePricesSerializer

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



class SizeCreateView(CreateView):
    template_name = 'pricing/sizes/sizes-create.html'

   #initial = {'size_code': '', 'size_name': '', 'size_width': 0, 'size_height': 0, 'size_units': 'mm', 'orientation': 1 }
    model = OcTsgProductSizes
    form_class = SizesForm

    #['size_id', 'size_code', 'size_name', 'size_width', 'size_height', 'size_units', 'orientation']
    success_message = 'Success: Size was created.'
    success_url = reverse_lazy('allsizes')



class SizeUpdateView(UpdateView):
    model = OcTsgProductSizes
    template_name = 'pricing/sizes/sizes-edit.html'
    form_class = SizesForm
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
        pk = self.kwargs['pk']
        material_obj = get_object_or_404(OcTsgProductMaterial, pk=pk)
        context = super().get_context_data(**kwargs)
        context['pageview'] = 'Materials'
        context['pageview_url'] = reverse_lazy('allmaterials')
        context['heading'] = material_obj.material_name

        material_docs_obj = OcTsgMaterialSpec.objects.filter(material_id=pk)
        context['material_docs_obj'] = material_docs_obj
        docform_initials = {'material': material_obj}
        docform = MaterialSpecForm(initial=docform_initials)
        context['docform'] = docform
        context['material_id'] = pk
        context['thumbnail_cache'] = settings.THUMBNAIL_CACHE

        return context


class PriceComboUpdate(UpdateView):
    model = OcTsgSizeMaterialComb
    form_class = SizeMaterialCombo
    template_name = 'pricing/prices/base_prices_edit.html'
    success_url = reverse_lazy('allprices')


def create_price(request):
    data = dict()
    template_name = 'pricing/prices/base_prices_create.html'
    context = {'pageview': 'New Price'}

    if request.method == 'POST':
        size_id = request.POST.get('size_id')
        material_id = request.POST.get('material_id')
        new_price = request.POST.get('new_price')
        size_material_comb_obj = OcTsgSizeMaterialComb()
        size_material_comb_obj.product_size_id = size_id
        size_material_comb_obj.product_material_id = material_id
        size_material_comb_obj.price = new_price
        size_material_comb_obj.bl_live = 1
        size_material_comb_obj.save()
        return_url = reverse_lazy('allprices')
        return HttpResponseRedirect(return_url)




    return render(request, template_name, context)



def test_base_price(request, pk, store_id):
    price_obj = OcTsgSizeMaterialCombPrices.objects.filter(size_material_comb_id=pk).filter(store_id=store_id)
    template_name = 'pricing/test.html';
    context = {'pageview': 'Base Prices', 'price_obj': price_obj}
    return render(request, template_name, context)


def store_price_combo_change(request, pk):
    data = dict()
    context = {}

    if request.method == 'POST':
        new_price = request.POST.get('price');
        size_material_id = request.POST.get('size_material_id');
        store_id = request.POST.get('store_id');
        obj_store_price_combo = get_object_or_404(OcTsgSizeMaterialCombPrices, pk=pk)
        obj_store_price_combo.price = new_price
        obj_store_price_combo.save()
        data['form_is_valid'] = True

    else:
        obj_store_price_combo = get_object_or_404(OcTsgSizeMaterialCombPrices, pk=pk)
        form_obj = StorePriceComboForm(instance=obj_store_price_combo)
        context['form'] = form_obj
        context['size_material_id'] = obj_store_price_combo.size_material_comb_id
        context['store_id'] = obj_store_price_combo.store_id
        context['pk'] = pk
        template_name = 'pricing/dialogs/store_price_combo_change.html'
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )

    return JsonResponse(data)


def size_create(request):
    data = dict()
    context = {}
    context['return_url'] = reverse_lazy('allsizes')

    if request.method == 'POST':
        form = SizesForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allsizes')
            return HttpResponseRedirect(success_url)

        else:
            data['form_is_valid'] = False

    else:
        size_obj = OcTsgProductSizes()
        size_initials = {'size_name': '', 'size_width': 0, 'size_height': 0, 'size_units': 'mm',
                        'size_extra': '', 'size_template': '', 'size_code': 'code', 'symbol_default_location': 1,
                        'orientation_id': 1, 'shipping_width':0, 'shipping_height': 0 }

        form_obj = SizesForm(instance=size_obj, initial=size_initials)
        context['form'] = form_obj
        template_name = 'pricing/sizes/sizes-create.html'
        #data['html_form'] = render_to_string(template_name,
         #                                        context,
         #                                        request=request
         #                                        )
    return render(request, template_name, context)



def store_price_combo_create(request, size_material_id):
    data = dict()
    context = {}

    if request.method == 'POST':
        new_price = request.POST.get('price');
        size_material_id = request.POST.get('size_material_id');
        store_id = request.POST.get('store_id');
        obj_store_price_combo = OcTsgSizeMaterialCombPrices()
        obj_store_price_combo.price = new_price
        obj_store_price_combo.store_id = store_id
        obj_store_price_combo.size_material_comb_id = size_material_id
        #need to do a force insert or create a new id for this table
        obj_store_price_combo.save()
        data['form_is_valid'] = True

    else:
        obj_store_price_combo = OcTsgSizeMaterialCombPrices()
        store_price_combo_initials = {
            'size_material_comb_id': size_material_id,
            'price': 0.00,
            'store': 1
        }
        form_obj = StorePriceComboForm(instance=obj_store_price_combo, initial=store_price_combo_initials)
        context['form'] = form_obj

        site_prices_defined = OcTsgSizeMaterialCombPrices.objects.filter(
            size_material_comb_id=size_material_id).values_list('store_id')
        store_cat_list = list(chain(*site_prices_defined))

        store_obj = OcStore.objects.exclude(store_id__in=store_cat_list).exclude(store_id=0)
        if len(store_obj) > 0:
            context['size_material_id'] = size_material_id
            context['store_obj'] = store_obj
            template_name = 'pricing/dialogs/store_price_combo_create.html'
            data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
        else:
            template_name = 'pricing/dialogs/store_price_combo_create_none.html'
            data['html_form'] = render_to_string(template_name,
                                                 context,
                                                 request=request
                                                 )
    return JsonResponse(data)


def store_price_combo_delete(request, pk):
    data = dict()
    context = {}

    if request.method == 'POST':
        obj_store_price_combo = get_object_or_404(OcTsgSizeMaterialCombPrices, pk=pk)
        obj_store_price_combo.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        template_name = 'pricing/dialogs/store_price_combo_delete.html'
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def material_delete(request, pk):
    data = dict()
    context = {}

    if request.method == 'POST':
        material_id = request.POST.get('material_id')
        obj_material = get_object_or_404(OcTsgProductMaterial, pk=material_id)
        if obj_material.combo_material.exists():
            obj_material.archived = True
            obj_material.save()
        else:
            res = obj_material.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        template_name = 'pricing/materials/materials-delete.html'
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def sizes_delete(request, pk):
    data = dict()
    context = {}

    if request.method == 'POST':
        size_id = request.POST.get('size_id')
        obj_size = get_object_or_404(OcTsgProductSizes, pk=size_id)
        if obj_size.combo_size.exists():
            obj_size.archived = True
            obj_size.save()
        else:
            obj_size.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        template_name = 'pricing/sizes/sizes-delete.html'
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def material_create(request):
    data = dict()
    context = {}
    context['return_url'] = reverse_lazy('allmaterials')

    if request.method == 'POST':
        form = MaterialForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allmaterials')
            return HttpResponseRedirect(success_url)

        else:
            data['form_is_valid'] = False

    else:
        material_obj = OcTsgProductMaterial()
        material_initials = {'material_name': '', 'material_desc': 'description', 'material_desc_full': '', 'mounting_desc': '',
                             'mounting_desc_full': '', 'thickness_desc': '', 'thickness_desc_full': '',
                             'fixing_desc': '', 'fixing_desc_full': '', 'colour_desc': '', 'colour_desc_full': '',
                             'code': '', 'image': ''}

        form_obj = MaterialForm(instance=material_obj, initial=material_initials)
        context['form'] = form_obj
        template_name = 'pricing/materials/materials-create.html'

    return render(request, template_name, context)


class materials_excl_sizes(generics.ListAPIView):
    queryset = OcTsgProductMaterial.objects.all()
    serializer_class = MaterialsSerializer

    def list(self, request, *args, **kwargs):
        size_id = kwargs['size_id']

        product_material_qs = OcTsgSizeMaterialComb.objects.filter(product_size__size_id=size_id).values_list('product_material__material_id')

        product_material_list = list(chain(*product_material_qs))
        core_material_qs = OcTsgProductMaterial.objects.exclude(material_id__in=product_material_list)

        serializer = self.get_serializer(core_material_qs, many=True)
        return Response(serializer.data)


def material_spec_fetch(request, material_id):
    data =  dict()
    material_docs_obj = OcTsgMaterialSpec.objects.filter(material_id=material_id)
    template_name = 'pricing/materials/material_specs.html'
    context = {'material_docs_obj': material_docs_obj}
    material_obj = get_object_or_404(OcTsgProductMaterial,pk=material_id)
    docform_initials = {'material': material_obj}
    docform = MaterialSpecForm(initial=docform_initials)
    context['docform'] = docform
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE
    data['html_content'] = render_to_string(template_name,
                                            context,
                                            request=request
                                            )
    return JsonResponse(data)



def material_spec_upload(request):
    data = dict()
    if request.method == 'POST':
        form = MaterialSpecForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            form_instance = form.instance
            material_doc_obj = get_object_or_404(OcTsgMaterialSpec, pk=form_instance.pk)
            cached_thumb = services.createUploadThumbnail(material_doc_obj.filename.file.name)
            material_doc_obj.cache_path = cached_thumb
            material_doc_obj.save()
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_material_spec', kwargs={'material_id': material_doc_obj.material_id})
            data['divUpdate'] = ['div-material_specs', 'html_content']
        else:
            data['success_post'] = False
    else:
        data['success_post'] = False

    return JsonResponse(data)


def material_spec_download(request, pk):
    doc_obj = get_object_or_404(OcTsgMaterialSpec, pk=pk)
    response = FileResponse(doc_obj.filename, as_attachment=True)
    return response


def material_spec_delete(request, pk):
    data = dict()
    template_name = 'pricing/materials/material_spec_delete.html'
    context = dict()
    material_doc_obj = get_object_or_404(OcTsgMaterialSpec, pk=pk)

    if request.method == 'POST':
        material_doc_obj = get_object_or_404(OcTsgMaterialSpec, pk=pk)
        if material_doc_obj:
            material_doc_obj.delete()
            #delete the cached file
            fullpath = os.path.join(settings.MEDIA_ROOT, settings.THUMBNAIL_CACHE ,material_doc_obj.cache_path)
            if os.path.isfile(fullpath):
                os.remove(fullpath)
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_material_spec',
                                                     kwargs={'material_id': material_doc_obj.material_id})
            data['divUpdate'] = ['div-material_specs', 'html_content']
        else:
            data['success_post'] = False
    else:
        context['dialog_title'] = "<strong>DELETE</strong> document"
        context['action_url'] = reverse_lazy('material_spec-delete', kwargs={'pk': pk})
        context['form_id'] = 'form-material_spec-delete'
        context['material_id'] = material_doc_obj.material_id
        data['upload'] = False

    data['html_form'] = render_to_string(template_name,
                                                     context,
                                                     request=request
                                                     )

    return JsonResponse(data)


