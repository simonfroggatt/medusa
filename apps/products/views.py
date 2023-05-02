from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from .models import OcProduct, OcProductDescription, OcProductDescriptionBase, OcTsgProductVariantCore, \
    OcTsgProductVariantOptions, OcTsgDepOptionClass, OcTsgProductVariants, OcProductToStore, OcProductToCategory
from .serializers import ProductListSerializer, CoreVariantSerializer, ProductVariantSerializer, \
    StoreCoreProductVariantSerialize, ProductStoreSerializer, CategorySerializer, ProductSymbolSerialzer, \
    ProductCoreVariantOptionsSerializer #, BaseProductListSerializer, ProductTestSerializer

from apps.symbols.models import OcTsgSymbols, OcTsgProductSymbols
from apps.symbols.serializers import SymbolSerializer

from apps.options.models import OcTsgProductVariantCoreOptions, OcTsgOptionClassGroupValues, OcTsgOptionClassGroups

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.template.loader import render_to_string
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from .forms import ProductForm, ProductDescriptionBaseForm, SiteProductDetailsForm, ProductCategoryForm, \
    VariantCoreOptionsForm, VariantCoreForm, VariantCoreEditForm
from django.urls import reverse_lazy
from itertools import chain
from apps.sites.models import OcStore

# Create your views here.
# Create your views here.


class ProductSite(viewsets.ModelViewSet):
    queryset = OcProductToStore.objects.all()
    serializer_class = ProductStoreSerializer

    def retrieve(self, request, pk=None):
        product_store_object = OcProductToStore.objects.filter(product_id=pk)
        serializer = self.get_serializer(product_store_object, many=True)
        return Response(serializer.data)

class ProductSymbols(viewsets.ModelViewSet):
    queryset = OcTsgProductSymbols.objects.all()
    serializer_class = ProductSymbolSerialzer

    def retrieve(self, request, pk=None):
        product_symbol_object = OcTsgProductSymbols.objects.filter(product_id=pk)
        serializer = self.get_serializer(product_symbol_object, many=True)
        return Response(serializer.data)

class ProductSymbolsAvailable(viewsets.ModelViewSet):
    queryset = OcTsgSymbols.objects.all()
    serializer_class = SymbolSerializer

    def retrieve(self, request, pk=None):
        product_symbols_defined = OcTsgProductSymbols.objects.filter(product_id=pk).values_list('symbol_id')
        product_symbol_list = list(chain(*product_symbols_defined))
        product_symbol_obj = OcTsgSymbols.objects.exclude(pk__in=product_symbol_list)
        serializer = SymbolSerializer(product_symbol_obj, many=True)
        return Response(serializer.data)


class Category(viewsets.ModelViewSet):
    queryset = OcProductToCategory.objects.all()
    serializer_class = CategorySerializer

    def retrieve(self, request, pk=None):
        category_object = OcProductToCategory.objects.filter(product_id=pk)
        serializer = self.get_serializer(category_object, many=True)
        return Response(serializer.data)



