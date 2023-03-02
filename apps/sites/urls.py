from django.urls import path
from rest_framework import routers
from django.conf.urls import url, include
from apps.sites import views

router = routers.SimpleRouter()
router.register(r'sites', views.Sites)

urlpatterns = [
    url('^api/', include(router.urls)),
    path('<int:pk>/edit', views.SiteUpdate.as_view(), name='siteupdate'),
    path('new', views.site_create, name='sitecreate'),
    path('<int:pk>/delete', views.SiteDelete.as_view(), name='sitedelete'),
    path('<int:blog_id>/deletedlg', views.site_delete_dlg, name='sitedeletedlg'),
    path('', views.all_sites, name='allsites')
    ]
