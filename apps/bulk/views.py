from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse_lazy
from rest_framework import viewsets, generics
from rest_framework.response import Response
from apps.products.models import OcTsgBulkdiscountGroups, OcTsgBulkdiscountGroupBreaks
from .seriailizers import BulkdiscountGroupsSerialiser, BulkdiscountGroupBreaksSerialiser
from .forms import BulkGroupEditForm

class BulkGroups(viewsets.ModelViewSet):
    queryset = OcTsgBulkdiscountGroups.objects.all()
    serializer_class = BulkdiscountGroupsSerialiser


def bulk_list(request):
    template_name = 'bulk/bulk_list.html'
    context = {'pageview': 'All Bulk pricing'}
    return render(request, template_name, context)


def bulk_group_edit(request, pk):
    template_name = 'bulk/bulk_group_edit.html'
    context = {}
    context['heading'] = "Bulk Group"

    bulk_group_obj = get_object_or_404(OcTsgBulkdiscountGroups, pk=pk)
    context['pageview'] = bulk_group_obj.group_name

    form = BulkGroupEditForm(instance=bulk_group_obj)
    context['form'] = form
    context['bulk_group_obj'] = bulk_group_obj

    if request.method == 'POST':
        form = BulkGroupEditForm(request.POST)
        if form.is_valid():
            form.save()
            success_url = reverse_lazy('allbulks')
            return HttpResponseRedirect(success_url)
    else:
        context['form'] = form

    return render(request, template_name, context)


class bulk_group_breaks_list(generics.ListAPIView):
    serializer_class = BulkdiscountGroupBreaksSerialiser
    model = serializer_class.Meta.model

    def get_queryset(self, bulk_group_id=0):
        if self.kwargs['bulk_group_id']:
            bulk_group_id = self.kwargs['bulk_group_id']
        else:
            bulk_group_id = 1

        queryset = self.model.objects.filter(bulk_discount_group__bulk_group_id=bulk_group_id).order_by('discount_percent')
        return queryset

