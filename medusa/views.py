from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views import View


class StarterPageView(View):
    def get(self, request):
        greeting = {}
        greeting['heading'] = "Starter Page"
        greeting['pageview'] = "Pages"
        return render(request, 'pages-starter.html',greeting)


class DashboardView(View):
    def get(self, request):
        greeting = {}
        greeting['heading'] = "Dashboard"
        greeting['pageview'] = "Dashboard"
        return render(request, 'menu/dashboard.html',greeting)


def dashboard(request):
    template_name = 'dashboard.html'
    return render(request, template_name)