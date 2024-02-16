from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from apps.options.models import OcTsgOptionTypes, OcTsgOptionClassGroups, OcTsgOptionClass, OcTsgOptionValues, \
    OcTsgOptionClassGroupValues, OcTsgOptionValues, OcTsgOptionClassValues, OcOption, OcOptionDescription, \
    OcOptionValue, OcOptionValueDescription
from apps.options.forms import ClassEditForm, ValueEditForm, TypesEditForm, GroupEditForm, GroupValueEditForm, \
    ClassValuesOrderForm, ProductOptionValueDescForm, ProductOptionValueForm, ProductOptionForm, ProductOptionDescForm
from apps.products.models import OcProduct, OcTsgProductVariantCore
from .serializers import OptionValuesSerializer, OptionGroupSerializer, OptionTypeSerializer, OptionClassSerializer, \
    OptionGroupValueSerializer, OptionClassPredefinedValuesSerializer, ProductOptionValueDescSerializer, \
    ProductOptionsDescSerializer
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView, DeleteView
import json
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template.loader import render_to_string
from itertools import chain


class AllProductOptions(viewsets.ModelViewSet):
    queryset = OcOptionDescription.objects.all()
    serializer_class = ProductOptionsDescSerializer

    def get_queryset(self):
        return super().get_queryset().filter(language_id=1)


class AllProductOptionValues(viewsets.ModelViewSet):
    queryset = OcOptionValueDescription.objects.all()
    serializer_class = ProductOptionValueDescSerializer

    def get_queryset(self):
        return super().get_queryset().filter(language_id=1)


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


class OptionClassValues(viewsets.ModelViewSet):
    queryset = OcTsgOptionValues.objects.all()
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
        context['class_id'] = self.kwargs['pk']
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


        context['option_types'] = option_types_json
        value_obj = self.object
        context['product_extra'] = False
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


#pre-defined class values
class PredefinedClassValues(viewsets.ModelViewSet):
    queryset = OcTsgOptionClassValues.objects.all()
    serializer_class = OptionClassPredefinedValuesSerializer

    def list(self, request, *args, **kwargs):
        class_id = kwargs['class_id']
        class_list_obj = OcTsgOptionClassValues.objects.filter(option_class_id=class_id)

        serializer = self.get_serializer(class_list_obj, many=True)
        return Response(serializer.data)


class PredefinedClassValuesExcluded(viewsets.ModelViewSet):
    queryset = OcTsgOptionValues.objects.all()
    serializer_class = OptionValuesSerializer

    def list(self, request, *args, **kwargs):
        class_id = kwargs['class_id']

        class_value_list_obj = OcTsgOptionClassValues.objects.filter(option_class_id=class_id).values_list('option_value_id')

        class_value_list = list(chain(*class_value_list_obj))

        value_qs = OcTsgOptionValues.objects.exclude(pk__in=class_value_list)

        serializer = self.get_serializer(value_qs, many=True)
        return Response(serializer.data)


def predefinedClassValuesAdd(request, class_id, option_value_id):
    data = dict()

    if request.method == 'POST':
        current_class_count = OcTsgOptionClassValues.objects.filter(option_class_id=class_id).count()
        new_class_value_obj = OcTsgOptionClassValues()
        new_class_value_obj.option_class_id = class_id
        new_class_value_obj.option_value_id = option_value_id
        new_class_value_obj.order = current_class_count + 1
        new_class_value_obj.save()
        data['is_saved'] = True
    else:
        data['is_saved'] = False

    return JsonResponse(data)


def predefinedClassValuesRemove(request, class_option_value_id):
    data = dict()

    if request.method == 'POST':
        class_option_value_obj = get_object_or_404(OcTsgOptionClassValues, pk=class_option_value_id)
        class_option_value_obj.delete()
        data['is_saved'] = True
    else:
        data['is_saved'] = False

    return JsonResponse(data)


