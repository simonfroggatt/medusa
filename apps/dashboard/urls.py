from django.urls import path
from rest_framework import routers
from django.urls import include
from apps.dashboard import views

router = routers.SimpleRouter()

urlpatterns = [
    path('api/', include(router.urls)),
    path('data/chart/daily-sales', views.daily_sales_data, name='data_daily_sales'),
    path('data/chart/weekly-sales', views.weekly_sales_data, name='data_weekly_sales'),
    path('data/chart/monthly-sales', views.monthly_sales_data, name='data_monthly_sales'),
    path('', views.dashboard, name='dashboard')
    ]