class ProductSite2(viewsets.ModelViewSet):
    queryset = OcProductToStore.objects.all()
    serializer_class = ProductStoreSerializer

    def list(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        store_id = kwargs['store_id']
        product_store_obj = OcProductToStore.objects.filter(store_id=store_id, product_id=product_id)
        serializer = self.get_serializer(product_store_obj, many=True)
        return Response(serializer.data)

class ProductCategories(viewsets.ModelViewSet):
    queryset = OcProductToStore.objects.all()
    serializer_class = ProductStoreSerializer

class Symbols(viewsets.ModelViewSet):
    queryset = OcTsgSymbols.objects.all()
    serializer_class = ProductSymbolSerialzer

class ProductVariantOption(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantCoreOptions.objects.all()
    serializer_class = ProductCoreVariantOptionsSerializer

    def retrieve(self, request, pk=None):
        category_object = OcTsgProductVariantCoreOptions.objects.filter(product_variant__prod_variant_core_id=pk)
        serializer = self.get_serializer(category_object, many=True)
        return Response(serializer.data)


def product_list(request):
    template_name = 'products/products_list.html'
    context = {'pageview': 'All products'}
    return render(request, template_name, context)


def product_list_all(request):
    template_name = 'products/products-list.html'
    context = {'heading': 'All products'}
    return render(request, template_name, context)


class base_product_list_asJSON(viewsets.ModelViewSet):
    queryset = OcProduct.objects.all()
    serializer_class = ProductListSerializer



class ProductsListView(generics.ListAPIView):
    queryset = OcProduct.objects.all().order_by('product_id')
    #queryset = OcProduct.objects.all()
    serializer_class = ProductListSerializer
    #pagination_class = dt_pagination.DatatablesLimitOffsetPagination

    def post(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


def product_details(request, product_id):
    product_obj = get_object_or_404(OcProduct, pk=product_id)

    context = {"product_obj": product_obj}
    template_name = 'products/product_layout.html'

    context['pageview'] = 'All products'
    context['heading'] = 'product details'
    return render(request, template_name, context)


class BaseVariantListView(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantCore.objects.all()
    serializer_class = CoreVariantSerializer

    def list(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        variant_list = OcTsgProductVariantCore.objects.filter(product_id=product_id)
        serializer = self.get_serializer(variant_list, many=True)
        return Response(serializer.data)


class StoreVariantListView(viewsets.ModelViewSet):
    queryset = OcTsgProductVariants.objects.all()
    serializer_class = ProductVariantSerializer

    def list(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        store_id = kwargs['store_id']
        variant_list = OcTsgProductVariants.objects.filter(store_id=store_id, prod_var_core__product__product_id=product_id)
        serializer = self.get_serializer(variant_list, many=True)
        return Response(serializer.data)


class StoreVariantListViewReverse(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantCore.objects.all()
    serializer_class = StoreCoreProductVariantSerialize(1)

    def list(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        variant_list = OcTsgProductVariantCore.objects.filter(product_id=product_id , storeproductvariants__store__store_id=1)
        serializer = self.get_serializer(variant_list, many=True)
        return Response(serializer.data)


def core_variant_options(request, core_variant_id):
    variant_options = OcTsgProductVariantOptions.objects.all().filter(product_variant_id=core_variant_id)
    template_name = 'products/variant-options.html'
    context = {'core_variant_id': core_variant_id}
    context['variant_options'] = variant_options
    return render(request, template_name, context)


def core_variant_options_class(request, core_variant_id):
    variant_options = OcTsgDepOptionClass.objects.all().filter(optionclass__product_variant_id=core_variant_id, store_id=1).order_by('order_by')
    template_name = 'products/variant-options.html'
    context = {'core_variant_id': core_variant_id}
    context['variant_options'] = variant_options
    return render(request, template_name, context)

def product_edit_base(request, product_id):
    template_name = 'products/sub_layout/product_base-edit.html'
    context = dict()
    product_obj = get_object_or_404(OcProduct, product_id=product_id)
    product_base_desc_obj = get_object_or_404(OcProductDescriptionBase, product_id=product_id)

    if request.method == 'POST':
        form_product = ProductForm(request.POST, instance=product_obj)
        form_product_base_desc = ProductDescriptionBaseForm(request.POST, instance=product_base_desc_obj)
        if form_product.is_valid():
            form_product.save()
        if form_product_base_desc.is_valid():
            form_product_base_desc.save()
        success_url = reverse_lazy('product_details', kwargs={'product_id': product_id})
        return HttpResponseRedirect(success_url)

    else:
        form_product = ProductForm( instance=product_obj)
        form_product_base_desc = ProductDescriptionBaseForm(instance=product_base_desc_obj)



    context['heading'] = "Products"
    context['pageview'] = "Base Edit"
    context['form_product'] = form_product
    context['form_product_desc'] = form_product_base_desc
    context['get_success_url'] = reverse_lazy('product_details', kwargs={'product_id': product_id})

    return render(request, template_name, context)


class ProductSiteUpdate(UpdateView):
    model = OcProductToStore
    form_class = SiteProductDetailsForm
    template_name = 'products/sub_layout/product_store-edit.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = "Products"
        context['heading'] = "Store data"
        return context


    def get_success_url(self):
        store_product_obj = OcProductToStore.objects.filter(pk=self.kwargs['pk']).first()
        return reverse_lazy('product_details', kwargs={'product_id':store_product_obj.product_id })


def product_store_add_text_dlg(request, pk):
    data = dict()
    template = 'products/dialogs/product_add_store_text.html'
    site_product_defined = OcProductToStore.objects.filter(product_id=pk).values_list('store_id')
    store_cat_list = list(chain(*site_product_defined))

    store_obj = OcStore.objects.exclude(store_id__in=store_cat_list).exclude(store_id=0)

    context = {'store_obj': store_obj, 'product_id': pk}
    data['html_form'] = render_to_string(template,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_store_add_text(request):
    data = dict()

    if request.method == 'POST':
        if request.POST['product_id']:
            product_id = request.POST['product_id']
            store_id = request.POST['store_id']
            product_desc_obj = OcProductToStore()
            product_desc_obj.store_id = store_id
            product_desc_obj.product_id = product_id
            product_desc_obj.save(force_insert=True)
            success_url = reverse_lazy('product_store_details_edit', kwargs={'pk': product_desc_obj.pk})
            return HttpResponseRedirect(success_url)

            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    else:
        data['form_is_valid'] = False

    return JsonResponse(data)


def product_category_edit(request, pk):
    template_name = 'products/dialogs/product_category-edit.html'
    context = dict()
    data = dict()
    product_obj = get_object_or_404(OcProductToCategory, pk=pk)

    if request.method == 'POST':
        form_product = ProductCategoryForm(request.POST, instance=product_obj)
        if form_product.is_valid():
            instance = form_product.save(commit=False)
            instance.category_store_id = request.POST.get('store_category_id')
            instance.save()
            return HttpResponseRedirect(data['refresh_url'])
    else:
        form_product = ProductCategoryForm(instance=product_obj)

    store_obj = OcProductToStore.objects.filter(product_id=product_obj.product.product_id)
    context = {'store_obj': store_obj, 'form': form_product, 'pk': pk}
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_category_create(request, pk):
    template_name = 'products/dialogs/product_category-edit.html'
    context = dict()
    data = dict()
    product_obj = get_object_or_404(OcProductToCategory, pk=pk)

    if request.method == 'POST':
        form_product = ProductCategoryForm(request.POST, instance=product_obj)
        if form_product.is_valid():
            instance = form_product.save(commit=False)
            instance.category_store_id = request.POST.get('store_category_id')
            instance.save()
            return HttpResponseRedirect(data['refresh_url'])
    else:
        form_product = ProductCategoryForm(instance=product_obj)

    store_obj = OcProductToStore.objects.filter(product_id=product_obj.product.product_id)
    context = {'store_obj': store_obj, 'form': form_product, 'pk': pk}
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def add_product_symbol(request, product_id, symbol_id):
    data = dict()

    if request.method == 'POST':
        product_symbol_obj = OcTsgProductSymbols()
        product_symbol_obj.product_id = product_id
        product_symbol_obj.symbol_id = symbol_id
        bl_saved = product_symbol_obj.save(force_insert=True)
        data['is_saved'] = True
    else:
        data['is_saved'] = False

    return JsonResponse(data)


def delete_product_symbol(request, product_id, symbol_id):
    data = dict()

    if request.method == 'POST':
        product_symbol_obj = OcTsgProductSymbols.objects.filter(product_id=product_id).filter(symbol_id=symbol_id)
        product_symbol_obj.delete()
        data['is_saved'] = True
    else:
        data['is_saved'] = False

    return JsonResponse(data)


def product_variant_core_add_option(request, core_variant_id):
    data = dict()
    context = {'core_variant_id': core_variant_id}
    template_name = 'products/dialogs/variant_option_add.html/'

    if request.method == 'POST':
        form_obj = VariantCoreOptionsForm(request.POST)
        if form_obj.is_valid():
            form_obj.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        variant_option_core_obj = OcTsgProductVariantCoreOptions()
        variant_option_core_initials = {'product_variant': core_variant_id, 'option_class': 1, 'option_value': 1,
                                         'order_by': 99}
        form_obj = VariantCoreOptionsForm(instance=variant_option_core_obj, initial=variant_option_core_initials)

    context['form'] = form_obj
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_variant_core_edit_option(request, pk):
    data = dict()
    context = {'variant_option_id': pk}
    template_name = 'products/dialogs/variant_option_edit.html/'

    if request.method == 'POST':
        form_obj = VariantCoreOptionsForm(request.POST)
        if form_obj.is_valid():
            form_instance = form_obj.instance
            form_instance.id = pk
            form_instance.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        variant_option_core_obj = get_object_or_404(OcTsgProductVariantCoreOptions, id=pk)
        form_obj = VariantCoreOptionsForm(instance=variant_option_core_obj)

    context['form'] = form_obj
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_variant_core_delete_option(request, pk):
    data = dict()
    context = {'variant_option_id': pk}

    if request.method == 'POST':
        variant_option_id = request.POST.get('variant_option_id')
        variant_option_core_obj = get_object_or_404(OcTsgProductVariantCoreOptions, id=variant_option_id)
        variant_option_core_obj.delete()
        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False
        context['variant_option_id'] = pk
        template_name = 'products/dialogs/variant_core_option_delete.html/'
        data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_variant_core_add_group_option(request, core_variant_id):
    data = dict()
    context = {'core_variant_id': core_variant_id}
    template_name = 'products/dialogs/variant_option_group_add.html/'

    if request.method == 'POST':
        variant_core_id = request.POST.get('core_variant_id')
        group_id = request.POST.get('group_option_select_id')
        group_values = OcTsgOptionClassGroupValues.objects.filter(group_id=group_id)
        if group_values:
            for values in group_values:
                new_variant_option = OcTsgProductVariantCoreOptions()
                new_variant_option.product_variant_id = variant_core_id
                new_variant_option.option_class_id = values.class_field.id
                new_variant_option.option_value_id = values.value.id
                new_variant_option.order_by = values.order_id
                new_variant_option.save()

        data['form_is_valid'] = True

    option_group_obj = OcTsgOptionClassGroups.objects.all()
    context['object_groups'] = option_group_obj
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_core_variant_add(request, pk):
    data = dict()
    context = {'product_id': pk}

    if request.method == 'POST':
        form_obj = VariantCoreForm(request.POST)
        if form_obj.is_valid():
            form_obj.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        variant_core_obj = OcTsgProductVariantCore()
        variant_core_initials = {'product': pk, 'size_material_id': 1, 'supplier': 1, 'supplier_code': 'code',
                                 'supplier_price': 0.00, 'exclude_fpnp': False, 'gtin': '', 'shipping_cost': 0.00,
                                 'bl_live': True}
        form_obj = VariantCoreForm(instance=variant_core_obj, initial=variant_core_initials)

    context['form'] = form_obj
    template_name = 'products/dialogs/product_core_variant_add.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def product_core_variant_edit(request, pk):
    data = dict()
    context = {'prod_variant_core_id' : pk}
    if request.method == 'POST':
        form_obj = VariantCoreEditForm(request.POST)
        if form_obj.is_valid():
            form_instance = form_obj.instance
            form_instance.prod_variant_core_id = request.POST.get('prod_variant_core_id')
            form_instance.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        variant_core_obj = get_object_or_404(OcTsgProductVariantCore,prod_variant_core_id=pk)
        context['size_material'] = f"{variant_core_obj.size_material.product_size.size_name} - {variant_core_obj.size_material.product_material.material_name}"
        form_obj = VariantCoreEditForm(instance=variant_core_obj)

    context['form'] = form_obj
    template_name = 'products/dialogs/product_core_variant_edit.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def group_class_list_html(request, group_id):
    data = dict()

    group_class_value_obj = OcTsgOptionClassGroupValues.objects.filter(group_id=group_id)
    context = {'group_class_value_obj' : group_class_value_obj}
    template_name = 'products/sub_layout/group_class_values_list.html'
    data['html_text'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)

