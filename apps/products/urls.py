from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from apps.products import views
from rest_framework import routers
from django.urls import include

router = routers.SimpleRouter()
router.register(r'productslist', views.base_product_list_asJSON)
router.register(r'productsite', views.ProductSite)
router.register(r'categories', views.Category)
router.register(r'related', views.Related)
router.register(r'productsymbols', views.ProductSymbols)
#router.register(r'productsymbols-available', views.ProductSymbolsAvailable)
router.register(r'product_core_variant_options', views.ProductCoreVariantOption)
router.register(r'product_site_variant_options', views.ProductSiteVariantOption)
router.register(r'product_site_variant_options_classes', views.ProductSiteVariantOptionClasses)

router.register(r'productoptions', views.ProductOptions)
router.register(r'productoptions-active', views.ProductOptionsActive)
router.register(r'productoptions-available', views.ProductOptionsAvailable)
#router.register(r'store/products', views.Product_by_Store)


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/post-list/products/<int:store_id>/', views.ProductsListView.as_view(), name='products_post_list'),
    path('api/store/<int:store_id>/products', views.Product_by_Store.as_view(), name='product_list_by_store'),
    path('api/<int:product_id>/store/<int:store_id>/products', views.Product_by_Store_Excluding.as_view(), name='product_list_by_store_exc'),
    path('api/supplier/<int:supplier_id>/products', views.Product_by_Supplier.as_view(), name='product_list_by_supplier'),

    path('api/<int:pk>/available-symbols/',views.ProductSymbolsAvailable.as_view({'get': 'list'}),name='product-symbols-available'),
                  #products
    path('api/productsite/<int:product_id>/<int:store_id>', views.ProductSite.as_view({'get': 'list'}), name='products_site_list'),
    path('<int:product_id>', views.product_details, name='product_details'),
    path('<int:product_id>/edit', views.product_edit_base, name='product_base_details_edit'),
    path('api/storeadd', views.product_store_add_text, name='productstoreadd'),
    path('create', views.product_create, name='product_create'),

    #variants and core variants
    path('api/corevariants/<int:product_id>', views.BaseVariantListView.as_view({'get': 'list'}), name='corevariant'),
    path('api/corevariants/<int:product_id>/exclude/<int:store_id>',
         views.CoreVariantProductStoreExcludeListView.as_view({'get': 'list'}), name='corevariantexclude'),
    path('corevariant/<int:pk>/edit', views.product_core_variant_edit, name='product_core_variant-edit'),
    path('api/storevariants/<int:product_id>/<int:store_id>', views.StoreVariantListView.as_view({'get': 'list'}), name='sitevariant'),
    path('api/variantstore/<int:pk>', views.get_product_variant_stores, name='productvariantstorelist'),
    path('variant/<int:core_variant_id>/option/add', views.product_variant_core_add_option, name='product_variant_core_option-add'),
    path('variant/<int:pk>/option/edit', views.product_variant_core_edit_option,  name='product_variant_core_option-edit'),
    path('variant/<int:pk>/option/delete', views.product_variant_core_delete_option, name='product_variant_core_option-delete'),
    path('variant/<int:core_variant_id>/group_option/add', views.product_variant_core_add_group_option,name='product_variant_core_group_option-add'),
    path('variant/<int:core_variant_id>/class_option/add', views.product_variant_core_add_class_option,name='product_variant_core_class_option-add'),
    path('<int:pk>/variant/add_dlg', views.product_variant_site_add_dlg, name='product_variant_site-add-dlg'),
    path('<int:pk>/corevariant/add', views.product_core_variant_add, name='product_core_variant-add'),
    path('corevariant/<int:pk>/delete', views.product_core_variant_delete, name='product_core_variant-delete'),

    #product variant options for adding product to order

    # called when adding a new core variant to a product from a given site
    path('sitevariant/add/<int:core_variant_id>/<int:store_id>', views.product_variant_site_add, name='product_variant_site-add'),
    path('sitevariant/delete/<int:product_variant_id>', views.product_variant_site_delete, name='product_variant_site-delete'),
    path('sitevariant/<int:pk>/option/edit', views.site_variant_edit_option, name='site_variant_core_option-edit'),
    path('sitevariant/<int:pk>/edit', views.site_variant_edit, name='site_variant-edit'),
    path('sitevariant/<int:pk>/option/add', views.site_variant_options_edit, name='site_variant_option-add'),
    path('sitevariant/<int:pk>/option/delete', views.site_variant_options_delete, name='site_variant_option-delete'),
    path('group_class/<int:group_id>', views.group_class_list_html, name='group_class_values'),
    path('class_values/<int:class_id>', views.class_value_list_html, name='class_values'),

    #product options
    path('api/product/<int:product_id>/productoption/<int:option_id>/add/<int:value_id>', views.product_option_add, name='products_option_add'),
    path('api/product/<int:product_id>/productoption/delete/<int:pk>', views.product_option_delete, name='products_option_delete'),
    path('api/product/<int:product_id>/productoption/edit/<int:pk>', views.product_option_edit, name='products_option_edit'),
    path('api/product/<int:product_id>/productoption/edit/sortorder/<int:pk>', views.product_option_sortorder_edit, name='products_option_edit_sortorder'),
    path('api/product/<int:product_id>/productoption/add/', views.product_option_list_add, name='products_option_list_add'),
    path('api/product/<int:product_id>/productoption/<int:pk>/delete/', views.product_option_list_delete, name='products_option_list_delete'),



    #symbols
    path('api/product/<int:product_id>/addproductsymbol/<int:symbol_standard_id>', views.add_product_symbol, name='products_symbol_add'),
    path('api/product/<int:product_id>/deleteproductsymbol/<int:symbol_standard_id>', views.delete_product_symbol, name='products_symbol_delete'),

    #related items
    path('related/<int:product_id>/store/<int:store_id>', views.RelatedItemByStore.as_view({'get': 'list'}), name='related_product-store'),
    path('related/<int:pk>/add', views.related_item_add, name='related_product-add'),
    path('related/<int:pk>/edit', views.related_item_edit, name='related_product-edit'),
    path('related/<int:pk>/delete', views.related_item_delete, name='related_product-delete'),
    path('related/<int:pk>/store', views.related_item_by_store.as_view(), name='related_product-bystore'),


