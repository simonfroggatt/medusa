import json
import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views.generic.base import TemplateView
from django.shortcuts import get_object_or_404
from apps.orders.models import OcOrder
from .models import OcTsgStripePayments

stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentPageView(TemplateView):
    template_name = 'payments/payment.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        order_id = self.kwargs.get('order_id')
        order = get_object_or_404(OcOrder, order_id=order_id)
        
        # Get order details
        context.update({
            'stripe_public_key': settings.STRIPE_PUBLISHABLE_KEY,
            'order': order,
            'order_items': order.order_products.all(),
            'billing_details': {
                'name': order.payment_fullname,
                'email': order.payment_email,
                'phone': order.payment_telephone,
                'address': {
                    'line1': order.payment_address_1,
                    'line2': order.payment_address_2,
                    'city': order.payment_city,
                    'state': order.payment_zone,
                    'postal_code': order.payment_postcode,
                    'country': order.payment_country,
                }
            },
            'shipping_details': {
                'name': order.shipping_fullname,
                'address': {
                    'line1': order.shipping_address_1,
                    'line2': order.shipping_address_2,
                    'city': order.shipping_city,
                    'state': order.shipping_zone,
                    'postal_code': order.shipping_postcode,
                    'country': order.shipping_country,
                }
            }
        })
        return context


@csrf_exempt
@require_http_methods(["POST"])
def create_payment_intent(request, order_id):
    try:
        order = get_object_or_404(OcOrder, order_id=order_id)

        intent = stripe.PaymentIntent.create(
            amount=int(float(order.total)),
            currency='gbp',
            automatic_payment_methods={
                'enabled': True,
            },
            metadata={
                'order_id': order.order_id,
                'invoice_no': order.invoice_no,
                'customer_email': order.email
            },
            receipt_email=order.email,
            shipping={
                'name': order.shipping_fullname,
                'address': {
                    'line1': order.shipping_address_1,
                    'line2': order.shipping_address_2,
                    'city': order.shipping_city,
                    'state': order.shipping_zone,
                    'postal_code': order.shipping_postcode,
                    'country': order.shipping_country,
                }
            }
        )
        
        # Create a payment record
        OcTsgStripePayments.objects.create(
            amount=order.total,
            currency='GBP',
            status='pending',
            stripe_payment_intent_id=intent.id,
            order=order
        )
        
        return JsonResponse({
            'clientSecret': intent.client_secret
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        order_id = payment_intent.metadata.get('order_id')
        
        # Update payment status
        payment = OcTsgStripePayments.objects.filter(stripe_payment_intent_id=payment_intent['id']).first()
        if payment:
            payment.status = 'completed'
            payment.save()
            
            # Update order status if needed
            if order_id:
                try:
                    order = OcOrder.objects.get(order_id=order_id)
                    order.payment_status_id = 2  # Assuming 2 is the ID for 'paid' status
                    order.payment_ref = payment_intent['id']
                    order.save()
                except OcOrder.DoesNotExist:
                    pass
        
    return HttpResponse(status=200)