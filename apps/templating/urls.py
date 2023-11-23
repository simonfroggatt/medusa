from django.urls import path
from rest_framework import routers
from django.urls import include
from apps.templating import views

router = routers.SimpleRouter()
router.register(r'templates', views.Templates)

urlpatterns = [
    path('api/', include(router.urls)),
    path('<int:pk>/edit', views.TemplateUpdate.as_view(), name='templateupdate'),
    #path('new', views.site_create, name='sitecreate'),
    #path('<int:pk>/delete', views.SiteDelete.as_view(), name='sitedelete'),
    #path('<int:blog_id>/deletedlg', views.site_delete_dlg, name='sitedeletedlg'),
    path('', views.all_templates, name='alltemplates')
    ]
