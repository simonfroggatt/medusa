from django.shortcuts import render


def orders_list(request):
    template_name = 'orders/all-orders.html'
    content = {'content_class': 'ecommerce'}
    return render(request, template_name, content)