from django.contrib import messages
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.template.loader import render_to_string

from .models import OcOrder, OcOrderProduct, OcOrderTotal, OcOrderFlags, OcTsgFlags, \
     OcTsgCourier, OcTsgOrderShipment, OcTsgOrderProductStatusHistory, OcTsgOrderDocuments, OcTsgOrderProductOptions, \
     OcTsgOrderOption, OcOrderHistory, OcTsgPaymentHistory, OcTsgOrderBespokeImage#,calc_order_totals, recalc_order_product_tax
from apps.products.models import OcTsgBulkdiscountGroups, OcProduct, \
     OcTsgProductVariantCore, OcTsgProductVariants
from apps.pricing.models import OcTsgProductMaterial
from apps.options.models import (OcTsgProductVariantOptions, OcTsgOptionClass, OcTsgOptionValues, \
    OcTsgOptionValueDynamics, OcTsgProductOptionValues, OcTsgProductOption, OcOptionValues)
from apps.pricing.models import OcTsgSizeMaterialComb, OcTsgSizeMaterialCombPrices
from .serializers import OrderListSerializer, OrderProductListSerializer, OrderTotalsSerializer, \
    OrderPreviousProductListSerializer, OrderFlagsListSerializer, OrderProductStatusHistorySerializer, \
    CustomerPreviousOrdersSerializer
from django.conf import settings
import os
import json
from .forms import ProductEditForm, OrderBillingForm, OrderShippingForm, ProductAddForm, \
    OrderDetailsEditForm, OrderShippingChoiceEditForm, OrderShipItForm, OrderTaxChangeForm, \
    OrderDiscountForm, OrderDocumentForm

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse
from apps.products import services as prod_services
from apps.customer.models import OcCustomer, OcAddress, OcTsgCompany
from apps.shipping.models import OcTsgShippingMethod
from apps.emails.views import send_invoice_email, send_shipped_email
from django.core import serializers
from django.urls import reverse_lazy
from decimal import Decimal, ROUND_HALF_UP

from django.db.models import Sum
from medusa import services
import operator
import hashlib
import uuid

from apps.returns.models import OcTsgReturnOrder

from apps.customer.serializers import AddressSerializer

from collections import OrderedDict
from itertools import chain
from cryptography.fernet import Fernet
import re

from ..symbols.models import OcTsgSymbols
import logging
logger = logging.getLogger('apps')


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
    context = {'heading': 'All Orders'}
    context['order_status'] = 'ALL'
    return render(request, template_name, context)


def live_order_list(request):
    template_name = 'orders/orders_list.html'
    context = {'heading': 'Live Orders'}
    breadcrumbs = []
    context['breadcrumbs'] = breadcrumbs
    context['order_status'] = 'LIVE'
    return render(request, template_name, context)

def new_order_list(request):
    template_name = 'orders/orders_list.html'
    context = {'heading': 'New Orders'}
    context['order_status'] = 'NEW'
    return render(request, template_name, context)


def failed_order_list(request):
    template_name = 'orders/orders_list.html'
    context = {'heading': 'Failed Orders'}
    context['order_status'] = 'FAILED'
    return render(request, template_name, context)

def legacy_order_list(request):
    template_name = 'orders/orders_list.html'
    context = {'heading': 'Legacy Orders'}
    context['order_status'] = 'LEGACY'
    return render(request, template_name, context)


class Orders_asJSON(viewsets.ModelViewSet):
    queryset = OcOrder.objects.all()
    serializer_class = OrderListSerializer
    model = serializer_class.Meta.model



    def get_queryset(self):
        valid_status = [2, 3]
        status = self.request.GET.get('status', 'ALL')
        if status == 'LIVE':
            queryset = self.model.objects.live()
        elif status == 'NEW':
            queryset = self.model.objects.new()
        elif status == 'FAILED':
            queryset = self.model.objects.failed()
        elif status == 'LEGACY':
            queryset = self.model.objects.legacy()
        else:
            queryset = self.model.objects.all()
        return queryset


class Orders_Company(viewsets.ModelViewSet):
    queryset = OcOrder.objects.all()
    serializer_class = CustomerPreviousOrdersSerializer
    model = serializer_class.Meta.model

    def get_queryset(self, *args, **kwargs):
        company_id = self.request.GET.get('company_id')
        return self.model.objects.filter(customer__parent_company__company_id=company_id).order_by('-order_id')



class Orders_Customer(viewsets.ModelViewSet):
    queryset = OcOrder.objects.all()
    serializer_class = CustomerPreviousOrdersSerializer
    model = serializer_class.Meta.model

    def get_queryset(self, *args, **kwargs):
        customer_id = self.request.GET.get('customer_id')
        return self.model.objects.filter(customer_id=customer_id).order_by('-order_id')



class Orders_Products_asJSON(viewsets.ModelViewSet):
    queryset = OcOrderProduct.objects.all()
    serializer_class = OrderProductListSerializer

    def retrieve(self, request, pk=None):
        order_products = OcOrderProduct.objects.filter(order__order_id=pk)
        serializer = self.get_serializer(order_products, many=True)
        return Response(serializer.data)

class Previous_Products_asJSON(viewsets.ModelViewSet):
    queryset = OcOrderProduct.objects.none()
    serializer_class = OrderPreviousProductListSerializer

    def get_queryset(self, *args, **kwargs):
        customer_id = self.request.GET.get('customer_id')
        #get all the products if part of a company
        if customer_id is not None:
            customer_obj = get_object_or_404(OcCustomer, pk=customer_id)
            if customer_obj.parent_company:
                parent_company_id = customer_obj.parent_company_id
                #filter on this instead
                return_obj = OcOrderProduct.objects.select_related('order').filter(order__customer__parent_company_id=parent_company_id)
        else:
            return_obj = OcOrderProduct.objects.select_related('order').filter(order__customer_id=customer_id).order_by('-order_id')  # optional performance cap
        return return_obj


class _old_Previous_Products_asJSON(viewsets.ModelViewSet):
    queryset = OcOrderProduct.objects.none()
    serializer_class = OrderPreviousProductListSerializer

    def get_queryset(self):
        customer_id = self.kwargs.get('pk')  # taken from URL
        return (
            OcOrderProduct.objects
            .select_related('order')  # optimize DB hit
            .filter(order__customer_id=customer_id)
            .order_by('-order_id')[:100]  # optional performance cap
        )

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
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


class OrderProductHistory(viewsets.ModelViewSet):
    queryset = OcTsgOrderProductStatusHistory.objects.all().order_by('-date_added')
    serializer_class = OrderProductStatusHistorySerializer

    def retrieve(self, request, pk=None):
        history_obj = OcTsgOrderProductStatusHistory.objects.filter(order_product_id=pk)
        serializer = self.get_serializer(history_obj, many=True)
        return Response(serializer.data)


