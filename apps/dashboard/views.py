from django.shortcuts import render
from apps.dashboard import services as sv
from django.contrib.auth.decorators import permission_required



# Create your views here.
@permission_required('group.sales')
def dashboard(request):
    template_name = 'dashboard/dashboard_main.html'
    context = {'heading': "Dashboard"}
    daily = sv.get_daily_sales_by_method()
    weekly = sv.get_weekly_sales_by_method()
    monthly_data = sv.get_monthly_sales_by_method()
    context['daily_by_method'] = daily
    context['weekly_by_method'] = weekly
    context['monthly_by_method'] = monthly_data['datapoint']
    context['monthly_range'] = monthly_data['range']
    #sv.range_stats('D')
    #sv.range_stats('W')
    #sv.range_stats('M')
    return render(request, template_name, context)