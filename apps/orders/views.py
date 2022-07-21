from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.template.loader import render_to_string
from .models import OcOrder, OcOrderProduct, OcOrderTotal
from apps.products.models import OcTsgBulkdiscountGroups, OcTsgProductToBulkDiscounts, OcTsgProductMaterial
from .serializers import OrderListSerializer, OrderProductListSerializer, OrderTotalsSerializer, OrderPreviousProductListSerializer
from pyreportjasper import PyReportJasper
from django.conf import settings
import os
from .forms import ProductEditForm, OrderBillingForm, OrderShippingForm, ProductAddForm, OrderDetailsEditForm
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from apps.products import services as prod_services
from apps.customer.models import OcCustomer, OcAddress


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
    if order_obj.customer:
        context["addressItem"] = order_obj.customer.ocaddress_set.all().order_by('postcode')
    else:
        context["addressItem"] = []
    template_name = 'orders/order_layout.html'

    context['pageview'] = 'All orders'
    context['heading'] = 'order details'

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
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    form = ProductAddForm()
    order_data = OcOrder.objects.filter(order_id=order_id).values('tax_rate__rate', 'customer_id').first()
    context = {
        "order_id": order_id,
        "tax_rate": order_data['tax_rate__rate'],
        "customer_id": order_data['customer_id'],
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

def order_product_edit(request, order_id, order_product_id):
    data = dict()
    order_product = get_object_or_404(OcOrderProduct, pk=order_product_id)
    if request.method == 'POST':
        form = ProductEditForm(request.POST, instance=order_product)
        if form.is_valid():
            data['form_is_valid'] = True
            order_product.save()

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
               'default_bulk': default_bulk}

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
            order_obj.payment_postcodea = address_obj.postcode
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
            order_obj.shipping_postcodea = address_obj.postcode
            order_obj.shipping_country_id = address_obj.country_id
            order_obj.save()


    data['is_valid'] = True
    return JsonResponse(data)



def create_paperwork():

    RESOURCES_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'resources')
    REPORTS_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'reports')

    input_file = '/Users/simonfroggatt/PycharmProjects/medusa/reports/Blank_A4_1.jrxml'
    output_file = '/Users/simonfroggatt/PycharmProjects/medusa/reports/blank'
    pyreportjasper = PyReportJasper()
    pyreportjasper.config(
        input_file,
        output_file,
        output_formats=["pdf"],

    )
    pyreportjasper.process_report()
    output_file = output_file + '.pdf'
    if os.path.isfile(output_file):
        print('Report generated successfully!')


def compiling():
    REPORTS_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'reports')
    input_file = os.path.join(REPORTS_DIR, 'test2.jrxml')
    output_file = os.path.join(REPORTS_DIR, 'test2')

    pyreportjasper = PyReportJasper()
    pyreportjasper.config(
        input_file,
        output_file,
        output_formats=["pdf"],

    )
    pyreportjasper.process_report()
    output_file = output_file + '.pdf'
    if os.path.isfile(output_file):
        print('Report generated successfully!')

    pyreportjasper = PyReportJasper()
    pyreportjasper.config(
        input_file,
        output_file,
        output_formats=["pdf"]
    )
    pyreportjasper.compile(write_jasper=True)

