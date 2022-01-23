from django.urls import path
from apps.options import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.SimpleRouter()
router.register(r'values', views.OptionValues)
router.register(r'groups', views.OptionGroups)
router.register(r'types', views.OptionTypes)
router.register(r'class', views.OptionClass)



urlpatterns = [
    path('', views.option_list, name='alloptions'),
    url('^api/', include(router.urls)),
    path('class', views.option_class_list, name='alloptionsclass'),
    path('type', views.option_class_types, name='alloptionstype'),
    path('values', views.option_values_list, name='alloptionsvalues'),
    path('groups', views.option_class_groups_list, name='alloptionsgroups'),
    ]