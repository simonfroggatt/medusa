from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views import View


class StarterPageView(View):
    def get(self, request):
        greeting = {}
        greeting['heading'] = "Starter Page"
        greeting['pageview'] = "Pages"
        return render(request, 'pages-starter.html',greeting)