## - additional product images
    path('<int:product_id>/additional_images/<int:store_id>', views.product_additional_images_load, name='product_additional_images'),
    path('<int:product_id>/additional_images/<int:store_id>/add', views.product_additional_images_add, name='product_additional_images-add'),
    path('<int:product_id>/additional_images/<int:store_id>/update', views.product_additional_images_store_add, name='product_additional_images_store-update'),
    path('<int:product_id>/additional_images/<int:pk>/delete-dlg', views.store_product_additional_images_delete_dlg, name='store_product_additional_images-delete-dlg'),
    path('<int:product_id>/additional_images/<int:pk>/delete', views.store_product_additional_images_delete, name='store_product_additional_images-delete'),
    path('<int:product_id>/additional_images/<int:pk>/edit', views.store_product_addional_image_store_edit, name='store_product_additional_images-edit'),

    #base images
    path('additional_images_base/<int:pk>/delete', views.product_additional_images_delete, name='product_additional_images-delete'),
    path('additional_images_base/<int:pk>/edit', views.product_addional_image_edit, name='product_additional_images-edit'),

    #category and general
    path('<int:pk>/categoryset', views.product_category_create, name='productcatgoryset'),
    path('<int:pk>/categorydelete', views.product_category_delete, name='productcatgory_delete'),

    path('<int:pk>/categoryedit', views.product_category_edit, name='productcatgoryedit'),
    path('<int:pk>/storeedit', views.ProductSiteUpdate.as_view(), name='product_store_details_edit'),
    path('<int:pk>/storeadddlg', views.product_store_add_text_dlg, name='productstoreadd_dlg'),


    #product docuements
    path('document/upload', views.product_document_upload, name='product_document-upload'),
    path('<int:product_id>/document/fetch', views.product_document_fetch, name='fetch_product_documents'),
    path('document/<pk>/download', views.product_document_download, name='product_document-download'),
    path('document/<pk>/delete', views.product_document_delete, name='product_document-delete'),

    #min pricing cacl
    path('product/<int:pk>/minpricecalc', views.product_min_price_calc, name='product_min_price_calc'),

    #duplicate a product
    path('product/<int:pk>/duplicate', views.product_duplicate_dlg, name='product_duplicate'),

    #standards
    path('<int:product_id>/standards', views.product_standards_list.as_view(), name='productstandardslist'),
    path('<int:product_id>/standards/add/', views.product_standards_list_add, name='product-standards-add'),
    path('<int:pk>/standards/edit/', views.product_standards_list_edit, name='product-standards-edit'),
    path('<int:pk>/standards/delete/', views.product_standards_list_delete, name='product-standards-delete'),

    #base
    path('', views.product_list, name='allproducts'),

    ]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)