from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from .models import OcProduct, OcProductDescription, OcProductDescriptionBase, OcTsgProductVariantCore, OcTsgProductVariantOptions, OcTsgDepOptionClass, OcTsgProductVariants
from .serializers import ProductListSerializer, CoreVariantSerializer, ProductVariantSerializer, StoreCoreProductVariantSerialize #, BaseProductListSerializer, ProductTestSerializer
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.template.loader import render_to_string


# Create your views here.



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
    template_name = 'products/product-layout.html'

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
    data = dict()
    #variant_options = get_object_or_404(OcTsgProductVariantOptions, product_variant_id=core_variant_id)
    variant_options = OcTsgProductVariantOptions.objects.all().filter(product_variant_id=core_variant_id)
    template_name = 'products/variant-options.html'
    context = {'core_variant_id': core_variant_id}
    context['variant_options'] = variant_options

    #data['variant_list'] = render_to_string(template_name, context, request=request)
    #return JsonResponse(data)
    return render(request, template_name, context)


def core_variant_options_class(request, core_variant_id):
    data = dict()
    #variant_options = get_object_or_404(OcTsgProductVariantOptions, product_variant_id=core_variant_id)
    variant_options = OcTsgDepOptionClass.objects.all().filter(optionclass__product_variant_id=core_variant_id, store_id=1).order_by('order_by')
    template_name = 'products/variant-options.html'
    context = {'core_variant_id': core_variant_id}
    context['variant_options'] = variant_options

    #data['variant_list'] = render_to_string(template_name, context, request=request)
    #return JsonResponse(data)
    return render(request, template_name, context)




