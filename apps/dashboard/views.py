from django.shortcuts import render
from apps.dashboard import services as sv
from django.contrib.auth.decorators import permission_required
import datetime
from django.http import JsonResponse

from apps.orders.models import OcOrder, OcTsgPaymentMethod
from django.db.models import Sum
import datetime as dt
import pandas as pd



# Create your views here.
#@permission_required('group.sales')
def dashboard(request):
    template_name = 'dashboard/dashboard_main.html'
    context = {'heading': "Dashboard"}
    context['daily_today'] = datetime.datetime.now().strftime('%Y-%m-%d')
    #get the current year
    context['current_year'] = datetime.datetime.now().strftime('%Y')
    #get the current month
    context['current_month'] = datetime.datetime.now().strftime('%m')
    context['current_month_int'] = int(context['current_month'])
    #create a list of the years form this year to 2015
    months = []
    for m in range(1, 13):
        month_text = {'month': m, 'month_name': dt.date(1900, m, 1).strftime('%B')}
        months.append(month_text)

    years = []
    for y in range(int(context['current_year']), 2008, -1):
        years.append(y)

    context['years'] = years
    context['months'] = months

    #now get the order status
    live_sales_obj = OcOrder.objects.live()
    context['live_order_count'] = live_sales_obj.count()
    new_sales_obj = OcOrder.objects.new()
    context['new_order_count'] = new_sales_obj.count()


    return render(request, template_name, context)

def daily_sales_data(request):
    #see if we have a date passed in
    data = {}
    if request.GET.get('day_date'):
        start_date_str = request.GET.get('day_date')
        date_format = '%Y-%m-%d'
        start_date = dt.datetime.strptime(start_date_str, date_format)
    else: #set to todat
        start_date = dt.date.today()

    data = sv.get_daily_sales_by_method(start_date)
    return JsonResponse(data)

def weekly_sales_data(request):
    #see if we have a date passed in
    data = {}
    if request.GET.get('weekly_date'):
        start_date_str = request.GET.get('weekly_date')
        date_format = '%Y-%m-%d'
        start_date = dt.datetime.strptime(start_date_str, date_format)
    else: #set to todat
        start_date = dt.date.today()

    data = sv.get_weekly_sales_by_method(start_date)

    return JsonResponse(data)

def monthly_sales_data(request):
    #see if we have a date passed in
    data = {}
    if request.GET.get('month') and request.GET.get('year'):
        month_str = request.GET.get('month')
        year_str = request.GET.get('year')
        date_format = '%Y-%m-%d'
        start_date_str = year_str + '-' + month_str + '-01'
        start_date = dt.datetime.strptime(start_date_str, date_format)
    else: #set to todat
        start_date = dt.date.today()

    data = sv.get_monthly_sales_by_method(start_date)
    return JsonResponse(data)

