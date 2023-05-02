from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from apps.options.models import OcTsgOptionTypes, OcTsgOptionClassGroups, OcTsgOptionClass, OcTsgOptionValues, \
    OcTsgOptionClassGroupValues
from apps.options.forms import ClassEditForm, ValueEditForm, TypesEditForm, GroupEditForm, GroupValueEditForm
from apps.products.models import OcProduct, OcTsgProductVariantCore
from .serializers import OptionValuesSerializer, OptionGroupSerializer, OptionTypeSerializer, OptionClassSerializer, \
    OptionGroupValueSerializer
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView, DeleteView
import json
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template.loader import render_to_string



# Create your views here.

def option_list(request):
    template_name = 'options/option_list.html'
    context = {'pageview': 'All options'}
    return render(request, template_name, context)


def option_class_types(request):
    template_name = 'options/option_type_list.html'
    context = {'pageview': 'All Option Types'}
    return render(request, template_name, context)


def option_class_list(request):
    template_name = 'options/option_class_list.html'
    context = {'pageview': 'All Option Class'}
    return render(request, template_name, context)


def option_class_groups_list(request):
    template_name = 'options/option_group_list.html'
    context = {'pageview': 'Pre-defined Option Groups'}
    return render(request, template_name, context)


def option_values_list(request):
    template_name = 'options/option_value_list.html'
    context = {'pageview': 'All Values'}
    return render(request, template_name, context)


class OptionValues(viewsets.ModelViewSet):
    queryset = OcTsgOptionValues.objects.all()
    serializer_class = OptionValuesSerializer


class OptionGroups(viewsets.ModelViewSet):
    queryset = OcTsgOptionClassGroups.objects.all()
    serializer_class = OptionGroupSerializer

class OptionGroupsValues(viewsets.ModelViewSet):
    queryset = OcTsgOptionClassGroupValues.objects.all()
    serializer_class = OptionGroupValueSerializer

    def retrieve(self, request, *args, **kwargs):
        group_id = kwargs['pk']
        group_value_obj = OcTsgOptionClassGroupValues.objects.filter(group_id=group_id)
        serializer = self.get_serializer(group_value_obj, many=True)
        return Response(serializer.data)


class OptionTypes(viewsets.ModelViewSet):
    queryset = OcTsgOptionTypes.objects.all()
    serializer_class = OptionTypeSerializer


class OptionClass(viewsets.ModelViewSet):
    queryset = OcTsgOptionClass.objects.all()
    serializer_class = OptionClassSerializer


def option_class_create(request):
    template = 'options/sub_layout/option_class-create.html'
    context = {}
    context['heading'] = "Class"
    context['pageview'] = "New Class"

    if request.method == 'POST':
        form = ClassEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('alloptionsclass')
            return HttpResponseRedirect(success_url)

    else:
        class_obj = OcTsgOptionClass
        class_iniitials = {
            'label': 'New Label for dropdown',
            'descr': 'Description',
            'name': 'Class name',
            'default_dropdown_title': 'No Thanks',
            'order_by': 99
        }

    form = ClassEditForm(instance=class_obj, initial=class_iniitials)
    context['form'] = form
    return render(request, template, context)


def class_delete_dlg(request, pk):
    data = dict()
    context = {}

    if request.method == 'POST':
        class_id = request.POST.get('class_value_id')
        class_obj = get_object_or_404(OcTsgOptionClass, id=class_id)
        success_url = reverse_lazy('alloptionsclass')
        class_obj.delete()
        return HttpResponseRedirect(success_url)
    else:
        context['class_value_id'] = pk
        template_name = 'options/dialogs/class-delete.html'
        data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def group_delete_dlg(request, pk):
    data = dict()
    context = {}

    if request.method == 'POST':
        class_id = request.POST.get('group_id')
        class_obj = get_object_or_404(OcTsgOptionClassGroups, id=class_id)
        success_url = reverse_lazy('alloptionsgroups')
        class_obj.delete()
        return HttpResponseRedirect(success_url)
    else:
        context['group_id'] = pk
        template_name = 'options/dialogs/group-delete.html'
        data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


class OptionClassEdit(UpdateView):
    model = OcTsgOptionClass
    template_name = 'options/sub_layout/option_class-edit.html'
    form_class = ClassEditForm
    success_url = reverse_lazy('alloptionsclass')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Edit"
        context['pageview'] = "Class"
        return context


class OptionValueEdit(UpdateView):
    model = OcTsgOptionValues
    template_name = 'options/sub_layout/option_value-edit.html'
    form_class = ValueEditForm
    success_url = reverse_lazy('alloptionsvalues')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Edit"
        context['pageview'] = "Values"
        context['value_id'] = self.kwargs['pk']
        option_types_json = list(OcTsgOptionTypes.objects.all().values())
        for value_list in option_types_json:
            for key, value in value_list.items():
                if value == False:
                    value_list[key] = 'false'
                if value == True:
                    value_list[key] = 'true'
        context['option_types'] = option_types_json
        value_obj = self.object
        if value_obj.option_type.extra_product:
            product_obj = OcProduct.objects.filter(product_id=value_obj.product_id).first()
            context['product_obj'] = product_obj
            context['product_extra'] = True
        if value_obj.option_type.extra_variant:
            product_obj_variant = OcTsgProductVariantCore.objects.filter(prod_variant_core_id=value_obj.product_id).first()
            product_obj = product_obj_variant.product
            context['product_obj'] = product_obj
            context['product_variant_obj'] = product_obj_variant
            context['product_variant'] = True
        return context


