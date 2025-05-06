from django.urls import path
from .views import PaymentPageView, create_payment_intent, webhook_stripe
from django.conf import settings
from django.conf.urls.static import static
from apps.payments import views

app_name = 'payments'

urlpatterns = [
    path('order/<int:order_id>/payment/', views.PaymentPageView.as_view(), name='payment'),
    path('order/<int:order_id>/create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('order/<int:order_id>/payment-success/', views.PaymentPageView.as_view(), name='payment-success'),
    path('webhook/stripe/', views.webhook_stripe, name='webhook_stripe'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
     + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


