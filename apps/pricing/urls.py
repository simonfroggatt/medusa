from django.urls import path
from rest_framework import routers
from django.urls import include
from apps.pricing import views

router = routers.SimpleRouter()
router.register(r'sizes', views.Sizes)
router.register(r'materials', views.Materials)
router.register(r'sizematerials', views.SizeMaterials)
#router.register(r'prices', views.BasePrices.as_view())
router.register(r'storeprices', views.StorePrices)
router.register(r'bespokeprices', views.BespokePrices)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/prices/', views.BasePrices.as_view()),
    path('sizes/', views.all_sizes, name='allsizes'),
    path('sizes/create/', views.size_create, name='create_size'),
    path('sizes/<int:pk>/edit/', views.SizeUpdateView.as_view(), name='edit_size'),
    path('sizes/<int:pk>/delete/', views.sizes_delete, name='delete_size'),
    path('materials/', views.all_materials, name='allmaterials'),
    path('materials/create/', views.material_create, name='create_material'),
    path('materials/edit/<int:pk>', views.MaterialUpdateView.as_view(), name='edit_material_dlg'),
    path('materials/<int:pk>/update', views.MaterialUpdateView.as_view(), name='edit_material'),
    path('materials/exclude_size/<int:size_id>', views.materials_excl_sizes.as_view(), name='materials_exclude_size'),
   # path('materials/edittest/<int:material_id>', views.material_test, name='edit_material'),
    path('materials/<int:pk>/delete/', views.material_delete, name='delete_material'),
    #path('prices/', views.all_base_prices, name='allbaseprices'),
    path('prices/', views.all_prices, name='allprices'),
    path('prices/create', views.create_price, name='create_price'),
    path('prices/<int:pk>/edit', views.PriceComboUpdate.as_view(), name='basepriceupdate'),
    path('quick/', views.quick_prices, name='quickprices'),
    path('prices/<int:pk>/store/edit', views.store_price_combo_change, name='storepricecomboedit'),
    path('prices/<int:pk>/store/delete', views.store_price_combo_delete, name='storepricecombodelete'),
    path('prices/<int:size_material_id>/store/create', views.store_price_combo_create, name='storepricecombocreate'),
    path('materials/details/<int:material_id>', views.material_details, name='materialdetails'),
    ]