def predefinedClassValuesOrder(request, class_option_value_id):
    context = {}
    data = dict()

    if request.method == 'POST':
        form_obj = ClassValuesOrderForm(request.POST)
        if form_obj.is_valid():
            class_option_value_obj = get_object_or_404(OcTsgOptionClassValues, pk=class_option_value_id)
            form_instance = form_obj.instance
            class_option_value_obj.order = form_instance.order
            class_option_value_obj.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

    else:
        class_option_value_obj = get_object_or_404(OcTsgOptionClassValues, pk=class_option_value_id)
        form_obj = ClassValuesOrderForm(instance=class_option_value_obj)

    context['form'] = form_obj
    context['class_option_value_id'] = class_option_value_id
    template_name = 'options/dialogs/class_option_values_changeorder.html'
    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


#product opions - the old opencart rubbish

def productOptions_list(request):
    template_name = 'options/product_option_list.html'
    context = {'pageview': 'All Product options'}
    return render(request, template_name, context)

def productOptions_create(request):
    data = dict()
    return JsonResponse(data)


def productOptions_edit(request, pk):
    data = dict()
    context = dict()
    template_name = 'options/dialogs/product_options-edit.html'
    class_option_desc_obj = get_object_or_404(OcOptionDescription, pk=pk)
    class_option_obj = class_option_desc_obj.option

    if request.method == 'POST':
        form_option = ProductOptionForm(request.POST, instance=class_option_obj)
        form_option_desc = ProductOptionDescForm(request.POST, instance=class_option_desc_obj)
        if form_option.is_valid():
            form_option.save();
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

        if form_option_desc.is_valid():
            form_option_desc.save();
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

        context['form_option'] = form_option
        context['form_option_desc'] = form_option_desc
    else:
        data['form_is_valid'] = False
        context['form_option'] = ProductOptionForm(instance=class_option_obj)
        context['form_option_desc'] = ProductOptionDescForm(instance=class_option_desc_obj)

    context['dialog_title'] = "<strong>Edit</strong> OPTION"
    context['action_url'] = reverse_lazy('allproductoptions-edit', kwargs={'pk': pk})
    context['form_id'] = 'form-product_options'

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def productOptions_create(request):
    data = dict()
    context = dict()
    template_name = 'options/dialogs/product_options-edit.html'
    class_option_obj = OcOption()
    class_option_desc_obj = OcOptionDescription()


    if request.method == 'POST':
        form_option = ProductOptionForm(request.POST)

        if form_option.is_valid():
            new_option = form_option.save()
            request.POST._mutable = True
            request.POST['option'] = new_option
            form_option_desc = ProductOptionDescForm(request.POST)
            if form_option_desc.is_valid():
                form_option_desc.save()
                data['form_is_valid'] = True
            else:
                data['form_is_valid'] = False
        else:
            data['form_is_valid'] = False

        context['form_option'] = form_option
        context['form_option_desc'] = form_option_desc
    else:
        data['form_is_valid'] = False
        product_option_initials = {'sort_order': 1, 'type': 1}
        context['form_option'] = ProductOptionForm(instance=class_option_obj, initial=product_option_initials)
        product_option_desc_initials = {'option': class_option_obj, 'language': 1, 'name':'new option'}
        context['form_option_desc'] = ProductOptionDescForm(instance=class_option_desc_obj, initial=product_option_desc_initials)

    context['dialog_title'] = "<strong>Edit</strong> OPTION"
    context['action_url'] = reverse_lazy('allproductoptions-create')
    context['form_id'] = 'form-product_options'

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def productOptions_delete(request, pk):
    data = dict()
    context = dict()
    template_name = 'options/dialogs/product_option_values-delete.html'
    if request.method == 'POST':
        product_option_obj = get_object_or_404(OcOption, pk=pk)
        product_option_obj.delete()
        data['form_is_valid'] = True
    else:
        context['dialog_title'] = "<strong>DELETE</strong> OPTION"
        context['action_url'] = reverse_lazy('allproductoptions-delete', kwargs={'pk': pk})
        context['form_id'] = 'form-product_options'
        context['option_id'] = pk
        data['form_is_valid'] = False

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)

