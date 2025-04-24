from django.conf import settings
from .models import OcOrder

def new_orders_count(request):
    return {
        'new_orders_count': OcOrder.objects.new().count()
    }