class customer_orders(viewsets.ModelViewSet):

    queryset = OcOrder.objects.all().order_by('-order_id');
    serializer_class = CustomerPreviousOrdersSerializer

    def list(self, request, *args, **kwargs):
        customer_id = kwargs['customer_id']
        if customer_id is not None:
            queryset = OcOrder.objects.filter(customer_id=customer_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response([])


def order_details(request, order_id):
    breadcrumbs = []
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    context = {"order_obj": order_obj}
    context['heading'] = 'order details'


    if order_obj.customer:
        #see if they have a company
        if order_obj.customer.parent_company:
            company_id = order_obj.customer.parent_company.company_id
            #get all the address books for this company
            context["addressItem"] = OcAddress.objects.filter(customer__parent_company=company_id).order_by('postcode')
        else:
            context["addressItem"] = order_obj.customer.address_customer.all().order_by('postcode')
    else:
        context["addressItem"] = []

    #order_obj.orderflags.all()
    order_type = order_obj.get_order_status()


    nav_dict = dict()
    nav_dict['has_nav'] = True
    nav_dict['label'] = "Order"
    product_flags = OcOrderProduct.objects.select_related('status').filter(order=order_id, status__is_flag=1).order_by('status__order_by').values('status__icon_path','status__name').distinct()

    if order_type == 'LIVE':
        context['order_status'] = 'LIVE'
        order_obj_status = OcOrder.objects.live()
        breadcrumbs.append({'name': 'LIVE Orders', 'url': reverse_lazy('liveorders')})
    elif order_type == 'NEW':
        context['order_status'] = 'NEW'
        order_obj_status = OcOrder.objects.new()
        breadcrumbs.append({'name': 'NEW Orders', 'url': reverse_lazy('neworders')})
    elif order_type == 'FAILED':
        breadcrumbs.append({'name': 'Orders'})
        context['order_status'] = 'FAILED'
        breadcrumbs.append({'name': 'FAILED Orders', 'url': reverse_lazy('failedorders')})
    elif order_type == 'LEGACY':
        breadcrumbs.append({'name': 'Orders'})
        context['order_status'] = 'LEGACY'
        breadcrumbs.append({'name': 'LEGACY Orders', 'url': reverse_lazy('legacyorders')})
    else:
        context['order_status'] = 'ALL'
        order_obj_status = OcOrder.objects.all()
        breadcrumbs.append({'name': 'ALL Orders', 'url': reverse_lazy('allorders')})

    try:
        next_order_id = order_obj_status.filter(order_id__gt=order_id).order_by('order_id').first().pk
        nav_dict["next_url"] = reverse_lazy('order_details', kwargs={'order_id': next_order_id})
    except:
        nav_dict["next_url"] = ""

    try:
        previous_order_id = order_obj_status.filter(order_id__lt=order_id).order_by('-order_id').first().pk
        nav_dict["previous_url"] = reverse_lazy('order_details', kwargs={'order_id': previous_order_id})
    except:
        nav_dict["previous_url"] = ""

    context['breadcrumbs'] = breadcrumbs

    context["nav_data"] = nav_dict
    context["orderFlags"] = order_obj.orderflags.all()
    context["productFlags"] = product_flags

    shipping_obj = OcTsgOrderShipment.objects.filter(order_id=order_id).order_by('-date_added')
    context["shippingObj"] = shipping_obj

    template_name = 'orders/order_layout.html'



    order_products_obj = OcOrderProduct.objects.filter(order_id=order_id)
    order_lines = order_products_obj.count()
    product_count = order_products_obj.aggregate(Sum('quantity'))
    context['order_lines'] = order_lines
    context['order_product_count'] = product_count['quantity__sum']

    #add in the simple document form for uploads
    docform_initials = {'order': order_obj}
    docform = OrderDocumentForm(initial=docform_initials)
    context['docform'] = docform

    #and fetch any exisiting documents
    order_docs_obj = OcTsgOrderDocuments.objects.filter(order_id=order_id)
    context['order_docs_obj'] = order_docs_obj
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE

    context['order_history'] = OcOrderHistory.objects.filter(order_id=order_id).order_by('-date_added')
    context['payment_history'] = OcTsgPaymentHistory.objects.filter(order_id=order_id).order_by('-date_added')



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


def get_order_flags(request, order_id):
    data = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)

    context = {"order_obj": order_obj}
    context["orderFlags"] = order_obj.orderflags.all()
    product_flags = OcOrderProduct.objects.select_related('status').filter(order=order_id, status__is_flag=1).order_by(
        'status__order_by').values('status__icon_path', 'status__name').distinct()

    context["orderFlags"] = order_obj.orderflags.all()
    context["productFlags"] = product_flags
    data['html_order_flags'] = render_to_string('orders/sub_layout/order_flags.html',
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
            order_product_id = order_product.order_product_id
            set_product_options_and_variant_options(request.POST, order_id, order_product_id, order_product.product_id)
            calculate_order_total(order_id)
            data['form_is_valid'] = True
        else:
            logger.debug(f"order_add_product - form not valid = {form.errors}")
            logger.debug(f"order_add_product - form errors (dict) = {form.errors.as_data()}")
            logger.debug(f"order_add_product - form errors (clean) = {form.errors.get_json_data()}")
            data['form_is_valid'] = False

    form = ProductAddForm()
    order_obj = get_object_or_404(OcOrder, order_id=order_id)

#find out if this orders customer is a company with a discount
    customer_discount = 0
    if order_obj.customer:
        if order_obj.customer.parent_company:
            customer_discount = order_obj.customer.parent_company.discount
        else:
            customer_discount = 0

    bespoke_addon_options = get_bespoke_product_options()
    context = {
        "order_id": order_id,
        "tax_rate": order_obj.tax_rate.rate,
        "customer_id": order_obj.customer_id,
        "store_id": order_obj.store_id,
        "form_post_url": reverse_lazy('orderproductadd', kwargs={'order_id': order_id}),
        "price_for": "I",  #
        'customer_discount': customer_discount,
        "form": form,
        "bespoke_addons": bespoke_addon_options,
        "bespoke_addons_count": len(bespoke_addon_options)}

    template_name = 'orders/dialogs/add_product_layout_dlg.html'

    qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)

    bulk_details = prod_services.create_bulk_arrays(qs_bulk)
    context['bulk_info'] = bulk_details

    context['material_obj'] = OcTsgProductMaterial.objects.all()

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


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
            #and set the order details too
            order_obj = get_object_or_404(OcOrder, pk=order_id)
            order_obj.shipping_method = request.POST.get('title')
            order_obj.save()
            calculate_order_total(order_id, False, False)
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
        """passback data for ajax, so we know if we are updating the details or if it was a fastship"""
        table_row_id = request.POST.get('tblrowid', 0)  # used to update the row
        fast_ship = request.POST.get('fastship', 0)  # checks where we have come from

        data['fastship'] = fast_ship
        data['tblrowid'] = table_row_id

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
            order_details_obj.order_status_id = 99
            order_details_obj.save()


            """Now check to see if we set the product status to shipped and if we send the invoice or not"""
            bl_mark_shipped = int(request.POST.get('checkSetShipped', 0))
            if bl_mark_shipped == 1:
                for order_product in order_details_obj.order_products.all():
                    if order_product.status_id != 9: #shipped direct
                        order_product.status_id = 8    #set as shipped
                        order_product.save()

            data['form_is_valid'] = True

            #send the tracking info

            email_messages = dict()

            bl_send_tracking_email = request.POST.get('checkSendTracking', 0)
            if bl_send_tracking_email:
                tracking_emails = request.POST.get('sendTrackingEmail', 0)
                json_return = send_shipped_email(order_id, tracking_emails)
                email_messages['tracking'] = json.loads(json_return.content)


            bl_send_invoice_email = request.POST.get('checkSendInvoice', 0)
            if bl_send_invoice_email:
                invoice_emails = request.POST.get('sendInvoiceEmail', 0)
                json_return = send_invoice_email(order_id, invoice_emails)
                email_messages['imvoice'] = json.loads(json_return.content)

            data['emails'] = email_messages

        else:
            data['form_is_valid'] = False

    else:
        form = OrderShipItForm()
        #we've added some extra parms to the query string to help with the ajax call ?fastship=true&rowid=
        table_row_id = request.GET.get('tblrowid', 0)  #used to update the row
        fast_ship = request.GET.get('fastship', 0) #checks where we have come from

    template_name = 'orders/dialogs/ship_order.html'

    context = {'order_id': order_id,
               'order_obj':order_details_obj,
               'form': form,
               'couriers': courier_obj,
               'fastship': fast_ship,
               'tblrowid': table_row_id,}

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)



