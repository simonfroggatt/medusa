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
router.register(r'product_option_values', views.AllProductOptionValues)

urlpatterns = [
    path('api/', include(router.urls)),

#classes
    path('class', views.option_class_list, name='alloptionsclass'),
    path('class/<int:pk>', views.OptionClassEdit.as_view(), name='class-edit'),
    path('class/create', views.option_class_create, name='class-create'),
    path('class/delete/<int:pk>', views.class_delete_dlg, name='class-delete-dlg'),
#groups
    path('groups', views.option_class_groups_list, name='alloptionsgroups'),
    path('group/create', views.option_group_create, name='group-create'),
    path('group/<int:pk>', views.OptionGroupEdit.as_view(), name='group-edit'),
    path('group/delete/<int:pk>', views.group_delete_dlg, name='group-delete-dlg'),
    path('group/value/edit/<int:pk>', views.group_value_edit_dlg, name='group_value-edit-dlg'),
    path('group/value/create/<int:pk>', views.group_value_create_dlg, name='group_value-create-dlg'),
    path('group/value/delete/<int:pk>', views.group_value_delete_dlg, name='group_value-delete-dlg'),
#values
    path('values', views.option_values_list, name='alloptionsvalues'),
    path('values/<int:pk>', views.OptionValueEdit.as_view(), name='value-edit'),
    path('value/create', views.option_value_create, name='value-create'),
    path('value/product', views.option_value_product, name='choose_option_value_product'),
    path('value/productvariant', views.option_value_variant, name='choose_option_value_variant'),
    path('api/value/product/', views.option_value_product_details, name='option_value_product-details'),
    path('api/value/product-variant/', views.option_value_product_variant_details,
         name='option_value_product_variant-details'),
#types
    path('type', views.option_class_types, name='alloptionstype'),
    path('types/<int:pk>', views.OptionTypeEdit.as_view(), name='type-edit'),


#pre-defined class values
    path('api/class/values/<class_id>', views.PredefinedClassValues.as_view({'get': 'list'}), name='option_class_predefined_values'),
    path('api/class/values/<class_id>/exclude', views.PredefinedClassValuesExcluded.as_view({'get': 'list'}), name='option_class_predefined_values-excluded'),
    path('api/class/values/<class_id>/valueadd/<int:option_value_id>', views.predefinedClassValuesAdd, name='option_class_predefined_values-add'),
    path('api/class/values/valueremove/<int:class_option_value_id>', views.predefinedClassValuesRemove, name='option_class_predefined_values-remove'),
    path('api/class/values/valueorder/<int:class_option_value_id>', views.predefinedClassValuesOrder, name='option_class_predefined_values-order'),


#production options
    path('productoptions', views.productOptions_list, name='allproductoptions'),
    path('productoptions/create', views.productOptions_create, name='allproductoptions-create'),
    path('productoptions/<int:pk>/edit', views.productOptions_edit, name='allproductoptions-edit'),
    path('productoptions/<int:pk>/delete', views.productOptions_delete, name='allproductoptions-delete'),

    path('productoptions_values', views.productOptionsValue_list, name='allproductoptions_values'),
    path('productoptions_values/create', views.productOptionsValue_create, name='allproductoptions_values-create'),
    path('productoptions_values/<int:pk>/edit', views.productOptionsValue_edit, name='allproductoptions_value-edit'),
    path('productoptions_values/<int:pk>/delete', views.productOptionsValue_delete, name='allproductoptions_value-delete'),
    ]

