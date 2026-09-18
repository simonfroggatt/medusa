from django.urls import path

from apps.recreate import views

urlpatterns = [
    path('', views.recreation_list, name='recreate-list'),
    path('api/list/', views.recreation_list_api, name='recreate-list-api'),
    path('missing-symbols/', views.missing_symbols, name='recreate-missing'),
    path('approved/', views.approved, name='recreate-approved'),
    path('<int:product_id>/customise/', views.customise, name='recreate-customise'),
    path('<int:product_id>/', views.review, name='recreate-review'),
    path('<int:product_id>/designer/', views.designer_frame, name='recreate-frame'),
    path('<int:product_id>/save/', views.save, name='recreate-save'),
    path('<int:product_id>/status/', views.set_status, name='recreate-status'),
    path('<int:product_id>/rerun/', views.rerun, name='recreate-rerun'),
]
