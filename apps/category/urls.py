from django.urls import path
from apps.category import views
from rest_framework import routers
from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static

router = routers.SimpleRouter()
router.register(r'category', views.Categories)
router.register(r'descriptions', views.CategoryDescriptions)
router.register(r'tostores', views.CategoryToStoreDescriptions)


urlpatterns = [
    url('^api/', include(router.urls)),
    path('', views.all_cats, name='allcategories'),
    path('<int:pk>', views.category_details, name='categorydetails'),
    path('create', views.category_create, name='categorycreate'),
    path('<int:pk>/edit', views.CategoryEdit.as_view(), name='categorybaseedit'),
    path('<int:pk>/storeedit', views.CategoryStoreEdit.as_view(), name='categorystoreedit')
  #  path('<int:pk>', views.SymbolsUpdateView.as_view(), name='symboldetails')
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)