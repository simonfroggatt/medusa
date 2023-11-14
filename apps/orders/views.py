from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.template.loader import render_to_string
from .models import OcOrder, OcOrderProduct, OcOrderTotal, OcOrderFlags, OcTsgFlags, \
    calc_order_totals, OcTsgCourier, OcTsgOrderShipment, recalc_order_product_tax
from apps.products.models import OcTsgBulkdiscountGroups, OcTsgProductToBulkDiscounts, OcTsgProductMaterial
from .serializers import OrderListSerializer, OrderProductListSerializer, OrderTotalsSerializer, OrderPreviousProductListSerializer, OrderFlagsListSerializer
from pyreportjasper import PyReportJasper
from django.conf import settings
import os
from .forms import ProductEditForm, OrderBillingForm, OrderShippingForm, ProductAddForm, \
    OrderDetailsEditForm, OrderShippingChoiceEditForm, OrderShipItForm, OrderTaxChangeForm, \
    OrderDiscountForm
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from apps.products import services as prod_services
from apps.customer.models import OcCustomer, OcAddress, OcTsgCompany
from medusa.models import OcTsgShippingMethod
from django.core import serializers
from django.urls import reverse_lazy
from decimal import Decimal, ROUND_HALF_UP

from django.db.models import Sum

from apps.customer.serializers import AddressSerializer

from collections import OrderedDict

