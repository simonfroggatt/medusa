from django.urls import path
from rest_framework import routers
from django.urls import include
from apps.pages import views

router = routers.SimpleRouter()
router.register(r'blogs', views.Blogs)
router.register(r'info', views.Information)
router.register(r'faq', views.Information)

urlpatterns = [
    path('api/', include(router.urls)),
   # path('blogs/<int:blog_id>/edit', views.blog_edit, name='blogedit'),
    path('blogs/<int:pk>/edit', views.BlogUpdate.as_view(), name='blogupdate'),
    path('blogs/new', views.blog_create, name='blogcreate'),
    path('blogs/<int:pk>/delete', views.BlogDelete.as_view(), name='blogdelete'),
    path('blogs/<int:blog_id>/deletedlg', views.blog_delete_dlg, name='blogdeletedlg'),
    path('blogs/', views.allBlogs, name='allblogs'),

    path('info/', views.allInfo, name='allinfo'),
    path('info/new', views.info_create, name='infocreate'),
    path('info/<int:pk>/edit', views.InfoUpdate.as_view(), name='infoupdate'),
    path('info/<int:pk>/delete', views.InfoDelete.as_view(), name='infodelete'),
    path('info/<int:information_id>/deletedlg', views.info_delete_dlg, name='infodeletedlg'),

    path('extra/', views.allExtra, name='allextra'),
    path('extra/new', views.info_create, name='extracreate'),
    path('extra/<int:pk>/edit', views.InfoUpdate.as_view(), name='extraupdate'),
    path('extra/<int:pk>/delete', views.InfoDelete.as_view(), name='extradelete'),
    path('extra/<int:information_id>/deletedlg', views.info_delete_dlg, name='extradeletedlg'),

    path('faq/', views.allfaqs, name='allfaqs'),
    path('faq/new', views.faq_create, name='faqcreate'),


    ]
