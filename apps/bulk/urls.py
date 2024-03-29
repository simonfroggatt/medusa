from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from django.urls import include
from apps.bulk import views

router = routers.SimpleRouter()
router.register(r'bulkgroups', views.BulkGroups)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/bulkgroup/<int:bulk_group_id>/breaks', views.bulk_group_breaks_list.as_view(), name='bulk_group_breaks_list'),

    path('<int:pk>/edit', views.bulk_group_edit, name='bulkgroupedit'),
    path('<int:pk>/break/add', views.bulk_group_add, name='bulkgroupadd'),
    path('<int:pk>/break/delete', views.bulk_group_delete, name='bulkgroupdelete'),

    path('', views.bulk_list, name='allbulks'),
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)