from django.urls import path
from apps.quotes import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'quotes', views.Quotes_asJSON)

urlpatterns = [
    url('^api/', include(router.urls)),
    path('<int:quote_id>/edit', views.quote_details_edit, name='quotedetailsedit'),
    path('<int:quote_id>', views.quote_details, name='quote_details'),
    path('<int:quote_id>/product/add/', views.quote_add_product,
         name='quoteproductadd'),
    path('', views.quote_list, name='allquotes'),
    ]



