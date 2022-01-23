from django.shortcuts import render
from rest_framework import viewsets
from apps.options.models import OcTsgOptionTypes, OcTsgOptionClassBase, OcTsgOptionClassGroups, OcTsgOptionValuesBase
from .serializers import OptionValueBaseSerializer, OptionGroupSerializer, OptionTypeSerializer, OptionClassSerializer


# Create your views here.

def option_list(request):
    template_name = 'options/option_list.html'
    context = {'pageview': 'All options'}
    return render(request, template_name, context)


def option_class_types(request):
    template_name = 'options/option_type_list.html'
    context = {'pageview': 'All Option Types'}

    types = OcTsgOptionTypes.objects.all();
    context['option_types'] = types;
    return render(request, template_name, context)


def option_class_list(request):
    template_name = 'options/option_class_list.html'
    context = {'pageview': 'All Option Class'}

    types = OcTsgOptionClassBase.objects.all();
    context['option_class'] = types;

    return render(request, template_name, context)


def option_class_groups_list(request):
    template_name = 'options/option_group_list.html'
    context = {'pageview': 'Pre-defined Option Groups'}

    groups = OcTsgOptionClassGroups.objects.all();
    context['option_groups'] = groups;
    return render(request, template_name, context)


def option_values_list(request):
    template_name = 'options/option_value_list.html'
    context = {'pageview': 'All Values'}

    values = OcTsgOptionValuesBase.objects.all();
    context['option_values'] = values;
    return render(request, template_name, context)


class OptionValues(viewsets.ModelViewSet):
    queryset = OcTsgOptionValuesBase.objects.all()
    serializer_class = OptionValueBaseSerializer


class OptionGroups(viewsets.ModelViewSet):
    queryset = OcTsgOptionClassGroups.objects.all()
    serializer_class = OptionGroupSerializer


class OptionTypes(viewsets.ModelViewSet):
    queryset = OcTsgOptionTypes.objects.all()
    serializer_class = OptionTypeSerializer


class OptionClass(viewsets.ModelViewSet):
    queryset = OcTsgOptionClassBase.objects.all()
    serializer_class = OptionClassSerializer