class Orders2(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    queryset = OcOrder.objects.all()
    serializer_class = OrderListSerializer

    def list(self, request):
        queryset = OcOrder.objects.all()
        serializer = OrderListSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = OcOrder.objects.all()
        order_products = queryset.objects.filter(store_id=pk)
        serializer = self.get_serializer(order_products, many=True)
        return Response(serializer.data)


def order_test(request, order_id):
    order_obj = OcOrder.objects.days_since()
    fred = 'hello'

def order_list(request):
    template_name = 'orders/orders_list.html'
    context = {'pageview': 'All Orders'}
    return render(request, template_name, context)

class Orders_asJSON(viewsets.ModelViewSet):
    queryset = OcOrder.objects.all()
    serializer_class = OrderListSerializer

    def retrieve(self, request, pk=None):
        order_products = OcOrder.objects.filter(store_id=pk)
        serializer = self.get_serializer(order_products, many=True)
        return Response(serializer.data)


class Orders_Company(viewsets.ModelViewSet):
    queryset = OcOrder.objects.all().order_by('-order_id')
    serializer_class = OrderListSerializer

    def retrieve(self, request, pk=None):
        #companyobj = OcTsgCompany.objects.filter(company_id=pk)
        order_list = OcOrder.objects.filter(customer__parent_company__company_id=pk).order_by('-order_id')
        #order_list = OcOrder.objects.filter(=pk).order_by('-order_id')
        serializer = self.get_serializer(order_list, many=True)
        return Response(serializer.data)


class Orders_Customer(viewsets.ModelViewSet):
    queryset = OcOrder.objects.all()
    serializer_class = OrderListSerializer

    def retrieve(self, request, pk=None):
        order_products = OcOrder.objects.filter(customer_id=pk).order_by('-order_id')
        serializer = self.get_serializer(order_products, many=True)
        return Response(serializer.data)



class Orders_Products_asJSON(viewsets.ModelViewSet):
    queryset = OcOrderProduct.objects.all()
    serializer_class = OrderProductListSerializer

    def retrieve(self, request, pk=None):
        order_products = OcOrderProduct.objects.filter(order__order_id=pk)
        serializer = self.get_serializer(order_products, many=True)
        return Response(serializer.data)


class Previous_Products_asJSON(viewsets.ModelViewSet):
    queryset = OcOrderProduct.objects.all()
    serializer_class = OrderPreviousProductListSerializer

    def retrieve(self, request, pk=None):
        previous_products = OcOrderProduct.objects.filter(order__customer_id=pk).order_by('-order_id')
        serializer = self.get_serializer(previous_products, many=True)
        return Response(serializer.data)


class Order_Flags_asJSON(viewsets.ModelViewSet):
        queryset = OcOrderFlags.objects.all()
        serializer_class = OrderFlagsListSerializer



class OrderListView(generics.ListAPIView):
    queryset = OcOrder.objects.all().order_by('-order_id')
    serializer_class = OrderListSerializer

    def post(self, request, *args, **kwargs):
        customer_id = int(self.request.query_params.get('customer_id', 0))
        if customer_id > 0:
            queryset = OcOrder.objects.filter(customer_id=customer_id).order_by('-order_id')
            orders = self.get_serializer(queryset, many=True)
            return Response(orders.data)
        else:
            company_id = int(self.request.query_params.get('company_id', 0))
            if company_id > 0:
                queryset = OcOrder.objects.filter(customer__parent_company=company_id).order_by('-order_id')
                orders = self.get_serializer(queryset, many=True)
                return Response(orders.data)

        return self.list(request, *args, **kwargs)





class OrderTotalsViewSet(viewsets.ModelViewSet):
    queryset = OcOrderTotal.objects.all()
    serializer_class = OrderTotalsSerializer

    def retrieve(self, request, pk=None):
        order_totals = OcOrderTotal.objects.filter(order__order_id=pk)
        serializer = self.get_serializer(order_totals, many=True)
        return Response(serializer.data)




def order_details(request, order_id):
    order_obj = get_object_or_404(OcOrder, pk=order_id)

    context = {"order_obj": order_obj}
    if order_obj.customer_id > 0:
        context["addressItem"] = order_obj.customer.address_customer.all().order_by('postcode')
    else:
        context["addressItem"] = []

    #order_obj.orderflags.all()


    nav_dict = dict()
    nav_dict['has_nav'] = True
    nav_dict['label'] = "Order"
    product_flags = OcOrderProduct.objects.select_related('status').filter(order=order_id, status__is_flag=1).order_by('status__order_by').values('status__icon_path','status__name').distinct()

    try:
        next_order_id = order_obj.get_next_by_date_added().pk
        nav_dict["next_url"] = reverse_lazy('order_details', kwargs={'order_id': next_order_id})

    except:
        nav_dict["next_url"] = ""

    try:
        previous_order_id = order_obj.get_previous_by_date_added().pk
        nav_dict["previous_url"] = reverse_lazy('order_details', kwargs={'order_id': previous_order_id})
    except:
        nav_dict["previous_url"] = ""

    context["nav_data"] = nav_dict
    context["orderFlags"] = order_obj.orderflags.all()
    context["productFlags"] = product_flags

    shipping_obj = OcTsgOrderShipment.objects.filter(order_id=order_id).order_by('-date_added')
    context["shippingObj"] = shipping_obj

    template_name = 'orders/order_layout.html'


    context['pageview'] = 'All orders'
    context['pageview_url'] = reverse_lazy('allorders')
    context['heading'] = 'order details'

    order_products_obj = OcOrderProduct.objects.filter(order_id=order_id)
    order_lines = order_products_obj.count()
    product_count = order_products_obj.aggregate(Sum('quantity'))
    context['order_lines'] = order_lines
    context['order_product_count'] = product_count['quantity__sum']


    return render(request, template_name, context)


def get_order_addresses(request, order_id):
    data = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)

    context = {"order_obj": order_obj}
    data['html_billing_address'] = render_to_string('orders/sub_layout/billing_address_ajax.html',
                                            context,
                                            request=request
                                            )
    data['html_shipping_address'] = render_to_string('orders/sub_layout/shipping_address_ajax.html',
                                                    context,
                                                    request=request
                                                    )

    return JsonResponse(data)

def get_order_details(request, order_id):
    data = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)

    context = {"order_obj": order_obj}
    shipping_obj = OcTsgOrderShipment.objects.filter(order_id=order_id).order_by('-date_added')
    context["shippingObj"] = shipping_obj


    data['html_order_details'] = render_to_string('orders/sub_layout/order_details.html',
                                            context,
                                            request=request
                                            )

    data['html_comment'] = order_obj.comment


    return JsonResponse(data)

def order_add_product(request, order_id):
    data = dict()
    if request.method == 'POST':
        form = ProductAddForm(request.POST)
        if form.is_valid():
            order_product = form.save(commit=False)
            order_product.reward = 0
            order_product.save()
            calc_order_totals(order_id)
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    form = ProductAddForm()
    order_data = OcOrder.objects.filter(order_id=order_id).values('tax_rate__rate', 'customer_id').first()
    context = {
        "order_id": order_id,
        "tax_rate": order_data['tax_rate__rate'],
        "customer_id": order_data['customer_id'],
        "form_post_url": reverse_lazy('orderproductadd', kwargs={'order_id': order_id}),
        "price_for": "I",  #
        "form" : form}

    template_name = 'orders/dialogs/add_product_layout_dlg.html'
    #template_name = 'orders/dialogs/add_product_layout.html'
    context['pageview'] = 'All orders'
    context['heading'] = 'order details'

    qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)
    default_bulk = 1

    bulk_details = prod_services.create_bulk_arrays(qs_bulk)
    context['bulk_info'] = bulk_details

    context['material_obj'] = OcTsgProductMaterial.objects.all()

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


    #this will render to dlg when finished
    #return render(request, template_name, context)


