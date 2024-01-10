from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from django.urls import include
from apps.shipping import views

router = routers.SimpleRouter()
router.register(r'couriers', views.Couriers)
router.register(r'couriers/options', views.CourierOptions)
router.register(r'methods', views.Methods)


urlpatterns = [
    path('api/', include(router.urls)),
   # path('api/courier/<int:courier_id>/options/', views.CourierOptions().as_view({'get': 'list'}), name='courier_options'),
    path('couriers', views.courier_list, name='allcouriers'),
    path('couriers/create/', views.CourierCreate.as_view(), name='courier_create'),
    path('couriers/update/<int:pk>', views.CourierUpdate.as_view(), name='courier_update'),
    path('couriers/delete_confirm/<int:pk>', views.courier_delete, name='courier_delete_confirm'),

    path('couriers/update/<int:pk>/option/add', views.courier_option_add, name='courier_option_add'),
    path('couriers/update/option/<int:pk>/update', views.courier_option_edit, name='courier_option_edit'),
    path('couriers/update/option/<int:pk>/delete', views.courier_option_delete, name='courier_delete_confirm'),

    path('methods', views.methods_list, name='allmethods'),
    path('methods/create/', views.MethodsCreate.as_view(), name='method_create'),
    path('methods/update/<int:pk>', views.MethodsUpdate.as_view(), name='method_update'),
    path('methods/delete_confirm/<int:pk>', views.methods_delete, name='method_delete_confirm'),

    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)