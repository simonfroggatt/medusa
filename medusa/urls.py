"""medusa URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from medusa import views

urlpatterns = [
    path('authentication/', include('apps.authentication.urls')),
    path('customer/', include('apps.customer.urls')),
    path('orders/', include('apps.orders.urls')),
    path('quotes/', include('apps.quotes.urls')),
    path('products/', include('apps.products.urls')),
    path('pricing/', include('apps.pricing.urls')),
    path('options/', include('apps.options.urls')),
    path('symbols/', include('apps.symbols.urls')),
    path('category/', include('apps.category.urls')),
    path('company/', include('apps.company.urls')),
    path('paperwork/', include('apps.paperwork.urls')),
    path('pages/', include('apps.pages.urls')),
    path('sites/', include('apps.sites.urls')),
    path('templating/', include('apps.templating.urls')),
    path('', views.StarterPageView.as_view(), name='apps-pages-starter'),
    path('dashboard', views.dashboard, name='dashboard'),  # Dashboard
    path('password_change/', views.DashboardView.as_view(), name='change_password'),  # Change Password
    path('admin/', admin.site.urls),
    path('tinymce/', include('tinymce.urls')),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

def get_param(request, param, default=None):
    if request.method == 'POST':
        return request.data.get(param, default)
    return request.query_params.get(param, default)