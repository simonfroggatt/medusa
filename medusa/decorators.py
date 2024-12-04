from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages


def user_in_group(*group):
    def decorator(view_func):
        def wrap(request, *args, **kwargs):
            if request.user.groups.filter(name__in=group).exists():
                return view_func(request, *args, **kwargs)
            else:
                return redirect(settings.LOGIN_URL)
        return wrap


def group_required(*group_names):
    """Requires user membership in at least one of the groups passed in."""
    def in_groups(u):
         if u.is_authenticated:
            if bool(u.groups.filter(name__in=group_names)) | u.is_superuser:
                return True
            #messages.error(None, "You do not have permission to view this page")
            return False
    return user_passes_test(in_groups)