def order_details_edit(request, order_id):
    data = dict()
    order_details_obj = get_object_or_404(OcOrder, pk=order_id)

    if request.method == 'POST':
        form = OrderDetailsEditForm(request.POST, instance=order_details_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            order_details_obj.save()
        else:
            data['form_is_valid'] = False

    else:
        form = OrderDetailsEditForm(instance=order_details_obj)

    template_name = 'orders/dialogs/order_details_edit.html'

    context = {'order_id': order_id,
               'form': form}

    data['html_form'] = render_to_string(template_name,
        context,
        request = request
    )

    return JsonResponse(data)


def order_shipping_change(request, order_id):
    data = dict()
    shipping_obj = OcTsgShippingMethod.objects.filter(status=1)
    order_totals_obj = OcOrderTotal.objects.filter(order_id=order_id).filter(code='shipping').first()

    if request.method == 'POST':
        form = OrderShippingChoiceEditForm(request.POST, instance=order_totals_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            order_totals_obj.save()
            calc_order_totals(order_id)
        else:
            data['form_is_valid'] = False

    else:
        form = OrderShippingChoiceEditForm(instance=order_totals_obj)

    template_name = 'orders/dialogs/update_shipping_choice.html'
    shipping_vals = serializers.serialize('json', shipping_obj)

    context = {'order_id': order_id,
               'form': form,
               'shipping_methods': shipping_obj,
               'shipping_vals': shipping_vals}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def order_ship_it(request, order_id):
    data = dict()
    order_details_obj = get_object_or_404(OcOrder, pk=order_id)

    courier_obj = OcTsgCourier.objects.all()

    if request.method == 'POST':
        form = OrderShipItForm(request.POST)
        if form.is_valid():
            form_instance = form.instance
            form_instance.order_id = request.POST.get('order_id')
            form_instance.tracking_number = request.POST.get('tracking_number')
            form_instance.shipping_courier_method = request.POST.get('chosen_courier_option')
            form_instance.shipping_courier_id = request.POST.get('chosen_courier')
            form_instance.shipping_status_id = 1
            form_instance.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    else:
        form = OrderShipItForm()

    template_name = 'orders/dialogs/ship_order.html'

    context = {'order_id': order_id,
               'order_obj':order_details_obj,
               'form': form,
               'couriers': courier_obj}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)



def order_product_edit(request, order_id, order_product_id):
    data = dict()
    order_product = get_object_or_404(OcOrderProduct, pk=order_product_id)
    if request.method == 'POST':
        form = ProductEditForm(request.POST, instance=order_product)
        if form.is_valid():
            data['form_is_valid'] = True
            order_product.save()
            calc_order_totals(order_id)
            # - call come othere function like reloading the tablecustomer_update_detault_address(address)
        else:
            data['form_is_valid'] = False

    else:
        form = ProductEditForm(instance=order_product)
        form.fields['order_id'] = order_id

    template_name = 'orders/dialogs/order_product_edit.html'
    store_id = order_product.order.store_id

    if order_product.product_id > 0:
        qs_product_bulk = OcTsgProductToBulkDiscounts.objects.get(product__product_id=order_product.product_id, store_id=store_id)
        default_bulk = qs_product_bulk.bulk_discount_group.bulk_group_id
        qs_bulk = OcTsgBulkdiscountGroups.objects.filter(bulk_group_id=qs_product_bulk.bulk_discount_group.bulk_group_id)
    else:
        qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)
        default_bulk = 1

    bulk_details = prod_services.create_bulk_arrays(qs_bulk)
    order_data = OcOrder.objects.filter(order_id=order_id).values('tax_rate__rate').first()

    context = {'order_id': order_id,
               'order_product_id': order_product_id,
               'form': form,
               'bulk_info': bulk_details,
               "tax_rate": order_data['tax_rate__rate'],
               'default_bulk': default_bulk,
               "form_post_url": reverse_lazy('orderproductedit', kwargs={'order_id': order_id, 'order_product_id': order_product_id}),
               "price_for": "I",  #
               }

    #return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def order_product_delete(request, order_id, order_product_id):
        data = dict()
        order_product = get_object_or_404(OcOrderProduct, pk=order_product_id, order_id=order_id)
        if request.method == 'POST':
            data['form_is_valid'] = True
            order_product.delete()

        template_name = 'orders/dialogs/delete_product.html'
        context = {'order_product_id': order_product_id,
                   'order_id': order_id}

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
        return JsonResponse(data)


