from django.urls import path
from rest_framework import routers
from django.conf.urls import url, include
from apps.pricing import views

router = routers.SimpleRouter()
router.register(r'sizes', views.Sizes)
router.register(r'materials', views.Materials)
router.register(r'prices', views.BasePrices)
router.register(r'storeprices', views.StorePrices)
router.register(r'bespokeprices', views.BespokePrices)

urlpatterns = [
    url('^api/', include(router.urls)),
    path('sizes/', views.all_sizes, name='allsizes' ),
    path('sizes/create/', views.SizeCreateView.as_view(), name='create_size'),
    path('sizes/edit/<int:pk>', views.SizeUpdateView.as_view(), name='edit_size'),
    path('sizes/delete/<int:pk>', views.SizeDeleteView.as_view(), name='delete_size'),
    path('materials/', views.all_materials, name='allmaterials'),
    path('materials/create/', views.MaterialCreateView.as_view(), name='create_material'),
    path('materials/edit/<int:pk>', views.MaterialUpdateView.as_view(), name='edit_material_dlg'),
    path('materials/<int:pk>/update', views.MaterialUpdateView.as_view(), name='edit_material'),
   # path('materials/edittest/<int:material_id>', views.material_test, name='edit_material'),
    path('materials/delete/<int:pk>', views.MaterialDeleteView.as_view(), name='delete_material'),
    path('prices/', views.all_base_prices, name='allbaseprices'),
    path('quick/', views.quick_prices, name='quickprices'),
    path('materials/details/<int:material_id>', views.material_details, name='materialdetails'),
    ]