#product opions values - the old opencart rubbish

def productOptionsValue_list(request):
    template_name = 'options/product_option_values_list.html'
    context = {'pageview': 'All Product Option Value'}
    return render(request, template_name, context)


def productOptionsValue_create(request):
    data = dict()
    context = dict()
    template_name = 'options/dialogs/product_option_values-edit.html'
    class_option_value_obj = OcOptionValue()
    class_option_value_desc_obj = OcOptionValueDescription()

    if request.method == 'POST':
        form_values = ProductOptionValueForm(request.POST)
        if form_values.is_valid():
            new_value = form_values.save()
            request.POST._mutable = True
            request.POST['option_value'] = new_value
            form_desc = ProductOptionValueDescForm(request.POST)
            if form_desc.is_valid():
                form_desc.save();
                data['form_is_valid'] = True
            else:
                data['form_is_valid'] = False
        else:
            data['form_is_valid'] = False

        context['form_value'] = form_values
        context['form_desc'] = form_desc
    else:
        data['form_is_valid'] = False
        product_option_obj = OcOption.objects.all().first()
        class_option_value_initial = {'sort_order': 1, 'option': product_option_obj}
        context['form_value'] = ProductOptionValueForm(instance=class_option_value_obj, initial=class_option_value_initial)
        class_option_value_desc_initials = {'option_value': class_option_value_obj, 'language': 1, 'name': 'New Value'}
        context['form_desc'] = ProductOptionValueDescForm(instance=class_option_value_desc_obj, initial=class_option_value_desc_initials)

    context['dialog_title'] = "<strong>Edit</strong> option VALUE"
    context['action_url'] = reverse_lazy('allproductoptions_values-create')
    context['form_id'] = 'form-product_options_values'

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def productOptionsValue_edit(request, pk):
    data = dict()
    context = dict()
    template_name = 'options/dialogs/product_option_values-edit.html'
    class_option_value_desc_obj = get_object_or_404(OcOptionValueDescription, pk=pk)
    class_option_value_obj = class_option_value_desc_obj.option_value

    if request.method == 'POST':
        form_values = ProductOptionValueForm(request.POST, instance=class_option_value_obj)
        form_desc = ProductOptionValueDescForm(request.POST, instance=class_option_value_desc_obj)
        if form_values.is_valid():
            form_values.save();
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

        if form_desc.is_valid():
            form_desc.save();
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False

        context['form_value'] = form_values
        context['form_desc'] = form_desc
    else:
        data['form_is_valid'] = False
        context['form_value'] = ProductOptionValueForm(instance=class_option_value_obj)
        context['form_desc'] = ProductOptionValueDescForm(instance=class_option_value_desc_obj)

    context['dialog_title'] = "<strong>Edit</strong> option VALUE"
    context['action_url'] = reverse_lazy('allproductoptions_value-edit', kwargs={'pk': pk})
    context['form_id'] = 'form-product_options_values'

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


def productOptionsValue_delete(request, pk):
    data = dict()
    context = dict()
    template_name = 'options/dialogs/product_option_values-delete.html'
    if request.method == 'POST':
        class_option_value_obj = get_object_or_404(OcOptionValue, pk=pk)
        class_option_value_obj.delete()
        data['form_is_valid'] = True
    else:
        context['dialog_title'] = "<strong>DELETE</strong> option VALUE"
        context['action_url'] = reverse_lazy('allproductoptions_value-delete', kwargs={'pk': pk})
        context['form_id'] = 'form-product_options_values'
        context['option_id'] = pk
        data['form_is_valid'] = False

    data['html_form'] = render_to_string(template_name,
                                         context,
                                         request=request
                                         )

    return JsonResponse(data)


