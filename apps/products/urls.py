from django.urls import path
from apps.products import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'productslist', views.base_product_list_asJSON)
router.register(r'productsite', views.ProductSite)
router.register(r'categories', views.Category)
router.register(r'related', views.Related)
router.register(r'productsymbols', views.ProductSymbols)
router.register(r'productsymbols-available', views.ProductSymbolsAvailable)
router.register(r'product_core_variant_options', views.ProductCoreVariantOption)
router.register(r'product_site_variant_options', views.ProductSiteVariantOption)





urlpatterns = [
    url('^api/', include(router.urls)),
    url('^api/post-list/products', views.ProductsListView.as_view(), name='products_post_list'),
    path('api/productsite/<int:product_id>/<int:store_id>', views.ProductSite.as_view({'get': 'list'}), name='products_site_list'),
    path('api/product/<int:product_id>/addproductsymbol/<int:symbol_id>', views.add_product_symbol, name='products_symbol_add'),
    path('api/product/<int:product_id>/deleteproductsymbol/<int:symbol_id>', views.delete_product_symbol, name='products_symbol_delete'),

    path('api/corevariants/<int:product_id>', views.BaseVariantListView.as_view({'get': 'list'}), name='corevariant'),
    path('api/corevariants/<int:product_id>/exclude/<int:store_id>', views.CoreVariantProductStoreExcludeListView.as_view({'get': 'list'}), name='corevariantexclude'),

    path('api/storevariants/<int:product_id>/<int:store_id>', views.StoreVariantListView.as_view({'get': 'list'}), name='sitevariant'),

    #path('api/storevariantsreverse/<int:product_id>/<int:store_id>', views.StoreVariantListViewReverse.as_view({'get': 'list'}), name='sitevariantreverse'),


    path('api/storeadd', views.product_store_add_text, name='productstoreadd'),
    path('api/variantstore/<int:pk>', views.get_product_variant_stores, name='productvariantstorelist'),

    path('variant/<int:core_variant_id>/option/add', views.product_variant_core_add_option, name='product_variant_core_option-add'),
    path('variant/<int:pk>/option/edit', views.product_variant_core_edit_option, name='product_variant_core_option-edit'),
    path('variant/<int:pk>/option/delete', views.product_variant_core_delete_option, name='product_variant_core_option-delete'),
    path('sitevariant/<int:pk>/option/edit', views.site_variant_edit_option, name='site_variant_core_option-edit'),
    path('sitevariant/<int:pk>/edit', views.site_variant_edit, name='site_variant-edit'),
    path('sitevariant/<int:pk>/option/add', views.site_variant_options_edit, name='site_variant_option-add'),
    path('variant/<int:core_variant_id>/group_option/add', views.product_variant_core_add_group_option,
         name='product_variant_core_group_option-add'),
    path('<int:pk>/corevariant/add', views.product_core_variant_add, name='product_core_variant-add'),


    #called when adding a new core variant to a product from a given site
    path('sitevariant/add/<int:core_variant_id>/<int:store_id>', views.product_variant_site_add, name='product_variant_site-add'),
    path('sitevariant/delete/<int:product_variant_id>', views.product_variant_site_delete, name='product_variant_site-delete'),
    path('<int:pk>/variant/add_dlg', views.product_variant_site_add_dlg, name='product_variant_site-add-dlg'),

    path('corevariant/<int:pk>/edit', views.product_core_variant_edit, name='product_core_variant-edit'),

    # given a site - get a list of all the variants


    path('related/<int:pk>/add', views.related_item_add, name='related_product-add'),
    path('related/<int:pk>/edit', views.related_item_edit, name='related_product-edit'),
    path('related/<int:pk>/delete', views.related_item_delete, name='related_product-delete'),


    path('group_class/<int:group_id>', views.group_class_list_html, name='group_class_values'),
    path('<int:product_id>', views.product_details, name='product_details'),
    path('<int:product_id>/edit', views.product_edit_base, name='product_base_details_edit'),

    path('<int:pk>/categoryedit', views.product_category_edit, name='productcatgoryedit'),
    path('<int:pk>/storeedit', views.ProductSiteUpdate.as_view(), name='product_store_details_edit'),
    path('<int:pk>/storeadddlg', views.product_store_add_text_dlg, name='productstoreadd_dlg'),

    path('test/<int:pk>/<store_id>', views.test, name='test'),

   # path('variant-options/<int:core_variant_id>', views.core_variant_options_class, name='corevariantoptions'),
    path('', views.product_list, name='allproducts'),

    ]