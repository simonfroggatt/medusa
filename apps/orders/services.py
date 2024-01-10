def order_highlight_code(order_obj):
    """1 Live, 2 Pending, 3 Failed - """
    h_code = 3
    if order_obj.payment_method_id == 5:  #Purchase order
        h_code = 1
    if order_obj.payment_method_id == 7:  #ProFora
        h_code = 2
    if order_obj.payment_status_id == 2:  #Paid
        h_code = 1
    return h_code