from django.urls import path
from rest_framework import routers
from django.urls import include
from apps.sites import views

router = routers.SimpleRouter()
router.register(r'sites', views.Sites)

urlpatterns = [
    path('api/', include(router.urls)),
    path('<int:pk>/edit', views.SiteUpdate.as_view(), name='siteupdate'),
    path('new', views.site_create, name='sitecreate'),
    path('<int:pk>/delete', views.SiteDelete.as_view(), name='sitedelete'),
    path('<int:blog_id>/deletedlg', views.site_delete_dlg, name='sitedeletedlg'),
    path('banners/', views.banners_list, name='banners'),
    path('banners/new', views.banner_create, name='bannercreate'),
    path('banners/<int:pk>/edit', views.banner_edit, name='banneredit'),
    path('banners/<int:pk>/delete', views.banner_delete, name='bannerdelete'),
    path('search-terms/', views.search_terms_report, name='searchterms'),
    path('search-rules/', views.search_rules_list, name='searchrules'),
    path('search-rules/new', views.search_rule_create, name='searchrulecreate'),
    path('search-rules/<int:pk>/edit', views.search_rule_edit, name='searchruleedit'),
    path('search-rules/<int:pk>/delete', views.search_rule_delete, name='searchruledelete'),
    path('', views.all_sites, name='allsites')
    ]
