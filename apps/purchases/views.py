from django.shortcuts import render

# Create your views here.
def open_purchases(request):
    """
    Render the open purchases page.
    """
    return render(request, 'purchases/open_purchases.html', {})

def sent_purchases(request):
    """
    Render the open purchases page.
    """
    return render(request, 'purchases/open_purchases.html', {})