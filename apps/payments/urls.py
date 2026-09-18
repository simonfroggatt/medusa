from django.urls import path
from .views import PaymentPageView, create_payment_intent, webhook_stripe
from django.conf import settings
from django.conf.urls.static import static
from apps.payments import views
from medusa.decorators import group_required

app_name = 'payments'

# The payment pages below were never finished and are not used - live card payments go through
# tsg_store's tsg_stripe.php. Left open they showed any order's contact details, addresses and
# lines to anyone trying sequential order ids, and could create Stripe intents for any order,
# so they are restricted to superusers. The webhook stays open: Stripe calls it, and it checks
# the Stripe signature itself.
superuser_only = group_required('superuser')

urlpatterns = [
    path('order/<int:order_id>/payment/', superuser_only(views.PaymentPageView.as_view()), name='payment'),
    path('order/<int:order_id>/create-payment-intent/', superuser_only(views.create_payment_intent), name='create-payment-intent'),
    path('order/<int:order_id>/payment-success/', superuser_only(views.PaymentPageView.as_view()), name='payment-success'),
    path('webhook/stripe/', views.webhook_stripe, name='webhook_stripe'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
     + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


