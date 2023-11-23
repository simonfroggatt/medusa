from django.urls import path
from apps.options import views
from rest_framework import routers
from django.urls import include

router = routers.SimpleRouter()
router.register(r'values', views.OptionValues)
router.register(r'groups', views.OptionGroups)
router.register(r'group_values', views.OptionGroupsValues)
router.register(r'types', views.OptionTypes)
router.register(r'class', views.OptionClass)



urlpatterns = [
    path('', views.option_list, name='alloptions'),
    path('api/', include(router.urls)),
    path('class', views.option_class_list, name='alloptionsclass'),
    path('class/create', views.option_class_create, name='class-create'),
    path('value/create', views.option_value_create, name='value-create'),
    path('group/create', views.option_group_create, name='group-create'),
    path('type', views.option_class_types, name='alloptionstype'),
    path('values', views.option_values_list, name='alloptionsvalues'),
    path('groups', views.option_class_groups_list, name='alloptionsgroups'),
    path('class/<int:pk>', views.OptionClassEdit.as_view(), name='class-edit'),
    path('class/delete/<int:pk>', views.class_delete_dlg, name='class-delete-dlg'),
    path('group/<int:pk>', views.OptionGroupEdit.as_view(), name='group-edit'),
    path('group/delete/<int:pk>', views.group_delete_dlg, name='group-delete-dlg'),
    path('group/value/edit/<int:pk>', views.group_value_edit_dlg, name='group_value-edit-dlg'),
    path('group/value/create/<int:pk>', views.group_value_create_dlg, name='group_value-create-dlg'),
    path('group/value/delete/<int:pk>', views.group_value_delete_dlg, name='group_value-delete-dlg'),
    path('values/<int:pk>', views.OptionValueEdit.as_view(), name='value-edit'),
    path('types/<int:pk>', views.OptionTypeEdit.as_view(), name='type-edit'),
    path('value/product', views.option_value_product, name='choose_option_value_product'),
    path('value/productvariant', views.option_value_variant, name='choose_option_value_variant'),
    path('api/value/product/', views.option_value_product_details, name='option_value_product-details'),
    path('api/value/product-variant/', views.option_value_product_variant_details, name='option_value_product_variant-details')
    ]