def option_value_create(request):
    template = 'options/sub_layout/option_value-create.html'
    context = {}
    context['heading'] = "Values"
    context['pageview'] = "New Value"

    if request.method == 'POST':
        form = ValueEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('alloptionsvalues')
            return HttpResponseRedirect(success_url)

    else:
        value_obj = OcTsgOptionValues
        value_iniitials = {
            'option_type': 1,
            'title': 'New title',
            'dropdown_title': 'Dropdown ooption Value',
            'descr': 'Description',
            'internal_descr': 'Internal Description',
            'product_id': None,
            'price_modifier': 1.00,
            'show_at_checkout': True,

        }

    form = ValueEditForm(instance=value_obj, initial=value_iniitials)
    context['form'] = form
    return render(request, template, context)


def option_group_create(request):
    template = 'options/sub_layout/option_group-create.html'
    context = {}
    context['heading'] = "Groups"
    context['pageview'] = "New Value"

    if request.method == 'POST':
        form = GroupEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('alloptionsgroups')
            return HttpResponseRedirect(success_url)

    else:
        group_obj = OcTsgOptionClassGroups
        group_iniitials = {
            'name': 'New Group Name',
            'description': 'Group Description',
        }

    form = GroupEditForm(instance=group_obj, initial=group_iniitials)
    context['form'] = form
    return render(request, template, context)


class OptionTypeEdit(UpdateView):
    model = OcTsgOptionTypes
    template_name = 'options/sub_layout/option_type-edit.html'
    form_class = TypesEditForm
    success_url = reverse_lazy('alloptionstype')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Edit"
        context['pageview'] = "Types"
        return context


def option_value_product(request):
    template_name = 'options/dialogs/value_product.html'
    data = dict()
    if request.method == 'POST':
        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         request=request
                                         )
    return JsonResponse(data)

def option_value_variant(request):
    template_name = 'options/dialogs/value_product_variants.html'
    data = dict()
    if request.method == 'POST':
        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False

    # return render(request, template_name, context)
    data['html_form'] = render_to_string(template_name,
                                         request=request
                                         )
    return JsonResponse(data)


def option_value_product_details(request):
    context = {}
    data = dict()
    template_name = 'options/sub_layout/option_value-product.html'
    if request.method == 'POST':
        product_id = int(request.POST.get('product_id', None))
        product_obj = OcProduct.objects.filter(product_id=product_id).first()
        context['new_product_obj'] = product_obj
        data['product_id'] = product_id
        data['form_is_valid'] = True
        context['value_id'] = 1
    else:
        context['new_product_obj'] = None
        data['product_id'] = None
        data['form_is_valid'] = False

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)

def option_value_product_variant_details(request):
    context = {}
    data = dict()
    template_name = 'options/sub_layout/option_value-variant.html'
    if request.method == 'POST':
        product_id = int(request.POST.get('product_id', None))
        product_obj_variant = OcTsgProductVariantCore.objects.filter(prod_variant_core_id=product_id).first()
        product_obj = product_obj_variant.product
        context['new_product_obj'] = product_obj
        context['new_product_variant_obj'] = product_obj_variant
        context['product_variant'] = True
        context['value_id'] = 1
        data['product_id'] = product_id
        data['form_is_valid'] = True
    else:
        context['new_product_obj'] = None
        context['new_product_variant_obj'] = None
        data['product_id'] = None
        data['form_is_valid'] = False

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


class OptionGroupEdit(UpdateView):
    model = OcTsgOptionClassGroups
    template_name = 'options/sub_layout/option_group-edit.html'
    form_class = GroupEditForm
    success_url = reverse_lazy('alloptionsgroups')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['heading'] = "Edit"
        context['pageview'] = "Group"
        context['group_id'] = self.kwargs['pk']
        return context


def group_value_edit_dlg(request, pk):
    context = {}
    data = dict()

    if request.method == 'POST':
        form_obj = GroupValueEditForm(request.POST)
        if form_obj.is_valid():
            form_instance = form_obj.instance
            form_instance.id = pk
            form_instance.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False


    group_value_obj = get_object_or_404(OcTsgOptionClassGroupValues, id=pk)
    form_obj = GroupValueEditForm(instance=group_value_obj)
    context['form'] = form_obj
    context['group_value_id'] = pk
    template_name = 'options/dialogs/group_value-edit.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)


def group_value_create_dlg(request, pk):
    context = {}
    data = dict()

    if request.method == 'POST':
        form_obj = GroupValueEditForm(request.POST)
        if form_obj.is_valid():
            form_obj.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    else:
        group_val_initial = {'group': pk, 'order_id': 99, 'class_field': 1, 'value': 1}
        group_value_obj = OcTsgOptionClassGroupValues()
        form_obj = GroupValueEditForm(instance=group_value_obj, initial=group_val_initial)

    context['form'] = form_obj
    template_name = 'options/dialogs/group_value-create.html'
    data['html_form'] = render_to_string(template_name,
                                             context,
                                             request=request
                                             )

    return JsonResponse(data)


class GroupValueDelete(DeleteView):
    model = OcTsgOptionClassGroupValues
    form_class = GroupValueEditForm
    success_message = 'Group Value deleted'

    def get_success_url(self):
        return reverse_lazy('group-edit', kwargs={'pk': self.kwargs['pk']})


def group_value_delete_dlg(request, pk):
    data = dict()
    context = {}

    if request.method == 'POST':
        value_group_id = request.POST.get('group_value_id')
        group_value_obj = get_object_or_404(OcTsgOptionClassGroupValues, id=value_group_id)
        success_url = reverse_lazy('group-edit', kwargs={'pk': group_value_obj.group_id})
        group_value_obj.delete()
        return HttpResponseRedirect(success_url)
    else:
        context['group_value_id'] = pk
        template_name = 'options/dialogs/group_value-delete.html'
        data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )
    return JsonResponse(data)