def order_product_edit(request, order_id, order_product_id):
    data = dict()
    order_product = get_object_or_404(OcOrderProduct, pk=order_product_id)
    orderline_product_addons = dict()
    orderline_options = dict()
    orderline_product_options = dict()

    if request.method == 'POST':
        form = ProductEditForm(request.POST, instance=order_product)
        if form.is_valid():
            data['form_is_valid'] = True
            order_product.save()
            calculate_order_total(order_id)
            #now see if we need to update any options / variants
            update_product_options_and_variant_options(request.POST, order_id, order_product_id, order_product.product_id)
        else:
            logger.debug(f"form not valid = {form.errors}")
            logger.debug(f"form errors (dict) = {form.errors.as_data()}")
            logger.debug(f"form errors (clean) = {form.errors.get_json_data()}")
            data['form_is_valid'] = False

    else:
        form = ProductEditForm(instance=order_product)
        form.fields['order_id'] = order_id
        #get any pre-exiting bespoke options for this product
       #if order_product.is_bespoke:
        orderline_product_addons = list(OcTsgOrderProductOptions.objects.filter(
             order_product_id=order_product_id).values())  # e.g. laminate / drill holes
        orderline_options = list(
                OcTsgOrderOption.objects.filter(order_product_id=order_product_id).values())  # e.g. FORS ID
        #else:
        orderline_product_options = get_product_options_edit(order_product.product_id)

    template_name = 'orders/dialogs/order_product_edit.html'
    store_id = order_product.order.store_id

    if order_product.bulk_discount_id:
        default_bulk = order_product.bulk_discount_id

    else:
        default_bulk = 1

    qs_bulk = OcTsgBulkdiscountGroups.objects.filter(is_active=1)
    bulk_details = prod_services.create_bulk_arrays(qs_bulk)
    order_data = OcOrder.objects.filter(order_id=order_id).values('tax_rate__rate').first()

    bespoke_addon_options = get_bespoke_product_options()
    select_data = create_product_variant_select_objects(store_id, order_product.product_variant_id)

    context = {'order_id': order_id,
               'order_product_id': order_product_id,
               'form': form,
               'bulk_info': bulk_details,
               "tax_rate": order_data['tax_rate__rate'],
               'default_bulk': default_bulk,
               "form_post_url": reverse_lazy('orderproductedit', kwargs={'order_id': order_id, 'order_product_id': order_product_id}),
               "price_for": "I",  #
               "bespoke_addons": bespoke_addon_options,
               "bespoke_addons_count": len(bespoke_addon_options),
               "orderline_product_addons": orderline_product_addons,
               "has_product_addon" : len(orderline_product_addons) > 0,
                "orderline_options": orderline_options,
               "has_product_option": len(orderline_options) > 0,
               "stock_product_orderline_product_options": orderline_product_options,
               "select_data": select_data
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
            calculate_order_total(order_id)

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
        if order_obj.customer.parent_company:
            context['order_company_id'] = order_obj.customer.parent_company.company_id
        else:
            context['order_company_id'] = 0
            context['order_customer_id'] = order_obj.customer_id
    else:
        context['order_company_id'] = 0
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

def order_return_dlg(request, order_id):
    data = dict()
    data['form_is_valid'] = False

    if request.method == 'POST':
        order_obj = get_object_or_404(OcOrder, pk=order_id)
        #now create a new return
        new_return_obj = order_obj.returnorder.create()
        new_return_obj.store = order_obj.store
        new_return_obj.contact_name = order_obj.shipping_fullname
        new_return_obj.contact_email = order_obj.shipping_email
        new_return_obj.contact_telephone = order_obj.shipping_telephone
        new_return_obj.status_id = 1
        new_return_obj.action_id = 1
        new_return_obj.save()
        return_id = new_return_obj.id
        if return_id:
            data['redirect_url'] = f"/returns/{return_id}"
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    template_name = 'orders/dialogs/return_order.html'
    context = {'order_id': order_id}

    data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
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
            calculate_order_total(order_id, False)
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
            calculate_order_total(order_id, False)



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
        if order_obj.customer.parent_company:
            company_id = order_obj.customer.parent_company.company_id
            queryset = OcAddress.objects.filter(customer__parent_company=company_id).order_by('postcode')
        else:
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
        order_obj.payment_method_name = ''
        order_obj.order_status_id = 1
        order_obj.payment_status_id = 1
        order_obj.order_type_id = 1
        order_obj.payment_method_id = 8
        order_obj.customer_order_ref = ''

        new_order_id = order_obj.order_id

        unique_id = uuid.uuid4().hex  # Generates a random UUID and gets the hex representation
        # Hash the unique identifier with MD5
        order_hash = hashlib.md5(unique_id.encode()).hexdigest()
        order_obj.order_hash = order_hash

        order_obj.save()


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


def product_order_history_dlg(request, order_id, order_product_id):
        data = dict()
        product_history_obj = OcTsgOrderProductStatusHistory.objects.filter(order_product_id=order_product_id).order_by('-date_added')
        context = {'product_history_obj': product_history_obj}
        template_name = 'orders/dialogs/product_status_history.html'

        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
        return JsonResponse(data)


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



def get_option_value_modifiers(option_value_id, follow = True):
    option_value = get_object_or_404(OcTsgOptionValues, pk=option_value_id)
    data = dict()
    data['id'] = option_value_id
    data['type_id'] = option_value.option_type_id
    data['product_id'] = option_value.product_id
    data['price_modifier'] = option_value.price_modifier
    data['drop_down'] = option_value.dropdown_title
    data['hidden'] = False
    data['dynamic_select'] = []
    data['class_value_type'] = option_value.option_type_id

#see if this is part or dynamic option
    if follow:
        dynamic_option_value = OcTsgOptionValueDynamics.objects.filter(option_value_id=option_value_id)
        if dynamic_option_value:
            data['hidden'] = True
            data_dyn = dict()
            for dynamic_values in dynamic_option_value:
                dynamic_option_obj = get_object_or_404(OcTsgOptionValues, pk=dynamic_values.dep_option_value_id)
                data_dyn['id'] = dynamic_option_obj.id
                data_dyn['label'] = dynamic_option_obj.title
                data_dyn['order'] = 0
                data_dyn['default'] = "Not required"
                data_dyn['values'] = get_option_value_modifiers(dynamic_option_obj.id, False)
                data['dynamic_select'].append(data_dyn)

    if option_value.option_type_id == 4:
#this calueis made up of another product e.g. clips
        product_obj = get_object_or_404(OcProduct, product_id=option_value.product_id)
        product_variant_obj = product_obj.corevariants.all()
        product_data = []
        for variant in product_variant_obj:
            variant_data = dict()
            variant_data['id'] = variant.prod_variant_core_id
            variant_data['drop_down'] = variant.size_material.product_size.size_name
            variant_data['price'] = variant.size_material.price
            product_data.append(variant_data)
        data['product_list'] = product_data


    if option_value.option_type_id == 6:
        product_variant_obj =  get_object_or_404(OcTsgProductVariantCore, product_variant_core_id=option_value.product_id)
        product_data = dict()
        product_data['id'] = product_variant_obj.prod_variant_core_id
        product_data['name'] = product_variant_obj.product.productdescbase.name
        product_data['price'] = product_variant_obj.size_material.price

    return data


####### - New option is in
def ajax_product_variant_options(request, store_id, product_variant_id):
    #given a variant_id and a store, get
    select_data = []
    #get the option class

    select_data = create_product_variant_select_objects(store_id,product_variant_id)
    data = dict()

    #get the variant details
    product_variant_obj = get_object_or_404(OcTsgProductVariants, pk=product_variant_id);

    variant_info = dict()

    core_size_material_id = product_variant_obj.prod_var_core.size_material_id

    store_size_material_price = OcTsgSizeMaterialCombPrices.objects.select_related('size_material_comb__product_size').filter(
        size_material_comb_id=core_size_material_id).filter(store_id=store_id).first()

    if store_size_material_price:
        variant_size_material_info = store_size_material_price
        variant_info['size_width'] = variant_size_material_info.size_material_comb.product_size.size_height
        variant_info['size_height'] = variant_size_material_info.size_material_comb.product_size.size_width
        var_price = variant_size_material_info.price
    else:
        variant_size_material_info = OcTsgSizeMaterialComb.objects.select_related('product_size').filter(
            pk=core_size_material_id).first()
        variant_info['size_width'] = variant_size_material_info.product_size.size_height
        variant_info['size_height'] = variant_size_material_info.product_size.size_width
        var_price = variant_size_material_info.price


    if product_variant_obj.variant_overide_price > 0.00:
        variant_info['base_price'] = product_variant_obj.variant_overide_price
    else:
        variant_info['base_price'] = var_price


    template_name = 'orders/dialogs/product_variant_options_ajax.html'
    #template_name = 'orders/dialogs/product_variant_options.html'

    context = {'product_variant_id': product_variant_id}
    context['variant_info'] = variant_info
    context['select_data'] = select_data
    context['base_price'] = 1.00
    data['html_content'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)
    #return render(request, template_name, context)


def ajax_product_variant_options_test(request, store_id, product_variant_id):
    #given a variant_id and a store, get
    select_data = []
    #get the option class

    select_data = create_product_variant_select_objects(store_id,product_variant_id)
    data = dict()


    #get the variant details
    product_variant_obj = get_object_or_404(OcTsgProductVariants, pk=product_variant_id);

    variant_info = dict()

    core_size_material_id = product_variant_obj.prod_var_core.size_material_id

    store_size_material_price = OcTsgSizeMaterialCombPrices.objects.select_related('size_material_comb__product_size').filter(
        size_material_comb_id=core_size_material_id).filter(store_id=store_id).first()

    if store_size_material_price:
        variant_size_material_info = store_size_material_price
        variant_info['size_width'] = variant_size_material_info.size_material_comb.product_size.size_height
        variant_info['size_height'] = variant_size_material_info.size_material_comb.product_size.size_width
        var_price = variant_size_material_info.price
    else:
        variant_size_material_info = OcTsgSizeMaterialComb.objects.select_related('product_size').filter(
            pk=core_size_material_id).first()
        variant_info['size_width'] = variant_size_material_info.product_size.size_height
        variant_info['size_height'] = variant_size_material_info.product_size.size_width
        var_price = variant_size_material_info.price


    if product_variant_obj.variant_overide_price > 0.00:
        variant_info['base_price'] = product_variant_obj.variant_overide_price
    else:
        variant_info['base_price'] = var_price


    template_name = 'orders/dialogs/product_variant_options_ajax.html'
    template_name = 'orders/dialogs/product_variant_options.html'

    context = {'product_variant_id': product_variant_id}
    context['variant_info'] = variant_info
    context['select_data'] = select_data
    context['base_price'] = 1.00
    data['html_content'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    #return JsonResponse(data)
    return render(request, template_name, context)

####### - New option is in
# def ajax_product_options_old(request, product_id):
#     #given a product the options
#     select_data = []
#     #get the option class
#     data = dict()
#    # options_unique = OcProductOption.objects.filter(product_id=product_id, isdeleted=0).values('option_id', 'required').distinct()
#
#     #now step though each options and get the type etc
#     option_markup = []
#     for option in options_unique:
#         product_option_data = dict()
#         bl_required = False
#         option_obj = OcOptionDescription.objects.filter(option_id=option['option_id'], language_id=1).first() #not dealing with multi languages at the moment
#         product_option_data['option_type'] = option_obj.option.type_id
#         product_option_data['option_name'] = option_obj.name
#         product_option_data['option_id'] = option['option_id']
#         if option['required'] == 1:
#             bl_required = True
#         option_data = OcProductOptionValue.objects.filter(option_id=option['option_id'], product_id=product_id)
#         #now set through each of these
#         product_option_values = []
#         for option_value in option_data:
#             product_option_values.append({'id': option_value.option_value.option_value_id, 'value' : option_value.option_value.option_value_desc})
#         product_option_data['option_values'] = product_option_values
#         product_option_data['option_required'] = bl_required
#         option_markup.append(product_option_data)
#
#
#     template_name = 'orders/dialogs/product_options_ajax.html'
#
#     context = {'product_id': product_id}
#     context['options_markup'] = option_markup
#     data['html_content'] = render_to_string(template_name,
#                                          context,
#                                          request=request
#                                          )
#
#     return JsonResponse(data)
#     #return render(request, template_name, context)

def ajax_product_options(request, product_id):
    #given a product the options
    #get the option class
    data = dict()

    product_options = OcTsgProductOption.objects.filter(product_id=product_id).order_by('sort_order')

    #now step though each options and get the type etc
    option_markup = []
    for option_group in product_options:
        product_option_data = dict()
        product_option_data['option_name'] = option_group.label
        product_option_data['option_type'] = option_group.option_type_id
        product_option_data['id'] = option_group.pk

        #now get the values for this group
        product_option_values_obj = OcTsgProductOptionValues.objects.filter(product_option_id=option_group.pk).order_by('sort_order')
        product_option_values = []
        for option_value in product_option_values_obj:
            product_option_values.append({'id': option_value.option_value_id, 'value' : option_value.option_value.name})
        product_option_data['option_values'] = product_option_values
        option_markup.append(product_option_data)


    template_name = 'orders/dialogs/product_options_ajax.html'
    #template_name = 'orders/dialogs/product_options_test.html'

    context = {'product_id': product_id}
    context['options_markup'] = option_markup
    data['html_content'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)
    #return render(request, template_name, context)

def get_product_options_edit(product_id):
    data = dict()

    product_options = OcTsgProductOption.objects.filter(product_id=product_id).order_by('sort_order')

    # now step though each options and get the type etc
    option_markup = []
    for option_group in product_options:
        product_option_data = dict()
        product_option_data['option_name'] = option_group.label
        product_option_data['option_type'] = option_group.option_type_id
        product_option_data['id'] = option_group.pk

        # now get the values for this group
        product_option_values_obj = OcTsgProductOptionValues.objects.filter(product_option_id=option_group.pk).order_by(
            'sort_order')
        product_option_values = []
        for option_value in product_option_values_obj:
            product_option_values.append({'id': option_value.option_value_id, 'value': option_value.option_value.name})
        product_option_data['option_values'] = product_option_values
        option_markup.append(product_option_data)

    return option_markup;

def create_product_variant_select_objects(store_id, product_variant_id, follow=True, class_id=0):
    #given a store and a product variant create a list of select objects.
    select_list_data = []

    #get the UNIQUE classes for thie variant - depth 1
    option_class_unique = OcTsgProductVariantOptions.objects.filter(product_variant_id=product_variant_id).filter(isdeleted=0).values_list(
        'product_var_core_option__option_class__id', 'product_var_core_option__option_class__label',
        'product_var_core_option__option_class__order_by',
        'product_var_core_option__option_class__default_dropdown_title').distinct().order_by(
        'product_var_core_option__option_class__order_by')

    for class_data in option_class_unique:
        select_data = create_class_select_object(store_id, class_data[0], product_variant_id, class_id)
        select_list_data.append(select_data)
#so if any of these values have dynamic classes.
        dynamic_child_class = create_dynamic_child_options(store_id, select_data['values'], class_data[0])
        if len(dynamic_child_class)>0:
            select_list_data.extend(dynamic_child_class)
#or are they a product and that variant has options?
        if follow:
            new_selects_added = []
            new_selects_added.append(select_data) #the original class
            new_selects_added.extend(dynamic_child_class) #the new child class
            select_info = []
            for select_check_data in new_selects_added:
                for value_option in select_check_data['values']:
                    if value_option['option_type'] == 4:
                        follow_product_variant_id = value_option['id']
                        # get this variants options
                        option_select_list = create_product_variant_select_objects(store_id, follow_product_variant_id, False, class_data[0])
                        #option_select_list = []  #just for testing
                        if len(option_select_list) > 0:
                            dynamic_arr = []
                            for option_list in option_select_list:
                                dynamic_tup = dict()
                                dynamic_tup['pk'] = option_list['id']
                                dynamic_tup['child_value_id'] = option_list['id']
                                value_option['dynamic_id'].append(dynamic_tup)
                                option_list['is_dynamic'] = True
                                option_list['parent_class_id'] = 0
                                option_list['type_id']  = value_option['option_type']
                                option_list['product_id'] = value_option['id']

                            select_list_data.extend(option_select_list)


    return select_list_data


def create_class_select_object(store_id, class_id, product_variant_id, parent_class_id):
#create the label, order and default option for thie class -
#e.g. Laminate, "No thanks",
    select_info = dict()
    class_obj = get_object_or_404(OcTsgOptionClass, pk=class_id)
    select_info['id'] = class_id
    select_info['label'] = class_obj.label
    select_info['order'] = class_obj.order_by
    select_info['default'] = class_obj.default_dropdown_title
    select_info['is_dynamic'] = False
#now get the class values that are valid for this product_variant of this site
    class_option_values = create_class_option_values(store_id, class_id, product_variant_id)
    select_info['values'] = class_option_values
    select_info['parent_class_id'] = parent_class_id
    select_info['dynamic_class_id'] = 0
#we now have a complete <select><optionm> object

    return select_info


def create_class_option_values(store_id, option_class_id, product_variant_id):
    #give a class id - get the drop down values for this class.
    #we need the product_variant_id as each variant has diffenent option values
    variant_option_obj = OcTsgProductVariantOptions.objects.filter(
        product_var_core_option__option_class_id=option_class_id).filter(
        product_variant_id=product_variant_id).filter(isdeleted=0).order_by('order_by')

    #we now have a lis of option values for this class for a given variant - the variant is site specific

    select_values = []
    for variant_value in variant_option_obj:  # step over the variant options in this class
        value_obj = variant_value.product_var_core_option.option_value  # get the option value object

        if value_obj.option_type_id == 4:
            class_data = create_option_values_from_product(store_id, value_obj)
            select_values.extend(class_data)
        elif value_obj.option_type_id == 6:
            class_data = create_option_values_from_variant(store_id, value_obj)
            select_values.extend(class_data)
        else: #e.g. lamiate / drill holes
            select_data = create_option_values_from_list(value_obj)
            dynamic_option_value = OcTsgOptionValueDynamics.objects.filter(option_value_id=value_obj.id)
            if dynamic_option_value:
                for dynamic_values in dynamic_option_value:
                    dynamic_tup = dict()
                    dynamic_tup['pk'] = dynamic_values.pk
                    dynamic_tup['child_value_id'] = dynamic_values.dep_option_value_id
                    select_data['dynamic_id'].append(dynamic_tup)
            select_values.append(select_data)

    #return the array of values (used as drop downs)
    return select_values

def create_option_values_from_list(value_obj):
#standard list options
    select_data = dict()
    select_data['option_type'] = value_obj.option_type_id
    select_data['id'] = value_obj.id
    select_data['drop_down'] = value_obj.title
    select_data['price_modifier'] = float(value_obj.price_modifier)
    select_data['dynamic_id'] = []
    return select_data


def create_option_values_from_variant(store_id, parent_class):
    #get the product variants to create the list from the product_id and the store

    variant = OcTsgProductVariants.objects.select_related('prod_var_core__size_material').filter(
        prod_variant_id=parent_class.product_id).filter(store_id=store_id).first()

    variant_all = OcTsgProductVariants.objects.select_related('prod_var_core__size_material').filter(
        prod_variant_id=parent_class.product_id).filter(store_id=store_id)

    variant_data = dict()
    variant_data['id'] = variant.prod_var_core.prod_variant_core_id
    variant_data['drop_down'] = variant.prod_var_core.size_material.product_size.size_name
    variant_data['price_modifier'] = parent_class.price_modifier
    variant_data['option_type'] = parent_class.option_type_id
    variant_data['dynamic_id'] = []

    store_size_material_price = OcTsgSizeMaterialCombPrices.objects.filter(
        size_material_comb_id=variant.prod_var_core.size_material_id).filter(store_id=store_id).first()

    price = store_size_material_price.price
    alt_price = variant.variant_overide_price
    if alt_price:
        variant_data['price'] = alt_price
    else:
        variant_data['price'] = price

    product_data = []
    product_data.append(variant_data)
    return product_data


def create_option_values_from_product(store_id, parent_class):
    #get the product variants to create the list from the product_id and the store
    product_variant_obj = OcTsgProductVariants.objects.select_related('prod_var_core__size_material').filter(
        prod_var_core__product_id=parent_class.product_id).filter(
        store_id=store_id)

    product_data = []
    for variant in product_variant_obj:
        variant_data = dict()
        variant_data['id'] = variant.prod_var_core.prod_variant_core_id
        variant_data['drop_down'] = variant.prod_var_core.size_material.product_size.size_name
        variant_data['price_modifier'] = parent_class.price_modifier
        variant_data['option_type'] = parent_class.option_type_id
        variant_data['dynamic_id'] = []
#get the size for the drop down
        store_size_material_price = OcTsgSizeMaterialCombPrices.objects.filter(
            size_material_comb_id=variant.prod_var_core.size_material_id).filter(store_id=store_id).first()


        price = store_size_material_price.price
        alt_price = variant.variant_overide_price
        if alt_price:
            variant_data['price'] = alt_price
        else:
            variant_data['price'] = price

        product_data.append(variant_data)

    product_data.sort(key=operator.itemgetter('price')) #sort the drop down by price
    return product_data


def create_dynamic_child_options(store_id, class_option_values, parent_class_id):
#now check if any of the last values added have children options
    select_list_data = []
    order = 1
    for select_values in class_option_values:
        if len(select_values['dynamic_id']) > 0:
            for dynamic_option_value_id in select_values['dynamic_id']:
                dynamic_class_info = create_new_select_from_dyn_value(store_id, dynamic_option_value_id['pk'], order, parent_class_id)
                order += 1
                select_list_data.append(dynamic_class_info)

    return select_list_data


def create_new_select_from_dyn_value(store_id, dynamic_option_pk, order, parent_class_id):
    dynamic_option_obj = get_object_or_404(OcTsgOptionValueDynamics, pk=dynamic_option_pk)
    value_obj = get_object_or_404(OcTsgOptionValues, pk=dynamic_option_obj.dep_option_value_id)
    select_info = dict()
    select_info['id'] = value_obj.pk
    select_info['label'] = dynamic_option_obj.label
    select_info['order'] = order
    select_info['default'] = 'No thanks'
    select_info['is_dynamic'] = True
    select_info['parent_class_id'] = parent_class_id
    select_info['dynamic_class_id'] = dynamic_option_pk

    if value_obj.option_type_id == 4:#then a list of products
        class_option_values = create_option_values_from_product(store_id, value_obj)
        select_info['values'] = class_option_values
    else:
        tmp = [];
    return select_info


def create_dynamic_options_from_product_variant(store_id, class_option_values):
    select_info = []
    for value_option in class_option_values:
        product_variant_id = value_option['id']
#get this variants options
        option_select_list = create_product_variant_select_objects(store_id, product_variant_id, False, value_option['class_id'])
        if len(option_select_list) > 0:
            for option_list in option_select_list:
                option_list['parent_class_id'] = value_option['id']
                option_list['is_dynamic'] = True
            select_info.extend(option_select_list)
    return select_info

def set_product_options_and_variant_options(post_data, order_id, order_product_id, product_id):
    #get the class and value pairs from the post data
    variant_class_pairs = get_variant_class_pairs(post_data)
    selected_option_values = []
    if 'selected_option_values_frm' in post_data:
        if len(post_data['selected_option_values_frm']) > 1:
            selected_option_values = json.loads(post_data['selected_option_values_frm'])

    if selected_option_values:
        add_order_product_variant_options_2(selected_option_values, order_product_id)
    #if variant_class_pairs:
    #    add_order_product_variant_options(variant_class_pairs, order_product_id)

    product_class_pairs = get_product_option_pairs(post_data)
    if product_class_pairs:
        add_order_product_options(product_class_pairs, order_id, order_product_id, product_id)

def update_product_options_and_variant_options(post_data, order_id, order_product_id, product_id):
    #get the class and value pairs from the post data
    OcTsgOrderProductOptions.objects.filter(order_product_id=order_product_id).delete()
    #variant_class_pairs = get_variant_class_pairs(post_data)
    selected_option_values = []
    if 'selected_option_values_frm' in post_data:
        if len(post_data['selected_option_values_frm']) > 1:
            selected_option_values = json.loads(post_data['selected_option_values_frm'])

    if selected_option_values:
        add_order_product_variant_options_2(selected_option_values, order_product_id)

    #if variant_class_pairs:
    #    add_order_product_variant_options(variant_class_pairs, order_product_id)

    OcTsgOrderOption.objects.filter(order_product_id=order_product_id).delete()
    product_class_pairs = get_product_option_pairs(post_data)
    if product_class_pairs:
        add_order_product_options(product_class_pairs, order_id, order_product_id, product_id)

def get_variant_class_pairs(post_data):
    #get the class and value pairs from the post data
    variant_class_pairs = []
    for key in post_data.keys():
        if key.startswith('option_class_'):
            class_id = int(key.split('_')[2])
            parent_id = int(key.split('_')[3])
            dynamic_id = int(key.split('_')[4])
            value_id = int(post_data[key])
            #if 'dynamic_' + str(class_id) in post_data:
            #    dynamic_value_id = post_data['dynamic_' + class_id]
            #    variant_class_pairs.append({'class_id':
            #                                    class_id, 'value_id': dynamic_value_id})
            if value_id > 0:
                variant_class_pairs.append({'class_id': class_id, 'value_id': value_id, 'parent_id': parent_id, 'dynamic_id': dynamic_id})
    return variant_class_pairs

def get_product_option_pairs(post_data):
    #get the class and value pairs from the post data
    product_option_pairs = []
    for key in post_data.keys():
        if key.startswith('product_option_'):
            option_value_splits = key.split('_')
            class_id = option_value_splits[2]
            if len(option_value_splits) > 3:
                value_id = option_value_splits[3]
            else:
                value_id = post_data[key]
            value_name = post_data[key]
            if value_id:
                product_option_pairs.append({'option_name': class_id, 'option_value': value_name, 'option_value_id': value_id})
    return product_option_pairs


def add_order_product_variant_options_2(variant_options_data, order_product_id):
    variant_class_obj = OcTsgOptionClass.objects.all()
    variant_values_obj = OcTsgOptionValues.objects.all()
    for variant_options_data in variant_options_data:
        order_product_variant_option = OcTsgOrderProductOptions()
        order_product_variant_option.order_product_id = order_product_id
        order_product_variant_option.value_id = variant_options_data['value_id']
        order_product_variant_option.class_field_id = variant_options_data['class_id']
        order_product_variant_option.class_name = variant_options_data['class_label']
        order_product_variant_option.value_name = variant_options_data['value_label']
        order_product_variant_option.bl_dynamic = True
        order_product_variant_option.save()
#TODO - now we have a tuple of 3, check if dynamic and if so add the dynamic value to the order product options
# and if not use the class to get hte value
def add_order_product_variant_options(variant_options, order_product_id):
    #given a list of variant options, add them to the order product
    variant_class_obj = OcTsgOptionClass.objects.all()
    variant_values_obj = OcTsgOptionValues.objects.all()
    for variant_option in variant_options:
        order_product_variant_option = OcTsgOrderProductOptions()
        order_product_variant_option.order_product_id = order_product_id
        if variant_option['parent_id'] > 0:
            #then it's a dynamic option
            #get the dynamicl from the options
            dynamic_obj = OcTsgOptionValueDynamics.objects.filter(pk=variant_option['dynamic_id']).first()
            order_product_variant_option.class_name = dynamic_obj.label
            class_type = dynamic_obj.option_value.option_type_id
            order_product_variant_option.dynamic_value_id = variant_option['value_id']
            order_product_variant_option.dynamic_class_id = variant_option['dynamic_id']
            order_product_variant_option.bl_dynamic = True

            dyn_class_type = dynamic_obj.dep_option_value.option_type_id
            if dyn_class_type == 4 or dyn_class_type == 6:
                product_variant_obj = OcTsgProductVariantCore.objects.filter(pk=variant_option['value_id']).first()
                order_product_variant_option.value_name = product_variant_obj.size_material.product_size.size_name


        else:
            order_product_variant_option.class_field_id = variant_option['class_id']
            variant_class_obj = OcTsgOptionClass.objects.filter(pk=variant_option['class_id']).first()
            order_product_variant_option.class_name = variant_class_obj.label
            option_value_obj = OcTsgOptionValues.objects.filter(pk=variant_option['value_id']).first()

            class_type = option_value_obj.option_type_id

            if class_type == 4 or class_type == 6:
                product_variant_obj = OcTsgProductVariantCore.objects.filter(pk=variant_option['value_id']).first()
                order_product_variant_option.value_name = product_variant_obj.size_material.product_size.size_name
            else:
                order_product_variant_option.value_name = variant_values_obj.filter(
                    pk=variant_option['value_id']).first().title

            order_product_variant_option.value_id = variant_option['value_id']



        order_product_variant_option.save()

def add_order_product_options(product_options, order_id, order_product_id, product_id):
    #given a list of product options, add them to the order product
    product_options_obj = OcTsgProductOption.objects.all()
    for product_option in product_options:
        order_product_option = OcTsgOrderOption()
        order_product_option.order_product_id = order_product_id
        order_product_option.order_id = order_id

        product_options_data = product_options_obj.filter(pk=product_option['option_name']).first()

        option_type = product_options_data.option_type_id
        order_product_option.option_id = product_option['option_name']
        order_product_option.option_name = product_options_data.label

#{'option_name': class_id, 'option_value': value_name, 'option_value_id': value_id}

        if option_type == 2: #text box
            order_product_option.value_name = product_option['option_value']
            order_product_option.value_id = product_option['option_value_id']
        elif option_type == 1:  #select boxß
            product_value_data = OcOptionValues.objects.filter(pk=product_option['option_value']).first()
            order_product_option.value_name = product_value_data.name
            order_product_option.value_id = product_value_data.pk

        order_product_option.save()


def get_bespoke_product_options():
    #hack for now, to add laminate, d-tape and drill holes
    select_list_data = []

    bespoke_class_ids = [1, 2, 5]
    for class_id in bespoke_class_ids:
        select_info = dict()
        class_obj = get_object_or_404(OcTsgOptionClass, pk=class_id)
        select_info['id'] = class_id
        select_info['label'] = class_obj.label
        select_info['order'] = class_obj.order_by
        select_info['default'] = class_obj.default_dropdown_title
        select_info['is_dynamic'] = False
        option_class_values_obj = class_obj.values_option_class.all()
        select_info['values'] = []
        for option_class_value in option_class_values_obj:
            select_data = create_option_values_from_list(option_class_value.option_value)
            select_info['values'].append(select_data)
        # now get the class values that are valid for this product_variant of this site
        select_list_data.append(select_info)

    return select_list_data



def calculate_order_total(order_id, bl_discount=True, bl_recalc_shipping=True):
    calc_order_totals(order_id, bl_discount, bl_recalc_shipping)


def calc_order_totals(order_id, bl_recal_discount=True, bl_recalc_shipping=True):
    if bl_recal_discount:
        calc_update_product_subtotal(order_id)

    qs_order = OcOrder.objects.filter(pk=order_id).first()
    order_tax_rate = Decimal(qs_order.tax_rate.rate / 100)
    order_tax_title = qs_order.tax_rate.name
    qs_products = OcOrderProduct.objects.filter(order__order_id=order_id)
    sub_total_lines = Decimal(0.0)

    qs_totals = OcOrderTotal.objects.filter(order_id=order_id)
    qs_shipping = qs_totals.filter(code='shipping')

    qs_discount = qs_totals.filter(code='discount')
    qs_total = qs_totals.get(code='total')
    qs_sub = qs_totals.get(code='sub_total')
    qs_tax = qs_totals.get(code='tax')

    for product in qs_products.iterator():
        sub_total_value = Decimal(product.price) * Decimal(product.quantity)
        sub_total_lines += sub_total_value.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

    sub_total = sub_total_lines

    if qs_discount.exists():
        sub_total -= Decimal(qs_discount.first().value)

    #not we need to work out what the shipping is
    if bl_recalc_shipping:
        shipping_cost = get_shipping_cost(order_id, sub_total)

    if qs_shipping.exists():
        sub_total += Decimal(qs_shipping.first().value)

    tax_rate_calc = 1 + order_tax_rate
    order_total_float = sub_total * tax_rate_calc
    order_total = Decimal(order_total_float.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
    tax_total = order_total - sub_total

    qs_total.value = float(order_total)
    qs_total.save()
    qs_sub.value = float(sub_total_lines)
    qs_sub.save()
    qs_tax.value = float(tax_total)
    qs_tax.title = order_tax_title
    qs_tax.save()

    #now update the order
    qs_order = OcOrder.objects.get(order_id=order_id)
    qs_order.total = order_total
    qs_order.save()


def get_shipping_cost(order_id, subtotal):
    shipping_cost = 0.00
    product_ship_price = 0.00
    shipping_size_price = 0.00
    shipping_subtotal_price = 0.00
    product_max_width = 0.00
    product_max_height = 0.00
    product_size_check = 0.00
    shipping_label = ''
    #first check if there is pricing override or size
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    qs_products = OcOrderProduct.objects.filter(order__order_id=order_id)

    for product in qs_products.iterator():
        if product.product_variant:
            #check for a fixed cost
            if product.product_variant.prod_var_core.shipping_cost > product_ship_price:
                product_ship_price = product.product_variant.prod_var_core.shipping_cost
            #check the sizes whilst we are at it
            if product.width > product_max_width:
                product_max_width = product.width
            if product.height > product_max_height:
                product_max_height = product.height

    #first check
    if product_ship_price > shipping_cost:
        shipping_label = 'Product Cost'
        shipping_cost = product_ship_price

    product_size_check = max(product_max_width, product_max_height)
    #now check to see which shipping method we need to use
    #method type 1 - price, 2 - length, 3 - weight
    store_id = order_obj.store_id
    #type 1 - subtotal
    shipping_method_subtotal_obj = OcTsgShippingMethod.objects.filter(store_id=store_id).filter(status=1).filter(method_type_id=1).filter(lower_range__lte=subtotal, upper_range__gte=subtotal).first()
    if shipping_method_subtotal_obj:
        shipping_subtotal_price = shipping_method_subtotal_obj.price
        if shipping_subtotal_price > shipping_cost:
            shipping_cost = shipping_subtotal_price
            shipping_label = shipping_method_subtotal_obj.title

    #type 2 -
    shipping_method_size_obj = OcTsgShippingMethod.objects.filter(store_id=store_id).filter(status=1).filter(
        method_type_id=2).filter(lower_range__lte=product_size_check, upper_range__gte=product_size_check).first()
    if shipping_method_size_obj:
        shipping_size_price = shipping_method_size_obj.price
        if shipping_size_price > shipping_cost:
            shipping_cost = shipping_size_price
            shipping_label = shipping_method_size_obj.title


    #shipping_cost = max(shipping_subtotal_price, product_ship_price, shipping_size_price)
    order_totals_obj = OcOrderTotal.objects.filter(order_id=order_id).filter(code='shipping').first()
    if order_totals_obj:
        if order_totals_obj.value < shipping_cost:
            order_totals_obj.value = shipping_cost
            order_totals_obj.title = shipping_label
            order_totals_obj.save()
    else:
        order_totals_obj = OcOrderTotal()
        order_totals_obj.order_id = order_id
        order_totals_obj.code = 'shipping'
        order_totals_obj.value = shipping_cost
        order_totals_obj.title = shipping_label
        order_totals_obj.save()

    #now update the shipping cost in the totals table


def calc_update_product_subtotal(order_id):
    qs_products = OcOrderProduct.objects.filter(order__order_id=order_id)
    qs_order = OcOrder.objects.filter(pk=order_id).first()
    sub_total_lines_discount = Decimal(0.0)

    customer_discount = 0
    if qs_order.customer:
        if qs_order.customer.parent_company:
            decimal_calc = Decimal(qs_order.customer.parent_company.discount / 100)
            customer_discount = decimal_calc.quantize(Decimal('0.00'))
        else:
            customer_discount = Decimal(0.00)

    for product in qs_products.iterator():
        if not product.exclude_discount:
            discount_amount = Decimal(product.price) * Decimal(product.quantity) * Decimal(customer_discount)
            sub_total_lines_discount += discount_amount.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

    qs_totals = OcOrderTotal.objects.filter(order_id=order_id)
    qs_totals_discount = qs_totals.filter(code='discount')
    if qs_totals_discount.exists():
        qs_discount = qs_totals_discount.first()
        qs_discount.value = sub_total_lines_discount
        qs_discount.save()
    else:
        order_discount = OcOrderTotal()
        order_discount.order_id = order_id
        order_discount.code = 'discount'
        order_discount.title = 'Discount'
        order_discount.value = 0
        order_discount.sort_order = 2

        order_discount.save()



def recalc_order_product_tax(order_id):
    qs_order = OcOrder.objects.filter(pk=order_id).first()
    tax_rate_val = Decimal(qs_order.tax_rate.rate / 100)
    qs_products = OcOrderProduct.objects.filter(order__order_id=order_id)
    tax_value = 0.000
    for product in qs_products:
        tax_value = product.total * tax_rate_val
        product.tax = Decimal(tax_value.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        product.save()

    calc_order_totals(order_id)


def order_document_fetch(request, order_id):
    data =  dict()
    order_docs_obj = OcTsgOrderDocuments.objects.filter(order_id=order_id)
    template_name = 'orders/sub_layout/order_documents.html'
    context = {'order_docs_obj': order_docs_obj}
    order_obj = get_object_or_404(OcOrder,pk=order_id)
    docform_initials = {'order': order_obj}
    docform = OrderDocumentForm(initial=docform_initials)
    context['docform'] = docform
    context['thumbnail_cache'] = settings.THUMBNAIL_CACHE



    data['html_content'] = render_to_string(template_name,
                                            context,
                                            request=request
                                            )

    return JsonResponse(data)



def order_document_upload(request):
    data = dict()
    if request.method == 'POST':
        form = OrderDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            form_instance = form.instance
            order_doc_obj = get_object_or_404(OcTsgOrderDocuments, pk=form_instance.pk)

            #cached_thumb = services.createUploadThumbnail(order_doc_obj.filename.file.name)
            #order_doc_obj.cache_path = cached_thumb
            #order_doc_obj.save()
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_order_documents', kwargs={'order_id': order_doc_obj.order_id})
            data['divUpdate'] = ['div-order_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        data['success_post'] = False

    return JsonResponse(data)


def order_document_download(request, pk):
    doc_obj = get_object_or_404(OcTsgOrderDocuments, pk=pk)
    response = FileResponse(doc_obj.cdn_name, as_attachment=True)
    return response


def order_document_delete(request, pk):
    data = dict()
    template_name = 'orders/dialogs/order_document_delete.html'
    context = dict()
    order_doc_obj = get_object_or_404(OcTsgOrderDocuments, pk=pk)

    if request.method == 'POST':
        order_doc_obj = get_object_or_404(OcTsgOrderDocuments, pk=pk)
        if order_doc_obj:
            order_doc_obj.delete()
            #delete the cached file
            if order_doc_obj.cache_path:
                fullpath = os.path.join(settings.MEDIA_ROOT, settings.THUMBNAIL_CACHE ,order_doc_obj.cache_path)
                if os.path.isfile(fullpath):
                    os.remove(fullpath)
            data['success_post'] = True
            data['document_ajax_url'] = reverse_lazy('fetch_order_documents',
                                                     kwargs={'order_id': order_doc_obj.order_id})
            data['divUpdate'] = ['div-order_documents', 'html_content']
        else:
            data['success_post'] = False
    else:
        context['dialog_title'] = "<strong>DELETE</strong> document"
        context['action_url'] = reverse_lazy('order_document-delete', kwargs={'pk': pk})
        context['form_id'] = 'form-order_document-delete'
        context['order_id'] = order_doc_obj.order_id
        data['upload'] = False

    data['html_form'] = render_to_string(template_name,
                                                     context,
                                                     request=request
                                                     )

    return JsonResponse(data)

def order_xero_update(request, pk):
    # simply encrpyt the order id and pass this, and then decrypt to check they match
    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(pk).encode()).decode()
    # convert this to a str
    return_url = reverse_lazy('xero_order_update', kwargs={'order_id': pk, 'encrypted': encrypted_order_num})
    return HttpResponseRedirect(return_url)

def order_xero_add(request, pk):
    #simply encrpyt the order id and pass this, and then decrypt to check they match
    #TODO - make this secure again

    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(pk).encode()).decode()

    order_obj = get_object_or_404(OcOrder, pk=pk)
    order_hash = order_obj.order_hash
    if order_hash == '':
        unique_id = uuid.uuid4().hex  # Generates a random UUID and gets the hex representation
        # Hash the unique identifier with MD5
        order_hash = hashlib.md5(unique_id.encode()).hexdigest()
        order_obj.order_hash = order_hash
        order_obj.save()

    #convert this to a str
    return_url = reverse_lazy('xero_order_add', kwargs={'order_id': pk, 'encrypted': order_hash })
    return HttpResponseRedirect(return_url)


def order_xero_link(request, pk):
    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(pk).encode()).decode()
    # convert this to a str
    return_url = reverse_lazy('xero_order_link', kwargs={'order_id': pk, 'encrypted': encrypted_order_num})

    return HttpResponseRedirect(return_url)


def order_xero_marksent(request, pk):
    # simply encrpyt the order id and pass this, and then decrypt to check they match
    f = Fernet(settings.XERO_TOKEN_FERNET)
    encrypted_order_num = f.encrypt(str(pk).encode()).decode()
    # convert this to a str
    data = dict()
    return_url = reverse_lazy('xero_order_link', kwargs={'order_id': pk, 'encrypted': encrypted_order_num})
    return HttpResponseRedirect(return_url)



def bespoke_order_product(request, order_id, bespoke_order_product_id):
#def bespoke_order_product(request, order_id, order_product_id):
    data = dict()
    template_name = 'orders/order_bespoke_product.html'
    context = dict()
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    context['order_id'] = order_obj.order_id
    context['order_obj'] = order_obj


    bespoke_order_product_obj = get_object_or_404(OcTsgOrderBespokeImage, order_product_id=bespoke_order_product_id)
    context['bespoke_product'] = bespoke_order_product_obj

    #context['svg_export'] = json.loads(bespoke_order_product_obj.svg_export)

    context['svg_export'] = bespoke_order_product_obj.svg_export.decode('utf-8')
    svg_texts = json.loads(bespoke_order_product_obj.svg_texts)
    context['text_line'] = json.loads(bespoke_order_product_obj.svg_texts)


    images_tmp = json.loads( bespoke_order_product_obj.svg_images)
    if images_tmp:
        images_split = images_tmp.split(',')
        symbol_obj = OcTsgSymbols.objects.filter(pk__in=images_split).values()
        context['images'] = symbol_obj
    else:
        context['images'] = []

    #create some breadcrumbs


    context['heading'] = 'Bespoke Product Details'
    breadcrumbs = []
    breadcrumbs.append({'name': 'Orders', 'url': reverse_lazy('allorders')})
    breadcrumbs.append({'name': 'Order details', 'url': reverse_lazy('order_details', kwargs={'order_id': order_id})})
    context['breadcrumbs'] = breadcrumbs


    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return render(request, template_name, context)

def company_api_account_address(request, order_id, company_id):
    data = dict()
    data['address'] = None
    if request.method == 'GET':
        company_obj = get_object_or_404(OcTsgCompany, pk=company_id)
        order_obj = get_object_or_404(OcOrder, pk=order_id)
        order_obj.payment_fullname = f"{company_obj.accounts_contact_firstname} {company_obj.accounts_contact_lastname}"
        order_obj.payment_firstname = company_obj.accounts_contact_firstname
        order_obj.payment_lastname = company_obj.accounts_contact_lastname
        order_obj.payment_company = company_obj.company_name
        order_obj.payment_email = company_obj.accounts_email
        order_obj.payment_telephone = company_obj.accounts_telephone
        order_obj.payment_address_1 = company_obj.accounts_address
        order_obj.payment_address_2 = ''
        order_obj.payment_city = company_obj.accounts_city
        order_obj.payment_area = company_obj.accounts_area
        order_obj.payment_postcode = company_obj.accounts_postcode
        order_obj.payment_country_name = company_obj.accounts_country

        order_obj.save()
        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False

    return JsonResponse(data)