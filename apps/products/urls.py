from django.urls import path
from apps.products import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'productslist', views.base_product_list_asJSON)

urlpatterns = [
    url('^api/', include(router.urls)),
    url('^api/post-list/products', views.ProductsListView.as_view(), name='products_post_list'),

    path('api/storevariants/<int:product_id>/<int:store_id>', views.StoreVariantListView.as_view({'get': 'list'}), name='sitevariant'),
    path('api/storevariantsreverse/<int:product_id>/<int:store_id>', views.StoreVariantListViewReverse.as_view({'get': 'list'}), name='sitevariantreverse'),
    #path('api/corevariants/<int:product_id>', views.StoreVariantListViewReverse.as_view({'get': 'list'}), name='corevariant'),
    path('api/corevariants/<int:product_id>', views.BaseVariantListView.as_view({'get': 'list'}), name='corevariant'),
    path('<int:product_id>', views.product_details, name='product_details'),

    path('variant-options/<int:core_variant_id>', views.core_variant_options_class, name='corevariantoptions'),
    path('', views.product_list, name='allproducts'),

    ]