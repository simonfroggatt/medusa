from decimal import Decimal, ROUND_HALF_UP
from django.db.models import Sum
from .models import OcTsgQuote, OcTsgQuoteProduct


def get_quote_totals(quote_id):
    """Calculate totals for a quote"""
    quote = OcTsgQuote.objects.get(pk=quote_id)
    products = OcTsgQuoteProduct.objects.filter(quote=quote)
    
    subtotal = products.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
    tax_total = products.aggregate(total=Sum('tax'))['total'] or Decimal('0.00')
    
    # Apply quote-level discount if any
    if quote.discount:
        discount_amount = (subtotal * quote.discount / Decimal('100.00')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        subtotal = subtotal - discount_amount
    
    # Add shipping if applicable
    shipping_cost = quote.shipping_rate or Decimal('0.00')
    
    grand_total = subtotal + tax_total + shipping_cost
    
    return {
        'subtotal': subtotal,
        'tax': tax_total,
        'shipping': shipping_cost,
        'total': grand_total
    }


def create_quote_prices_text(quote):
    """Create text representation of quote prices"""
    totals = get_quote_totals(quote.quote_id)
    
    text = []
    text.append(f"Subtotal: £{totals['subtotal']:.2f}")
    
    if quote.discount:
        text.append(f"Discount: {quote.discount}%")
    
    if totals['shipping'] > 0:
        text.append(f"Shipping: £{totals['shipping']:.2f}")
    
    text.append(f"Tax: £{totals['tax']:.2f}")
    text.append(f"Total: £{totals['total']:.2f}")
    
    return "\n".join(text)