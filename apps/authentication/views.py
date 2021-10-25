from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
def do_login(request):
    template_name = 'authentication/login.html'
    content = {'content_class': 'ecommerce'}
    return render(request, template_name, content)