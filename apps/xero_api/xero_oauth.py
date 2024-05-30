import os

from functools import wraps
from django.urls import reverse
from django.shortcuts import redirect

from xero_python.api_client import ApiClient, serialize
from xero_python.api_client.configuration import Configuration
from xero_python.api_client.oauth2 import OAuth2Token
from authlib.integrations.django_client import OAuth, token_update
from django.core.cache import cache
from django.http import HttpResponse
from django.dispatch import receiver
import datetime as datetime
import apps.xero_api.config as xero_config
from django.conf import settings

#for dev
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
oauth = OAuth()


xero = oauth.register(
    name="xero",
    version="2",
    client_id=settings.XERO_CLIENT_ID,
    client_secret=settings.XERO_CLIENT_SECRET,
    api_base_url=xero_config.XERO_BASE_URL,
    authorize_url=xero_config.XERO_AUTH_URL,
    access_token_url=xero_config.XERO_TOKEN_URL,
    refresh_token_url=xero_config.XERO_TOKEN_URL,
    #client_kwargs={'scope': 'openid profile email'}
    scope=xero_config.XERO_SCOPES
)


api_client = ApiClient(
    Configuration(
        debug=True,  # app.config["DEBUG"],
        oauth2_token=OAuth2Token(
            client_id=settings.XERO_CLIENT_ID, client_secret=settings.XERO_CLIENT_SECRET
        ),
    ),
    pool_threads=1,
)


def login(request):
    xero_access = dict(obtain_xero_oauth2_token() or {})
    response = oauth.xero.authorize_redirect(request, xero_config.XERO_REDIRECT_URL)
    return response

def oauth_callback(request):
    try:
        token = oauth.xero.authorize_access_token(request)
    except Exception as e:
        print(e)
        raise
    if token is None:
        return HttpResponse("Access Denied")
    store_xero_oauth2_token(token)

    return redirect('/backend/tenants/')


def logout():
    store_xero_oauth2_token(None)
    return redirect('/')


def xero_token_required(function):
    @wraps(function)
    def decorator(*args, **kwargs):
        xero_token = obtain_xero_oauth2_token()
        time = datetime.datetime.now().timestamp()
        if time > xero_token['expires_at']:
            new_token = oauth.xero.fetch_access_token(
                refresh_token=xero_token['refresh_token'],
                grant_type='refresh_token')
            store_xero_oauth2_token(new_token)
            xero_token = new_token

        if not xero_token:
            return redirect(reverse("oauth"))

        return function(*args, **kwargs)

    return decorator

@api_client.oauth2_token_getter
def obtain_xero_oauth2_token():
    return cache.get('token')


@api_client.oauth2_token_saver
def store_xero_oauth2_token(token):
    cache.set('token', token, None)


