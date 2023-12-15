from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from .models import OcProduct, OcProductDescriptionBase, OcTsgProductVariantCore, \
    OcTsgProductVariants, OcProductToStore, OcProductToCategory, OcProductRelated, \
    OcProductImage, OcStoreProductImages
# OcTsgProductVariantOptions, OcTsgDepOptionClass,\

from .serializers import ProductListSerializer, CoreVariantSerializer, ProductVariantSerializer, \
    StoreCoreProductVariantSerialize, ProductStoreSerializer, CategorySerializer, ProductSymbolSerialzer, \
    ProductSiteVariantOptionsSerializer, ProductCoreVariantOptionsSerializer, RelatedBaseDescriptionSerializer, \
    RelatedSerializer, ProductStoreListSerializer, RelatedByStoreProductSerializer  # , BaseProductListSerializer, ProductTestSerializer, ,

from apps.symbols.models import OcTsgSymbols, OcTsgProductSymbols
from apps.symbols.serializers import SymbolSerializer

from apps.options.models import OcTsgProductVariantCoreOptions, OcTsgOptionClassGroupValues, OcTsgOptionClassGroups, \
    OcTsgProductVariantOptions, OcTsgOptionClass, OcTsgOptionClassValues # , \
# OcTsgOptionClass, OcTsgOptionValues

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.template.loader import render_to_string
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from .forms import ProductForm, ProductDescriptionBaseForm, SiteProductDetailsForm, ProductCategoryForm, \
    VariantCoreOptionsForm, VariantCoreForm, VariantCoreEditForm, SiteVariantOptionsForm, VariantCoreOptionsOrderForm, \
    SiteProductVariantForm, AdditionalProductStoreImages
from django.urls import reverse_lazy
from itertools import chain
from apps.sites.models import OcStore

from django.core.mail import send_mail


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


class Related(viewsets.ModelViewSet):
    queryset = OcProductRelated.objects.all()
    serializer_class = RelatedSerializer

    def retrieve(self, request, pk=None):
        product_object = OcProductToStore.objects.filter(product_id=pk).filter(store_id__gt=0).values_list('id')
        product_list = list(chain(*product_object))

        # related_object = OcProductRelated.objects.filter(pk__in=product_list).filter(store_id__gt=0).values_list('id')
        # related_list = list(chain(*related_object))

        # related_object = OcProductToStore.objects.filter(pk__in=product_list).filter(store_id__gt=0).values_list('id')
        # related_list =  list(chain(*related_object))

        related_serial_ocj = OcProductRelated.objects.filter(product_id__in=product_list)
        serializer = self.get_serializer(related_serial_ocj, many=True)
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


