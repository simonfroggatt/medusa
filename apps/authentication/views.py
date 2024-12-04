from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import logout
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.conf import settings


# Create your views here.
def do_login(request):
    template_name = 'authentication/login.html'
    content = {'content_class': 'ecommerce'}

    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not User.objects.filter(username=username).exists():
            messages.error(request, 'Username was not found')
            return redirect(settings.LOGIN_URL)

        #get the user name for the email address

        user = authenticate(username=username, password=password)
        if user is None:
            messages.error(request, "Invalid Email/Password")
            return redirect(settings.LOGIN_URL)
        else:
            login(request, user)

            return redirect(settings.LOGIN_REDIRECT_URL)

    return render(request, template_name, content)


def do_logout(request):
    logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)








