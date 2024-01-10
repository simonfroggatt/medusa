from django.shortcuts import render
from django.urls import reverse_lazy
from apps.shipping.models import OcTsgCourier, OcTsgShippingMethod, OcTsgCourierOptions
from rest_framework import viewsets
from rest_framework.response import Response
from apps.shipping.seriailizers import CourierSerializer, MethodSerializer, CourierOptionsSerializer
from apps.shipping.forms import CourierEditForm, MethodsEditForm, CourierOptionEditForm
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404


class Couriers(viewsets.ModelViewSet):
    queryset = OcTsgCourier.objects.all()
    serializer_class = CourierSerializer

class Methods(viewsets.ModelViewSet):
    queryset = OcTsgShippingMethod.objects.all()
    serializer_class = MethodSerializer

class CourierOptions(viewsets.ModelViewSet):
    queryset = OcTsgCourierOptions.objects.all()
    serializer_class = CourierOptionsSerializer

    def retrieve(self, request, pk=None):
        options_obj = OcTsgCourierOptions.objects.filter(courier_id=pk)
        serializer = self.get_serializer(options_obj, many=True)
        return Response(serializer.data)



def courier_list(request):
    template_name = 'shipping/courier_list.html'
    context = {'pageview': 'All Couriers'}
    return render(request, template_name, context)


def methods_list(request):
    template_name = 'shipping/method_list.html'
    context = {'pageview': 'All Shipping'}
    return render(request, template_name, context)


class CourierCreate(CreateView):
    template_name = 'shipping/courier-create.html'
   #initial = {'size_code': '', 'size_name': '', 'size_width': 0, 'size_height': 0, 'size_units': 'mm', 'orientation': 1 }
    model = OcTsgCourier
    form_class = CourierEditForm
    #['size_id', 'size_code', 'size_name', 'size_width', 'size_height', 'size_units', 'orientation']
    success_message = 'Success: Courier was created.'
    success_url = reverse_lazy('allcouriers')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Shipping"
        context['pageview'] = "NEW Courier"
        context['courier_id'] = 0
        context['submit_text'] = "Create"
        return context


class CourierUpdate(UpdateView):
    template_name = 'shipping/courier-create.html'
    model = OcTsgCourier
    form_class = CourierEditForm
    success_message = 'Success: Courier was created.'
    success_url = reverse_lazy('allcouriers')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = "Couriers"
        context['heading'] = "Update Courier details"
        context['submit_text'] = "Update"
        context['courier_id'] = self.kwargs['pk']
        return context


def courier_delete(request, pk):
    template_name = 'shipping/courier-delete.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_id = request.POST.get('courier_id')
        obj_courier = get_object_or_404(OcTsgCourier, pk=courier_id)
        obj_courier.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def courier_option_add(request, pk):
    template_name = 'shipping/courier_option_add.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_id = request.POST.get('courier_id')
        form = CourierOptionEditForm(request.POST)
        form_instance = form.instance
        new_option_obj = OcTsgCourierOptions()
        new_option_obj.courier_id = courier_id
        new_option_obj.courier_option_title = form_instance.courier_option_title
        new_option_obj.courier_option_description = form_instance.courier_option_description
        new_option_obj.save()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        options_initials = {'courier_id': pk}
        option_obj = OcTsgCourierOptions()
        form_obj = CourierOptionEditForm(instance=option_obj, initial=options_initials)
        context['form'] = form_obj
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def courier_option_edit(request, pk):
    template_name = 'shipping/courier_option_edit.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_option_id = request.POST.get('courier_option_id')
        form = CourierOptionEditForm(request.POST)
        form_instance = form.instance
        new_option_obj = get_object_or_404(OcTsgCourierOptions, pk=courier_option_id)
        new_option_obj.courier_option_title = form_instance.courier_option_title
        new_option_obj.courier_option_description = form_instance.courier_option_description
        new_option_obj.save()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        option_obj = get_object_or_404(OcTsgCourierOptions, pk=pk)
        form_obj = CourierOptionEditForm(instance=option_obj)
        context['form'] = form_obj
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


def courier_option_delete(request, pk):
    template_name = 'shipping/courier_option-delete.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        courier_option_id = request.POST.get('courier_option_id')
        obj_courier = get_object_or_404(OcTsgCourierOptions, pk=courier_option_id)
        obj_courier.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)


class MethodsCreate(CreateView):
    template_name = 'shipping/method-create.html'
    initial = {'store': 1, 'status': 1}
    model = OcTsgShippingMethod
    form_class = MethodsEditForm
    success_message = 'Success: Shipping method was created.'
    success_url = reverse_lazy('allmethods')


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = "Shipping"
        context['heading'] = "NEW shipping method"
        context['submit_text'] = "Create"
        return context



class MethodsUpdate(UpdateView):
    template_name = 'shipping/method-create.html'
    model = OcTsgShippingMethod
    form_class = MethodsEditForm
    success_message = 'Success: Shipping method was created.'
    success_url = reverse_lazy('allmethods')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pageview'] = "Shipping"
        context['heading'] = "Update shipping method"
        context['submit_text'] = "Update"
        return context


def methods_delete(request, pk):
    template_name = 'shipping/shipping_method-delete.html'
    data = dict()
    context = {}

    if request.method == 'POST':
        shipping_method_id = request.POST.get('shipping_method_id')
        obj_shipping_method = get_object_or_404(OcTsgShippingMethod, pk=shipping_method_id)
        obj_shipping_method.delete()
        data['form_is_valid'] = True

    else:
        context['pk'] = pk
        data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )
    return JsonResponse(data)