class ProductCoreVariantOption(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantCoreOptions.objects.all()
    serializer_class = ProductCoreVariantOptionsSerializer

    def retrieve(self, request, pk=None):
        category_object = OcTsgProductVariantCoreOptions.objects.filter(product_variant__prod_variant_core_id=pk)
        serializer = self.get_serializer(category_object, many=True)
        return Response(serializer.data)


class ProductSiteVariantOption(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantOptions.objects.all()
    serializer_class = ProductSiteVariantOptionsSerializer

    def retrieve(self, request, pk=None):
        category_object = OcTsgProductVariantOptions.objects.filter(product_variant_id=pk, isdeleted=False)
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
    serializer_class = ProductListSerializer
    model = serializer_class.Meta.model


    def get_queryset(self, store_id=0):
        if self.kwargs['store_id']:
            store_id = self.kwargs['store_id']
        else:
            store_id = 0

        if store_id > 0:
            queryset = self.model.objects.filter(storeproduct__store_id=store_id)
        else:
            queryset = self.model.objects.all().order_by('product_id')

        return queryset.order_by('product_id')



def product_details(request, product_id):
    product_obj = get_object_or_404(OcProduct, pk=product_id)

    context = {"product_obj": product_obj}
    template_name = 'products/product_layout.html'

    context['pageview'] = 'All products'
    context['heading'] = 'product details'
    store_obj = OcStore.objects.exclude(store_id=0)
    context['store_obj'] = store_obj
    return render(request, template_name, context)


class BaseVariantListView(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantCore.objects.all()
    serializer_class = CoreVariantSerializer

    def list(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        variant_list = OcTsgProductVariantCore.objects.filter(product_id=product_id)

        serializer = self.get_serializer(variant_list, many=True)
        return Response(serializer.data)


class CoreVariantProductStoreExcludeListView(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantCore.objects.all()
    serializer_class = CoreVariantSerializer

    def list(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        store_id = kwargs['store_id']

        product_store_variant_qs = OcTsgProductVariants.objects.filter(store_id=store_id,
                                                                         prod_var_core__product__product_id=product_id,
                                                                         prod_var_core__bl_live=True, isdeleted=False).values_list('prod_var_core_id')

        product_store_variant_list = list(chain(*product_store_variant_qs))

        core_variant_qs = OcTsgProductVariantCore.objects.filter(product_id=product_id, bl_live=True).exclude(prod_variant_core_id__in=product_store_variant_list).order_by(
        'size_material__product_size__size_width', 'size_material__product_size__size_height')

        serializer = self.get_serializer(core_variant_qs, many=True)
        return Response(serializer.data)



class StoreVariantListView(viewsets.ModelViewSet):
    # get all the product variants for a given store
    # if the store id is 0 - fetch all variants for all stores
    queryset = OcTsgProductVariants.objects.all()
    serializer_class = ProductVariantSerializer

    def list(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        store_id = kwargs['store_id']
        if store_id > 0:
            variant_list = OcTsgProductVariants.objects.filter(store_id=store_id,
                                                               prod_var_core__product__product_id=product_id,
                                                               prod_var_core__bl_live=True, isdeleted=False)
        else:
            variant_list = OcTsgProductVariants.objects.filter(prod_var_core__product__product_id=product_id,
                                                               prod_var_core__bl_live=True, isdeleted=False)
        serializer = self.get_serializer(variant_list, many=True)
        return Response(serializer.data)


# class StoreVariantListViewReverse(viewsets.ModelViewSet):
#     queryset = OcTsgProductVariantCore.objects.all()
#     serializer_class = StoreCoreProductVariantSerialize(1)
#
#     def list(self, request, *args, **kwargs):
#         product_id = kwargs['product_id']
#         variant_list = OcTsgProductVariantCore.objects.filter(product_id=product_id , storeproductvariants__store__store_id=1)
#         serializer = self.get_serializer(variant_list, many=True)
#         return Response(serializer.data)


def core_variant_options(request, core_variant_id):
    variant_options = OcTsgProductVariantOptions.objects.all().filter(product_variant_id=core_variant_id)
    template_name = 'products/variant-options.html'
    context = {'core_variant_id': core_variant_id}
    context['variant_options'] = variant_options
    return render(request, template_name, context)


# def core_variant_options_class(request, core_variant_id):
#     variant_options = OcTsgDepOptionClass.objects.all().filter(optionclass__product_variant_id=core_variant_id, store_id=1).order_by('order_by')
#     template_name = 'products/variant-options.html'
#     context = {'core_variant_id': core_variant_id}
#     context['variant_options'] = variant_options
#     return render(request, template_name, context)

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
        form_product = ProductForm(instance=product_obj)
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
        return reverse_lazy('product_details', kwargs={'product_id': store_product_obj.product_id})


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
        data['form_is_valid'] = False

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
        form_obj = VariantCoreOptionsOrderForm(request.POST)
        if form_obj.is_valid():
            form_instance = form_obj.instance
            form_instance.id = pk
            form_instance.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        variant_option_core_obj = get_object_or_404(OcTsgProductVariantCoreOptions, id=pk)
        form_obj = VariantCoreOptionsOrderForm(instance=variant_option_core_obj)
        context['class_name'] = variant_option_core_obj.option_class.label
        context['value_name'] = variant_option_core_obj.option_value.title
        data['form_is_valid'] = False

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
    else:
        data['form_is_valid'] = False

    option_group_obj = OcTsgOptionClassGroups.objects.all()
    context['object_groups'] = option_group_obj
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_variant_core_add_class_option(request, core_variant_id):
    data = dict()
    context = {'core_variant_id': core_variant_id}
    template_name = 'products/dialogs/variant_option_class_add.html/'

    if request.method == 'POST':
        variant_core_id = request.POST.get('core_variant_id')
        class_id = request.POST.get('class_option_select_id')
        class_values = OcTsgOptionClassValues.objects.filter(option_class_id=class_id)
        if class_values:
            for values in class_values:
                new_variant_option = OcTsgProductVariantCoreOptions()
                new_variant_option.product_variant_id = variant_core_id
                new_variant_option.option_class_id = values.option_class_id
                new_variant_option.option_value_id = values.option_value_id
                new_variant_option.order_by = values.order
                new_variant_option.save()
        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False

    option_class_obj = OcTsgOptionClass.objects.all()
    context['object_classes'] = option_class_obj
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
        data['form_is_valid'] = False

    context['form'] = form_obj
    template_name = 'products/dialogs/product_core_variant_add.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def product_core_variant_edit(request, pk):
    data = dict()
    context = {'prod_variant_core_id': pk}
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
        variant_core_obj = get_object_or_404(OcTsgProductVariantCore, prod_variant_core_id=pk)
        context[
            'size_material'] = f"{variant_core_obj.size_material.product_size.size_name} - {variant_core_obj.size_material.product_material.material_name}"
        form_obj = VariantCoreEditForm(instance=variant_core_obj)
        data['form_is_valid'] = False

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
    context = {'group_class_value_obj': group_class_value_obj}
    template_name = 'products/sub_layout/group_class_values_list.html'
    data['html_text'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def class_value_list_html(request, class_id):
    data = dict()

    class_value_obj = OcTsgOptionClassValues.objects.filter(option_class_id=class_id)
    context = {'class_value_obj': class_value_obj}
    template_name = 'products/sub_layout/class_values_list.html'
    data['html_text'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def get_product_variant_stores(request, pk):
    data = dict()
    store_obj = OcStore.objects.exclude(store_id=0)
    product_obj = get_object_or_404(OcProduct, product_id=pk)
    context = {'store_obj': store_obj, 'product_obj': product_obj}
    template_name = 'products/sub_layout/site_specific/product-variant-list_by_site.html'
    data['html_text'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def product_variant_site_add_dlg(request, pk):
    data = dict()
    product_obj = get_object_or_404(OcProduct, product_id=pk)
    context = {'product_obj': product_obj}
    template_name = 'products/dialogs/product_variant_site_add.html'
    store_obj = OcStore.objects.exclude(store_id=0)
    context['store_obj'] = store_obj

    context['first_store_id'] = store_obj.first().store_id
    context['product_id'] = pk

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def product_variant_site_add(request, core_variant_id, store_id):
    data = dict()
    data['is_saved'] = False

    #check if the variant is already there but hidden via the isdeleted.  We do this so that historic orders
    #with vairant id's are not lost

    if request.method == 'POST':
        obj_product_variants_deleted = OcTsgProductVariants.objects.filter(prod_var_core_id=core_variant_id,
                                                                           store_id=store_id)
        #if it's deleted just make is visible
        if obj_product_variants_deleted:
            obj_product_variants = obj_product_variants_deleted.first()
            obj_product_variants.isdeleted = False
            obj_product_variants.save()

        #it's never been a variant for this site so add it in
        else:
            obj_product_variants = OcTsgProductVariants()   #create a new variant
            obj_product_variant_core = get_object_or_404(OcTsgProductVariantCore, prod_variant_core_id=core_variant_id)
            obj_product_variants.prod_var_core_id = core_variant_id
            obj_product_variants.store_id = store_id
            obj_product_variants.variant_code = obj_product_variant_core.supplier_code
            obj_product_variants.variant_overide_price = 0.00
            obj_product_variants.isdeleted = False
            obj_product_variants.save()
            new_id = obj_product_variants.prod_variant_id

            #now we need to see if the options to copy are are selected.
            #product_variant_site_add_options(core_variant_id, new_id)

    data['is_saved'] = True
    return JsonResponse(data)


def product_variant_site_delete(request, product_variant_id):
    data = dict()
    data['is_saved'] = True

    if request.method == 'POST':
        obj_product_variant = get_object_or_404(OcTsgProductVariants, pk=product_variant_id)
        obj_product_variant.isdeleted = True;
        obj_product_variant.save()

    data['is_saved'] = True
    return JsonResponse(data)



def product_variant_site_add_old(request, pk, store_id):
    data = dict()
    context = {'product_id': pk}
    site_specific_data = dict()

    if request.method == 'POST':
        selected_list = request.POST.getlist('variant-select[]')
        store_id = request.POST.get('store_id')
        product_id = request.POST.get('product_id')
        # get the current variants first
        current_site_specific_variants = OcTsgProductVariants.objects.filter(prod_var_core__product_id=product_id,
                                                                             isdeleted=False) \
            .filter(store_id=store_id).values_list('prod_var_core_id')
        site_specific_variants_list = list(chain(*current_site_specific_variants))
        site_specific_variants_list_as_str = list(map(str, site_specific_variants_list))

        # create the add list
        add_list = list(map(int, set(selected_list) - set(site_specific_variants_list_as_str)))

        # now create the new records

        for addid in add_list:
            # check if it's already there bit hidden using the isdeleted flag
            obj_product_variants_deleted = OcTsgProductVariants.objects.filter(prod_var_core_id=addid,
                                                                               store_id=store_id)
            if obj_product_variants_deleted:
                obj_product_variants = obj_product_variants_deleted.first()
                obj_product_variants.isdeleted = False
                obj_product_variants.save()

            else:
                obj_product_variants = OcTsgProductVariants()
                obj_product_variant_core = get_object_or_404(OcTsgProductVariantCore, prod_variant_core_id=addid)
                obj_product_variants.prod_var_core_id = addid
                obj_product_variants.store_id = store_id
                obj_product_variants.variant_code = obj_product_variant_core.supplier_code
                obj_product_variants.variant_overide_price = 0.00
                obj_product_variants.isdeleted = False
                obj_product_variants.save()
                new_id = obj_product_variants.prod_variant_id
                product_variant_site_add_options(addid, new_id)

        # create the remove list
        removed_list = list(set(site_specific_variants_list_as_str) - set(selected_list))
        for outid in removed_list:
            obj_product_variant_site = OcTsgProductVariants.objects.filter(prod_var_core_id=outid, store_id=store_id)
            # check if this variant has even been quoted or ordered.  If so, we can't delete it, just set the delete flag to True
            row_product_variant_site = obj_product_variant_site.first()
            bl_delete = True
            if row_product_variant_site.order_product_variant:
                row_product_variant_site.isdeleted = True
                bl_delete = False

            if row_product_variant_site.quote_product_variant:
                row_product_variant_site.isdeleted = True
                bl_delete = False

            if bl_delete:
                obj_product_variant_site.delete()
            else:
                row_product_variant_site.save()

        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False

    core_variants = OcTsgProductVariantCore.objects.filter(product_id=pk, bl_live=True).order_by(
        'size_material__product_size__size_width', 'size_material__product_size__size_height',
        'size_material__sizecombo_base__price')

    store_obj = OcStore.objects.exclude(store_id=0)
    context['store_obj'] = store_obj

    template_name = 'products/dialogs/product_variant_site_add.html'
    context['core_variants'] = core_variants

    for item in store_obj.iterator():
        var_site_id = item.store_id
        site_specific_data[var_site_id] = get_site_selected_variants(pk, var_site_id)

    context['current_variants_list'] = site_specific_data
    context['first_store_id'] = store_obj.first().store_id

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def site_variant_edit_option(request, pk):
    data = dict()
    context = {'site_option_id': pk}
    template_name = 'products/dialogs/site_option_edit.html/'

    if request.method == 'POST':
        form_obj = SiteVariantOptionsForm(request.POST)
        if form_obj.is_valid():
            form_instance = form_obj.instance
            form_instance.id = pk
            form_instance.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        variant_option_core_obj = get_object_or_404(OcTsgProductVariantOptions, id=pk)
        context['class_name'] = variant_option_core_obj.product_var_core_option.option_class.label
        context['value_name'] = variant_option_core_obj.product_var_core_option.option_value.title
        form_obj = SiteVariantOptionsForm(instance=variant_option_core_obj)
        data['form_is_valid'] = False

    context['form'] = form_obj
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def get_site_selected_variants(pk, store_id):
    site_specific_variants = OcTsgProductVariants.objects.filter(prod_var_core__product_id=pk,
                                                                 store_id=store_id, isdeleted=False,
                                                                 prod_var_core__bl_live=True).values_list(
        'prod_var_core_id')

    site_specific_variants_list = list(chain(*site_specific_variants))
    list_as_str = list(map(str, site_specific_variants_list))
    return list_as_str


def product_variant_site_add_options(core_variant_id, site_variant_id):
    data = dict()

    core_variant_options_obj = OcTsgProductVariantCoreOptions.objects.filter(product_variant_id=core_variant_id)
    if core_variant_options_obj:
        for values in core_variant_options_obj:
            new_variant_option = OcTsgProductVariantOptions()
            new_variant_option.product_variant_id = site_variant_id
            new_variant_option.product_var_core_option_id = values.id
            new_variant_option.order_by = values.order_by
            new_variant_option.isdeleted = False
            new_variant_option.save()

    return True


def site_variant_options_edit(request, pk):
    data = dict()
    context = {'product_variant_id': pk}
    template_name = 'products/dialogs/site_variant_option_add.html/'

    if request.method == 'POST':
        selected_list = request.POST.getlist('option-select[]')
        product_variant_id = request.POST.get('product_variant_id')
        # get the current options
        site_selected_options = OcTsgProductVariantOptions.objects.filter(
            product_variant_id=product_variant_id).values_list(
            'product_var_core_option_id')
        site_specific_options_list = list(chain(*site_selected_options))
        site_specific_options_list_as_str = list(map(str, site_specific_options_list))

        # create the add list
        add_list = list(map(int, set(selected_list) - set(site_specific_options_list_as_str)))
        for addid in add_list:
            obj_site_prod_options_deleted = OcTsgProductVariantOptions.objects.filter(
                product_variant_id=product_variant_id, product_var_core_option_id=addid)
            if obj_site_prod_options_deleted:
                obj_site_prod_option = obj_site_prod_options_deleted.first()
                obj_site_prod_option.isdeleted = False
                obj_site_prod_option.save()
            else:
                obj_site_prod_option = OcTsgProductVariantOptions()
                obj_site_prod_option.isdeleted = False
                obj_site_prod_option.product_var_core_option_id = addid
                obj_site_prod_option.product_variant_id = product_variant_id
                obj_product_core_option = get_object_or_404(OcTsgProductVariantCoreOptions, id=addid)
                obj_site_prod_option.order_by = obj_product_core_option.order_by
                obj_site_prod_option.save()

        # now create the new records
        removed_list = list(set(site_specific_options_list_as_str) - set(selected_list))
        for outid in removed_list:
            obj_site_prod_options = OcTsgProductVariantOptions.objects.filter(product_variant_id=product_variant_id,
                                                                              product_var_core_option_id=outid)
            row_site_prod_options = obj_site_prod_options.first()
            row_site_prod_options.isdeleted = True
            row_site_prod_options.save()

        data['form_is_valid'] = True



    else:
        site_variant_obj = get_object_or_404(OcTsgProductVariants, prod_variant_id=pk)
        core_variant_id = site_variant_obj.prod_var_core_id
        # now we need to know the core variant.
        core_variant_options_obj = OcTsgProductVariantCoreOptions.objects.filter(product_variant_id=core_variant_id)
        context['core_variant_options_obj'] = core_variant_options_obj
        form_obj = SiteVariantOptionsForm(instance=site_variant_obj)

        site_selected_options = OcTsgProductVariantOptions.objects.filter(product_variant_id=pk,
                                                                          isdeleted=False).values_list(
            'product_var_core_option_id')

        site_selected_options_list = list(chain(*site_selected_options))
        list_as_str = list(map(str, site_selected_options_list))
        context['current_options_list'] = list_as_str

        context['form'] = form_obj
        data['form_is_valid'] = False

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def site_variant_options_delete(request, pk):
    data = dict()
    context = {'product_variant_option_id': pk}
    template_name = 'products/dialogs/site_variant_option_delete.html/'
    data['form_is_valid'] = False
    if request.method == 'POST':
        product_variant_id_posted = request.POST.get('product_variant_option_id')
        product_variant_obj = get_object_or_404(OcTsgProductVariantOptions, id=product_variant_id_posted)
        product_variant_obj.delete()
        data['form_is_valid'] = True

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def site_variant_edit(request, pk):
    data = dict()
    context = {'product_variant_id': pk}
    template_name = 'products/dialogs/product_site_variant_edit.html/'

    if request.method == 'POST':
        product_variant_id_posted = request.POST.get('product_variant_id')
        posted_form = SiteProductVariantForm(request.POST)
        product_variant_obj = get_object_or_404(OcTsgProductVariants, prod_variant_id=product_variant_id_posted)
        product_variant_obj.variant_code = request.POST.get('variant_code')
        product_variant_obj.variant_overide_price = request.POST.get('variant_overide_price')
        product_variant_obj.save()
        data['form_is_valid'] = True
    else:
        product_variant_obj = get_object_or_404(OcTsgProductVariants, prod_variant_id=pk)
        data['form_is_valid'] = False

    context['product_variant_obj'] = product_variant_obj
    form_obj = SiteProductVariantForm(instance=product_variant_obj)
    context['form'] = form_obj

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def related_item_delete(request, pk):
    data = dict()
    context = {'related_id': pk}
    template_name = 'products/dialogs/related_product-delete.html/'

    if request.method == 'POST':
        related_id = request.POST.get('related_id')
        related_obj = get_object_or_404(OcProductRelated, id=related_id)
        related_obj.delete()
        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def related_item_add(request, pk):
    data = dict()
    context = {'related_id': pk}
    template_name = 'products/dialogs/related_product-add.html/'

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def related_item_edit(request, pk):
    data = dict()
    context = {'related_id': pk}
    template_name = 'products/dialogs/related_product-edit.html/'

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

class related_item_by_store(generics.ListAPIView):
    serializer_class = RelatedByStoreProductSerializer
    model = serializer_class.Meta.model

    def get_queryset(self):
        if self.kwargs['pk']:
            product_id = self.kwargs['pk']
        else:
            product_id = 0

        queryset = self.model.objects.filter(product_id=product_id).order_by('product_id')
        return queryset.order_by('product_id')


def product_additional_images_load(request, product_id, store_id):
    data = dict()
    context = {'product_id': product_id,
               'store_id': store_id}


    if store_id > 0:
        store_images_obj = OcStoreProductImages.objects.select_related('image').filter(store_product__product_id=product_id).filter(store_product__store_id=store_id).order_by('order_id')
        context['images_obj'] = store_images_obj;
    else:
        base_images_obj = OcProductImage.objects.filter(product_id=product_id).order_by('sort_order')
        context['images_obj'] = base_images_obj;


    if store_id > 0:
        template_name = 'products/sub_layout/product_images_bystore_ajax.html'
    else:
        template_name = 'products/sub_layout/product_images_ajax.html'
    return render(request, template_name, context)


def product_additional_images_add(request, product_id, store_id):
    data = dict()


    if store_id > 0:
        data['html_form'] = product_additional_images_store_add(request, product_id, store_id)
    else:
        template = 'products/dialogs/product_additional_images-add.html'
        #store_product_additional_obj = OcStoreProductImages.objects.filter(pk=pk)
        context = {'product_id': product_id}
        data['html_form'] = render_to_string(template,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


#get a list of images available that are not currently selected
def product_additional_images_store_add(request, product_id, store_id):
    data = dict()
    template = 'products/dialogs/product_additional_images-store_add.html'
    store_obj = get_object_or_404(OcStore, store_id=store_id)
    store_product_active_additional_obj = OcStoreProductImages.objects.select_related('image').filter(
        store_product__product_id=product_id).filter(store_product__store_id=store_id)
#get the list of active images
    if request.method == 'POST':
        #get the list of selected images
        selected_list = request.POST.getlist('check_images')
        store_product_id = request.POST.get('store_product_id')
        product_images_selected = OcProductImage.objects.filter(product_image_id__in=selected_list)
        last_image_order = store_product_active_additional_obj.order_by('-order_id').first().order_id
        if product_images_selected:
            for values in product_images_selected:
                new_additional_image = OcStoreProductImages()
                new_additional_image.store_product_id = store_product_id
                new_additional_image.image_id = values.product_image_id
                new_additional_image.order_id = last_image_order
                new_additional_image.alt_text = None
                new_additional_image.save()
                last_image_order += 1
        data['is_saved'] = True
        return JsonResponse(data)

    else:
        store_product_active_additional_obj = OcStoreProductImages.objects.select_related('image').filter(store_product__product_id=product_id).filter(store_product__store_id=store_id)
        store_product_id = store_product_active_additional_obj.first().store_product_id
        store_product_active_additional_defined = store_product_active_additional_obj.values_list('image_id')
        store_product_active_additional_list = list(chain(*store_product_active_additional_defined))
        store_product_additional_image_obj = OcProductImage.objects.filter(product_id=product_id).exclude(product_image_id__in=store_product_active_additional_list)
        context = {'store': store_obj,
                   'store_product_id': store_product_id,
                   'images_obj': store_product_additional_image_obj,
                   'product_id': product_id}
        return render_to_string(template, context, request=request)



def store_product_additional_images_delete_dlg(request, product_id, pk):
    data = dict()
    template = 'products/dialogs/product_additional_images-delete.html'
    store_product_additional_obj = OcStoreProductImages.objects.filter(pk=pk)

    context = {'pk': pk, 'product_id': product_id}
    data['html_form'] = render_to_string(template,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def store_product_additional_images_delete(request, product_id, pk):
    data = dict()

    if request.method == 'POST':
        store_product_additional_obj = OcStoreProductImages.objects.filter(pk=pk)
        store_product_additional_obj.delete()
        data['is_saved'] = True
    else:
        data['is_saved'] = False

    return JsonResponse(data)


def store_product_addional_image_store_edit(request, product_id, pk):
    data = dict()
    context = {'site_option_id': pk}
    template_name = 'products/dialogs/product_additional_images_store-edit.html/'

    if request.method == 'POST':
        form_obj = AdditionalProductStoreImages(request.POST)
        if form_obj.is_valid():
            form_instance = form_obj.instance
            store_image_id = request.POST.get('store_image_id')
            store_images_obj = get_object_or_404(OcStoreProductImages, pk=store_image_id)
            store_images_obj.alt_text = form_instance.alt_text
            store_images_obj.order_id = form_instance.order_id
            store_images_obj.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        store_images_obj = get_object_or_404(OcStoreProductImages, pk=pk)
        form_obj = AdditionalProductStoreImages(instance=store_images_obj)
        data['form_is_valid'] = False

    context['form'] = form_obj
    context['product_id'] = product_id
    context['pk'] = pk
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)



def test(request, pk, store_id):
    template_name = 'products/test.html';

    data = dict()
    context = {'product_id': pk}
    site_specific_data = dict()

    if request.method == 'POST':
        selected_list = request.POST.getlist('variant-select[]')
        store_id = request.POST.get('store_id')
        product_id = request.POST.get('product_id')
        # get the current variants first
        current_site_specific_variants = OcTsgProductVariants.objects.filter(prod_var_core__product_id=product_id,
                                                                             isdeleted=False) \
            .filter(store_id=store_id).values_list('prod_var_core_id')
        site_specific_variants_list = list(chain(*current_site_specific_variants))
        site_specific_variants_list_as_str = list(map(str, site_specific_variants_list))

        # create the add list
        add_list = list(map(int, set(selected_list) - set(site_specific_variants_list_as_str)))

        # now create the new records

        for addid in add_list:
            # check if it's already there bit hidden using the isdeleted flag
            obj_product_variants_deleted = OcTsgProductVariants.objects.filter(prod_var_core_id=addid,
                                                                               store_id=store_id)
            if obj_product_variants_deleted:
                obj_product_variants = obj_product_variants_deleted.first()
                obj_product_variants.isdeleted = False
                obj_product_variants.save()

            else:
                obj_product_variants = OcTsgProductVariants()
                obj_product_variant_core = get_object_or_404(OcTsgProductVariantCore, prod_variant_core_id=addid)
                obj_product_variants.prod_var_core_id = addid
                obj_product_variants.store_id = store_id
                obj_product_variants.variant_code = obj_product_variant_core.supplier_code
                obj_product_variants.variant_overide_price = 0.00
                obj_product_variants.isdeleted = False
                obj_product_variants.save()
                new_id = obj_product_variants.prod_variant_id
                product_variant_site_add_options(addid, new_id)

        # create the remove list
        removed_list = list(set(site_specific_variants_list_as_str) - set(selected_list))
        for outid in removed_list:
            obj_product_variant_site = OcTsgProductVariants.objects.filter(prod_var_core_id=outid, store_id=store_id)
            # check if this variant has even been quoted or ordered.  If so, we can't delete it, just set the delete flag to True
            row_product_variant_site = obj_product_variant_site.first()
            bl_delete = True
            if row_product_variant_site.order_product_variant:
                row_product_variant_site.isdeleted = True
                bl_delete = False

            if row_product_variant_site.quote_product_variant:
                row_product_variant_site.isdeleted = True
                bl_delete = False

            if bl_delete:
                obj_product_variant_site.delete()
            else:
                row_product_variant_site.save()

        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False


    store_obj = OcStore.objects.exclude(store_id=0)
    context['store_obj'] = store_obj

    context['first_store_id'] = store_id;
    context['product_id'] = pk;

    return render(request, template_name, context)

# def get_site_variants(product_id, store_id):

class Product_by_Store(generics.ListAPIView):
    serializer_class = ProductStoreListSerializer
    model = serializer_class.Meta.model

    def get_queryset(self, store_id=0):
        if self.kwargs['store_id']:
            store_id = self.kwargs['store_id']
        else:
            store_id = 0

        if store_id > 0:
            queryset = self.model.objects.filter(store_id=store_id)
        else:
            queryset = self.model.objects.all().order_by('product_id')

        return queryset.order_by('product_id')



#product options for adding to order
class ProductSiteVariantOptionClasses(viewsets.ModelViewSet):
    queryset = OcTsgProductVariantOptions.objects.all()
    serializer_class = ProductSiteVariantOptionsSerializer

    def retrieve(self, request, pk=None):
        option_group_object = OcTsgProductVariantOptions.objects.filter(product_variant_id=pk, isdeleted=False)
        serializer = self.get_serializer(option_group_object, many=True)
        return Response(serializer.data)