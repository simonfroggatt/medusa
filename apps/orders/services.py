import datetime as dt
import calendar
from apps.orders.models import OcTsgOrderOption, OcTsgOrderProductOptions
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

def create_due_date(order_obj):
    order_date = dt.datetime(order_obj.date_added.year, order_obj.date_added.month, order_obj.date_added.day)
    if order_obj.payment_method_id == 7:  #ProFora
        due_date = order_date + dt.timedelta(days=30)
    if order_obj.payment_method_id == 5:  #Purchase order
        #get the payment terms from the company
        if order_obj.customer.parent_company:
            payment_days = order_obj.customer.parent_company.payment_days
            payment_type = order_obj.customer.parent_company.payment_terms.shortcode
            if payment_type == 'DAYSAFTERBILLDATE':
                due_date = order_date + dt.timedelta(days=payment_days)
            elif payment_type == 'DAYSAFTERBILLMONTH':
                last_day_of_month = calendar.monthrange(order_obj.date_added.year, order_obj.date_added.month)[1]
                first_of_next_month = dt.datetime(order_obj.date_added.year, order_obj.date_added.month+1, 1)
                days_until_end_of_month = last_day_of_month - order_obj.date_added.day
                due_date = first_of_next_month + dt.timedelta(days=payment_days)
            else:
                due_date = order_date + dt.timedelta(days=7)
        else:
            due_date = order_date + dt.timedelta(days=7)
    else:
        due_date = order_date + dt.timedelta(days=7) #grace period

    order_obj.due_date = due_date
    order_obj.save()
    return due_date


def get_order_product_line_options(order_product_id):
    options_obj = OcTsgOrderOption.objects.filter(order_product_id=order_product_id)
    addon_obj = OcTsgOrderProductOptions.objects.filter(order_product_id=order_product_id)
    data ={
        'options': options_obj,
        'addons': addon_obj
    }
    return data