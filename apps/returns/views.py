from django.shortcuts import render
from django.urls import reverse_lazy
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.returns.models import OcTsgReturnOrder, OcTsgReturnOrderProduct
from apps.returns.seriailizers import OrderReturnSerializer, OrderReturnProductSerializer, OrderReturnAvailProductsSerializer
from .forms import ReturnProductEditForm, ReturnEditForm
from apps.shipping.forms import CourierEditForm, MethodsEditForm, CourierOptionEditForm
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from datetime import datetime
from apps.orders.models import OcOrderProduct

class Returns(viewsets.ModelViewSet):
    queryset = OcTsgReturnOrder.objects.all()
    serializer_class = OrderReturnSerializer


class ReturnProducts(viewsets.ModelViewSet):
    queryset = OcTsgReturnOrderProduct.objects.all()
    serializer_class = OrderReturnProductSerializer
    model = serializer_class.Meta.model

    def get_queryset(self):
        # Filter by the return order ID passed in the URL (pk)
        return_order_id = self.kwargs['pk']
        return self.queryset.filter(return_field=return_order_id)

    @action(detail=True, methods=['get'])
    def order_available_products(self, request, pk=None):
        return_order = OcTsgReturnOrder.objects.get(pk=pk)
        order_products = return_order.order.products.all()
        # Get the products that are not already in the return order
        available_products = order_products.exclude(returnorderproduct__return_field=return_order)
        serializer = OrderReturnProductSerializer(available_products, many=True)
        return Response(serializer.data)


class OrderReturnAvailProducts(viewsets.ModelViewSet):
    queryset = OcOrderProduct.objects.all()
    serializer_class = OrderReturnAvailProductsSerializer
    model = serializer_class.Meta.model

    def retrieve(self, request, pk=None):
        # Filter by the return order ID passed in the URL (pk)
        return_order_id = self.kwargs['pk']
        # get all the products in the return so far
        current_return_products = OcTsgReturnOrderProduct.objects.filter(return_field=return_order_id).values('order_product_id')
        # get the order id associated with this return
        return_order = OcTsgReturnOrder.objects.get(pk=return_order_id)
        order_id = return_order.order_id
        order_products = self.queryset.exclude(order_product_id__in=current_return_products).filter(order_id=order_id)
        serializer = self.get_serializer(order_products, many=True)
        return Response(serializer.data)


def return_list(request):
    returns = OcTsgReturnOrder.objects.all()
    return render(request, 'returns/returns_list.html', {'returns': returns})

def return_details(request, pk):
    return_order = get_object_or_404(OcTsgReturnOrder, pk=pk)
    context = {'return_obj': return_order}

    context['heading'] = 'Return details'
    breadcrumbs = []
    breadcrumbs.append({'name': 'Returns', 'url': reverse_lazy('allreturns')})
    #breadcrumbs.append({'name': 'Order details', 'url': reverse_lazy('order_details', kwargs={'order_id': order_id})})
    context['breadcrumbs'] = breadcrumbs

    #add in the days since the order
    delta = return_order.date_created - return_order.order.date_added
    # Get the number of days
    number_of_days = delta.days
    context['days_since_order'] = number_of_days

    return render(request, 'returns/return_layout.html', context)

def return_edit(request, pk):
    return_order = get_object_or_404(OcTsgReturnOrder, pk=pk)
    data = dict()
    if request.method == 'POST':
        form = ReturnEditForm(request.POST, instance=return_order)
        if form.is_valid():
            form.save()
            data['redirect_url'] = reverse_lazy('returndetails', kwargs={'pk': pk})
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        form = ReturnEditForm(instance=return_order)
    context = {'form': form, 'return_order': return_order}
    data['html_form'] = render_to_string('returns/dialogs/edit_return.html',
        context,
        request=request,
    )
    return JsonResponse(data)

def edit_report_product(request, pk):
    return_order_product = get_object_or_404(OcTsgReturnOrderProduct, pk=pk)
    data = dict()
    if request.method == 'POST':
        form = ReturnProductEditForm(request.POST, instance=return_order_product)
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        form = ReturnProductEditForm(instance=return_order_product)
    context = {'form': form, 'return_order_product': return_order_product}
    data['html_form'] = render_to_string('returns/dialogs/edit_return_product.html',
        context,
        request=request,
    )
    return JsonResponse(data)


def delete_return(request, pk):
    return_order = get_object_or_404(OcTsgReturnOrder, pk=pk)
    data = dict()
    if request.method == 'POST':
        return_order.delete()
        data['form_is_valid'] = True
    else:
        context = {'return_order': return_order}
        data['html_form'] = render_to_string('returns/dialogs/delete_return.html',
            context,
            request=request,
        )
    return JsonResponse(data)


def delete_report_product(request, pk):
    return_order_product = get_object_or_404(OcTsgReturnOrderProduct, pk=pk)
    data = dict()
    if request.method == 'POST':
        return_order_product.delete()
        data['form_is_valid'] = True
    else:
        context = {'return_order_product': return_order_product}
        data['html_form'] = render_to_string('returns/dialogs/delete_return_product.html',
            context,
            request=request,
        )
    return JsonResponse(data)

def return_show_order_products(request, pk):
    return_order = get_object_or_404(OcTsgReturnOrder, pk=pk)
    template_name = 'returns/dialogs/return_add_product_layout.html'
    data = dict()
    context = {'return_order': return_order}

    data['html_form'] = render_to_string('returns/dialogs/return_add_product_layout.html',
        context,
        request=request,
    )
    return JsonResponse(data)

def return_add_product(request, pk, product_id):
    return_order = get_object_or_404(OcTsgReturnOrder, pk=pk)
    new_return_obj = return_order.octsgreturnorderproduct_set.create(order_product_id=product_id)
    new_return_obj.reason_id = 1
    new_return_obj.status_id = 1
    new_return_obj.save()
    return JsonResponse({'success': True})