def order_billing_edit(request, order_id):
    data = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    if request.method == 'POST':
        form = OrderBillingForm(request.POST, instance=order_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            add_address = form.data['add_address']
            if int(add_address) == 1:
                address_data = dict()
                address_data['customer_id'] = form.data['order_customer_id']
                address_data['fullname'] = form.data['payment_fullname']
                address_data['company'] = form.data['payment_company']
                address_data['email'] = form.data['payment_email']
                address_data['telephone'] = form.data['payment_telephone']
                address_data['address_1'] = form.data['payment_address_1']
                address_data['city'] = form.data['payment_city']
                address_data['area'] = form.data['payment_area']
                address_data['postcode'] = form.data['payment_postcode']
                address_data['country_id'] = form.data['payment_country_name']
                address_data['country'] = form.data['payment_country']
                add_customer_address(address_data)

            order_obj.save()
        else:
            data['form_is_valid'] = False

    else:
        form = OrderBillingForm(instance=order_obj)
        form.fields['order_id'] = order_id


    template_name = 'orders/dialogs/order_billing_edit.html'
    context = {'order_id': order_id,
               'form': form}

    if order_obj.customer:
        context['order_customer_id'] = order_obj.customer_id
    else:
        context['order_customer_id'] = 0;

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def order_shipping_edit(request, order_id):
    data = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    if request.method == 'POST':
        form = OrderShippingForm(request.POST, instance=order_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            add_address = form.data['add_address']
            if int(add_address) == 1:
                address_data = dict()
                address_data['customer_id'] = form.data['order_customer_id']
                address_data['fullname'] = form.data['shipping_fullname']
                address_data['company'] = form.data['shipping_company']
                address_data['email'] = form.data['shipping_email']
                address_data['telephone'] = form.data['shipping_telephone']
                address_data['address_1'] = form.data['shipping_address_1']
                address_data['city'] = form.data['shipping_city']
                address_data['area'] = form.data['shipping_area']
                address_data['postcode'] = form.data['shipping_postcode']
                address_data['country_id'] = form.data['shipping_country_name']
                address_data['country'] = form.data['shipping_country']
                add_customer_address(address_data)

            order_obj.save()
        else:
            data['form_is_valid'] = False

    else:
        form = OrderShippingForm(instance=order_obj)
        form.fields['order_id'] = order_id

    template_name = 'orders/dialogs/order_shipping_edit.html'
    context = {'order_id': order_id,
               'form': form}

    if order_obj.customer:
        context['order_customer_id'] = order_obj.customer_id
    else:
        context['order_customer_id'] = 0;

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def order_shipping_search(request, order_id):
    data = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    context = {'order_id': order_id}
    if order_obj.customer:
        context['order_customer_id'] = order_obj.customer_id
    else:
        context['order_customer_id'] = 0;


    template_name = 'orders/dialogs/order_shipping_search.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def add_customer_address(address_data):
    customer_id = address_data['customer_id']
    address_obj = OcAddress()
    address_obj.customer_id = address_data['customer_id']
    address_obj.fullname = address_data['fullname']
    address_obj.company = address_data['company']
    address_obj.email = address_data['email']
    address_obj.telephone = address_data['telephone']
    address_obj.address_1 = address_data['address_1']
    address_obj.city = address_data['city']
    address_obj.area = address_data['area']
    address_obj.postcode = address_data['postcode']
    address_obj.country_id = address_data['country_id']
    is_valid = address_obj.save()
    return is_valid


def update_order_billing_from_address_book(request, order_id):
    data = dict()
    if request.method == 'POST':
        address_book_id = int(request.POST.get('address_book_id_billing', 0))
        if address_book_id > 0:
            order_obj = get_object_or_404(OcOrder, pk=order_id)
            address_obj = get_object_or_404(OcAddress, pk=address_book_id)
            order_obj.payment_fullname = address_obj.fullname
            order_obj.payment_company = address_obj.company
            order_obj.payment_email = address_obj.email
            order_obj.payment_telephone = address_obj.telephone
            order_obj.payment_address_1 = address_obj.address_1
            order_obj.payment_city = address_obj.city
            order_obj.payment_area = address_obj.area
            order_obj.payment_postcode = address_obj.postcode
            order_obj.payment_country_id = address_obj.country_id
            order_obj.save()


    data['is_valid'] = True
    return JsonResponse(data)


def update_order_shipping_from_address_book(request, order_id):
    data = dict()
    if request.method == 'POST':
        address_book_id = int(request.POST.get('address_book_id_shipping', 0))
        if address_book_id > 0:
            order_obj = get_object_or_404(OcOrder, pk=order_id)
            address_obj = get_object_or_404(OcAddress, pk=address_book_id)
            order_obj.shipping_fullname = address_obj.fullname
            order_obj.shipping_company = address_obj.company
            order_obj.shipping_email = address_obj.email
            order_obj.shipping_telephone = address_obj.telephone
            order_obj.shipping_address_1 = address_obj.address_1
            order_obj.shipping_city = address_obj.city
            order_obj.shipping_area = address_obj.area
            order_obj.shipping_postcode = address_obj.postcode
            order_obj.shipping_country_id = address_obj.country_id
            order_obj.save()


    data['is_valid'] = True
    return JsonResponse(data)


def order_delete_dlg(request, order_id):
        data = dict()

        template_name = 'orders/dialogs/delete_order.html'
        context = {'order_id': order_id}

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
        return JsonResponse(data)


def order_delete(request):
    data = dict()
    data['form_is_valid'] = False

    if request.method == 'POST':
        order_id = request.POST.get('order_id')
        order_obj = get_object_or_404(OcOrder, pk=order_id)
        order_obj.delete()
        data['redirect_url'] = reverse_lazy('allorders')
        data['form_is_valid'] = True

    return JsonResponse(data)

def tax_change_dlg(request, order_id):
    data = dict()
    order_details_obj = get_object_or_404(OcOrder, pk=order_id)

    if request.method == 'POST':
        form = OrderTaxChangeForm(request.POST, instance=order_details_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            order_details_obj.save()
            recalc_order_product_tax(order_id)
        else:
            data['form_is_valid'] = False

    else:
        form = OrderTaxChangeForm(instance=order_details_obj)

    template_name = 'orders/dialogs/order_tax_change.html'

    context = {'order_id': order_id,
               'form': form}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def discount_change_dlg(request, order_id):
    data = dict()
    order_totals_obj = OcOrderTotal.objects.filter(order_id=order_id)
    order_subtotal_qs = order_totals_obj.filter(code='sub_total')  # sort order 3
    if order_subtotal_qs:
        order_subtotal = Decimal(order_subtotal_qs.first().value.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
    else:
        order_subtotal = 0

    order_discount_qs = order_totals_obj.filter(code='discount')  # sort order 3
    if order_discount_qs:
        order_discount_value = Decimal(order_discount_qs.first().value.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
    else:
        order_discount_value = 0

    if request.method == 'POST':
        discount_value = request.POST.get('by_value')
        order_discount_qs = order_totals_obj.filter(code='discount')  # sort order 3
        if order_discount_qs:
            order_discount_qs.first().value = discount_value
            order_discount_qs.first().save()
            calc_order_totals(order_id)
            data['form_is_valid'] = True
        else:
            order_total_discount_obj = OcOrderTotal()
            order_total_discount_obj.order_id = order_id
            order_total_discount_obj.code = 'discount'
            order_total_discount_obj.title = 'Discount'
            order_total_discount_obj.value = discount_value
            order_total_discount_obj.sort_order = 2
            order_total_discount_obj.save()
            data['form_is_valid'] = True
            calc_order_totals(order_id)



    template_name = 'orders/dialogs/order_discount_change.html'

    context = {'order_id': order_id,
               'subtotal': order_subtotal,
               'discount_value': order_discount_value}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def get_order_product_text(request):
    data = dict()
    order_id = request.GET.get('order_id')
    order_products_obj = OcOrderProduct.objects.filter(order_id=order_id)
    order_lines = order_products_obj.count()
    product_count = order_products_obj.aggregate(Sum('quantity'))
    data['order_lines'] = order_lines
    data['order_product_count'] = product_count['quantity__sum']
    return JsonResponse(data)


def get_order_shipping_addresses(request, order_id):
    if request.method == 'GET':
        order_details_obj = get_object_or_404(OcOrder, pk=order_id)
        customer_id = order_details_obj.customer_id
        customer_address_book = OcAddress.objects.all()
       # customer_address_book = OcAddress.objects.filter(customer_id=customer_id)
       # variant_list = OcTsgProductVariants.objects.filter(store_id=store_id, prod_var_core__product__product_id=product_id)
        # serializer = get_serializer(customer_address_book, many=True)
        address_serialiser  = AddressSerializer(customer_address_book, many=True)
        return JsonResponse(address_serialiser.data, safe=False)




class OrderShippingAddressList(viewsets.ModelViewSet):
    #queryset = OcAddress.objects.filter(customer_id=2)
    queryset = OcAddress.objects.all()
    serializer_class = AddressSerializer


    def retrieve(self, request, pk=None):
        order_obj = get_object_or_404(OcOrder, pk=pk)
        customer_id = order_obj.customer_id
        queryset = OcAddress.objects.filter(customer_id=customer_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


def order_duplicate_dlg(request, order_id):
        data = dict()

        template_name = 'orders/dialogs/duplicate_order.html'
        context = {'order_id': order_id}

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
        return JsonResponse(data)

def order_duplicate(request):
    data = dict()
    data['form_is_valid'] = False

    if request.method == 'POST':
        order_id = request.POST.get('order_id')
        order_obj = get_object_or_404(OcOrder, pk=order_id)
        order_products = OcOrderProduct.objects.filter(order_id=order_id)
        order_totals = OcOrderTotal.objects.filter(order_id=order_id)
        #order_products = order_obj.order_products.all()
        #order_totals = order_obj.order_totals.all()
        order_obj.order_id = None
        order_obj.save()
        order_obj.payment_method = ''
        order_obj.order_status_id = 1
        order_obj.payment_status_id = 1
        order_obj.order_type_id = 1
        order_obj.payment_method_rel_id = 8
        order_obj.customer_order_ref = ''
        order_obj.save()
        new_order_id = order_obj.order_id

#products
        for order_prod in order_products:
            order_prod.order_product_id = None;
            order_prod.order_id = new_order_id
            order_prod.status_id = 1
            order_prod.save()

#totals
        for order_total in order_totals:
            order_total.order_total_id = None
            order_total.order_id = new_order_id
            order_total.save()

        data['redirect_url'] = reverse_lazy('order_details', kwargs={'order_id': new_order_id})
        data['form_is_valid'] = True

    return JsonResponse(data)


# from django.db import models
#
# class Book(models.Model)
#
# class Chapter(models.Model)
#     book = models.ForeignKey(Book, related_name='chapters')
#
# class Page(models.Model)
#     chapter = models.ForeignKey(Chapter, related_name='pages')
#
# WHITELIST = ['books', 'chapters', 'pages']
# original_record = models.Book.objects.get(pk=1)
# duplicate_record = duplicate_model_with_descendants(original_record, WHITELIST)

def duplicate_model_with_descendants(obj, whitelist, _new_parent_pk=None):
    kwargs = {}
    children_to_clone = OrderedDict()
    for field in obj._meta.get_fields():
        if field.name == "id":
            pass
        elif field.one_to_many:
            if field.name in whitelist:
                these_children = list(getattr(obj, field.name).all())
                if field.name in children_to_clone:
                    children_to_clone[field.name] |= these_children
                else:
                    children_to_clone[field.name] = these_children
            else:
                pass
        elif field.many_to_one:
            if _new_parent_pk:
                kwargs[field.name + '_id'] = _new_parent_pk
        elif field.concrete:
            kwargs[field.name] = getattr(obj, field.name)
        else:
            pass
    new_instance = obj.__class__(**kwargs)
    new_instance.save()
    new_instance_pk = new_instance.pk
    for ky in children_to_clone.keys():
        child_collection = getattr(new_instance, ky)
        for child in children_to_clone[ky]:
            child_collection.add(duplicate_model_with_descendants(child, whitelist=whitelist, _new_parent_pk=new_instance_pk))
    return new_instance
