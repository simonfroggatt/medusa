from apps.orders.models import OcOrder, OcTsgPaymentMethod
from django.db.models import Sum
import datetime as dt
import pandas as pd


def create_date_range(range_type, start_date = dt.date.today()):
    if range_type == 'D':
        #start_date = dt.date.today()
        end_date = (start_date + dt.timedelta(days=1)) - dt.timedelta(seconds=1)
    elif range_type == 'W':
        today = start_date
        start_date = today - dt.timedelta(days=today.weekday())
        end_date = (start_date + dt.timedelta(days=7)) - dt.timedelta(seconds=1)
    elif range_type == 'M':
        today = start_date
        start_date = today.replace(day=1)
        if start_date.month == 12:  # December
            end_date = dt.date(start_date.year, start_date.month, 31)
        else:
            end_date = dt.date(start_date.year, start_date.month + 1, 1) - dt.timedelta(seconds=1)

    return {'start': start_date, 'end': end_date}

def get_daily_sales_by_method(start_date):
    date_range = create_date_range('D', start_date)
    sales_queryset = OcOrder.objects.orders_range(date_range['start'], date_range['end'])
    return create_daily_payment_method_data(sales_queryset, date_range)

def get_weekly_sales_by_method(start_date):
    data = {}
    date_range = create_date_range('W', start_date)
    sales_queryset = OcOrder.objects.orders_range(date_range['start'], date_range['end'])
    data['week_range'] = {'start': '', 'end': ''}
    data['week_range']['start'] = dt.datetime.strftime(date_range['start'], "%d-%m-%Y ")
    data['week_range']['end'] = dt.datetime.strftime(date_range['end'], "%d-%m-%Y ")
    data['weekly_data'] = create_weekly_payment_method_data(sales_queryset, date_range)
    return data

def get_monthly_sales_by_method(start_date):
    data = {}
    date_range = create_date_range('M', start_date)
    sales_queryset = OcOrder.objects.orders_range(date_range['start'], date_range['end'])
    chart_data = create_monthly_payment_method_data(sales_queryset, date_range)
    data['month_range'] = {'start': '', 'end': ''}
    data['month_range']['start'] = chart_data['range']['start']
    data['month_range']['end'] = chart_data['range']['end']
    data['data_set'] = chart_data['data_set']
    return data


def create_daily_payment_method_data(pd_data_in, date_range):
    summary_data = {}
    chart_data = []

    if len(pd_data_in) <= 0:
        return chart_data

    pd_data_values = pd_data_in.values_list('total', 'payment_method__method_name', 'payment_method_id', 'payment_method__chart_colour')
    df = pd.DataFrame(list(pd_data_values), columns=["total", "payment_method", "payment_method_id", "chart_colour"])

    totals_df = df.groupby(['payment_method', 'payment_method_id', "chart_colour"])[['total']].sum()
    totals_df['total'] = totals_df['total'].apply(pd.to_numeric, errors='coerce')

    count_df = df.groupby(['payment_method', 'payment_method_id', "chart_colour"])[['total']].count()
    count_df['total'] = count_df['total'].apply(pd.to_numeric, errors='coerce')

    totals = totals_df.T.to_dict('index')
    total_values = totals.get('total')
    payment_types = []
    for total_type, total_qty in total_values.items():

        if total_type[1] not in payment_types:
            payment_types.append(total_type[1])
        payment_type_data = {'payment_method': total_type[0], 'value': total_qty, "chart_colour": total_type[2]}

        chart_data.append(payment_type_data)

    #now create some total text
    total_value = round(totals_df['total'].sum(),2)
    total_orders = 0

    counts = count_df.T.to_dict('index')
    count_values = counts.get('total')
    payment_type_summary = []
    #now create totals and counts by payment method
    for count_type, count_qty in count_values.items():
        payment_method = count_type[0]
        payment_method_count = count_qty
        payment_method_total = round(total_values.get(count_type),2)
        payment_summary_data_point = {'payment_method': payment_method, 'count': payment_method_count, 'total': payment_method_total}
        payment_type_summary.append(payment_summary_data_point)
        total_orders += payment_method_count


    summary_data = {'total_value': total_value, 'total_orders': total_orders, 'payment_totals_by_type': payment_type_summary}
    return_data = {'data_set': chart_data, 'summary': summary_data}

    return return_data

def create_weekly_payment_method_data(pd_data_in, date_range):
    # chart_type_stats = {'direct': {'count': 0, 'value': 0}, 'medusa': {'count': 0, 'value': 0}, 'account': {'count': 0, 'value': 0}, 'total': {'count': 0, 'value': 0}}
    #chart_data = []
    chart_data = {}
    stack_chart_data = []

    if len(pd_data_in) <= 0:
        return chart_data

    pd_data_values = pd_data_in.values_list('total', 'payment_method__method_name', 'payment_method_id','date_added', 'payment_method__chart_colour')
    df = pd.DataFrame(list(pd_data_values), columns=["total", "payment_method", "payment_method_id", "date_added", "chart_colour"])
    df.sort_values(by='date_added', inplace=True)
    df['day_of_week'] = df['date_added'].dt.dayofweek
    df['day_of_week_name'] = df['date_added'].dt.day_name()


    totals_df = df.groupby(['payment_method_id', 'payment_method', 'day_of_week', 'day_of_week_name','chart_colour'])[['total']].sum()
    totals_df['total'] = totals_df['total'].apply(pd.to_numeric, errors='coerce')



    totals = totals_df.T.to_dict('index')
    total_values = totals.get('total')

    for total_type, total_qty in total_values.items():  # total_type = ['day of week', 'website_direct', 'payment_type']
        for payment_type_list in stack_chart_data:
            if payment_type_list['payment_type_id'] == total_type[0]:
                payment_type_list['data'][total_type[2]] = round(total_qty,2)
                break
        else:
            week_data_set = [0] * 7
            week_data_set[total_type[2]] = round(total_qty,2)
            payment_type_data = {'payment_type_id': total_type[0], 'label': total_type[1], 'data': week_data_set, 'backgroundColor': total_type[4]}
            stack_chart_data.append(payment_type_data)

    count_df = df.groupby(['payment_method_id', 'payment_method'])[['total']].count()
    count_df['total'] = count_df['total'].apply(pd.to_numeric, errors='coerce')

    week_totals_df = df.groupby(['payment_method_id', 'payment_method'])[['total']].sum()
    week_totals_df['total'] = week_totals_df['total'].apply(pd.to_numeric, errors='coerce')

    week_totals = week_totals_df.T.to_dict('index')
    week_total_values = week_totals.get('total')

    counts = count_df.T.to_dict('index')
    count_values = counts.get('total')
    payment_type_summary = []

    total_value = round(week_totals_df['total'].sum(), 2)
    total_orders = 0

    # now create totals and counts by payment method
    for count_type, count_qty in count_values.items():
        payment_method = count_type[1]
        payment_method_count = count_qty
        payment_method_total = round(week_total_values.get(count_type), 2)
        payment_summary_data_point = {'payment_method': payment_method, 'count': payment_method_count,
                                      'total': payment_method_total}
        payment_type_summary.append(payment_summary_data_point)
        total_orders += payment_method_count

    summary_data = {'total_value': total_value, 'total_orders': total_orders,
                    'payment_totals_by_type': payment_type_summary}
    return_data = {'data_set': stack_chart_data, 'summary': summary_data}

    return return_data


def create_monthly_payment_method_data_old(pd_data_in, date_range):
    chart_data = {}

    if len(pd_data_in) <= 0:
        chart_data[dt.datetime.strftime(date_range['start'], "%Y-%m-%d")] = 0
    else:
        pd_data_values = pd_data_in.values_list('total', 'payment_method__method_name', 'payment_method_id',
                                                'date_added')
        df = pd.DataFrame(list(pd_data_values), columns=["total", "payment_method", "payment_method_id", "date_added"])

        df['date_added'] = df['date_added'].dt.date

        totals_df = df.groupby(['date_added', 'payment_method', 'payment_method_id'])[['total']].sum()
        totals_df['total'] = totals_df['total'].apply(pd.to_numeric, errors='coerce')

        totals = totals_df.T.to_dict('index')
        total_values = totals.get('total')
        payment_types = []

        for total_type, total_qty in total_values.items():  # total_type = ['day of week', 'website_direct', 'payment_type']
            if total_type[2] not in payment_types:
                payment_types.append(total_type[2])
                tmp_index = total_type[1]
                chart_data[tmp_index] = []

            new_data_point = [dt.datetime.strftime(total_type[0], "%Y-%m-%d"), total_qty]
            #new_data_point = {'date': dt.datetime.strftime(total_type[0], "%Y-%m-%d"), 'total': total_qty}
            tmp_index = total_type[1]
            chart_data[tmp_index].append(new_data_point)

    return {'datapoint': chart_data, 'range': {'start': dt.datetime.strftime(date_range['start'], "%Y-%m-%d"), 'end': dt.datetime.strftime(date_range['end'] -  dt.timedelta(days=1), "%Y-%m-%d")}}

def create_monthly_payment_method_data(pd_data_in, date_range):
    chart_data = []

    if len(pd_data_in) <= 0:
        chart_data[dt.datetime.strftime(date_range['start'], "%Y-%m-%d")] = 0
    else:
        pd_data_values = pd_data_in.values_list('total', 'date_added')
        df = pd.DataFrame(list(pd_data_values), columns=["total",  "date_added"])

        df['date_added'] = df['date_added'].dt.date

        totals_df = df.groupby(['date_added'])[['total']].sum()
        totals_df['total'] = totals_df['total'].apply(pd.to_numeric, errors='coerce')

        totals = totals_df.T.to_dict('index')
        total_values = totals.get('total')

        pd_data_values2 = pd_data_in.values_list('total', 'payment_method__method_name', 'payment_method_id',
                                                'date_added')
        df2 = pd.DataFrame(list(pd_data_values2), columns=["total", "payment_method", "payment_method_id", "date_added"])

        df2['date_added'] = df2['date_added'].dt.date

        totals_df2 = df2.groupby(['date_added', 'payment_method', 'payment_method_id'])[['total']].sum()
        totals_df2['total'] = totals_df2['total'].apply(pd.to_numeric, errors='coerce')

        totals2 = totals_df2.T.to_dict('index')
        total_values2= totals2.get('total')


        for total_type, total_qty in total_values.items():  # total_type = ['day of week', 'website_direct', 'payment_type']
            new_data_point = {'x': dt.datetime.strftime(total_type, "%Y-%m-%d"), 'y': total_qty}
            chart_data.append(new_data_point)

    return {'data_set': chart_data, 'range': {'start': dt.datetime.strftime(date_range['start'], "%Y-%m-%d"), 'end': dt.datetime.strftime(date_range['end'] -  dt.timedelta(days=1), "%Y-%m-%d")}}



def create_stats(pd_data_in, irange, date_range):
    order_stats = {'direct': {'count': 0, 'value': 0}, 'medusa': {'count': 0, 'value': 0}, 'account': {'count': 0, 'value': 0}, 'total': {'count': 0, 'value': 0}}
    payment_types = ['PP_PRO', 'PAYPAL_PRO', 'PP_STANDARD', 'SAGEPAY', 'COD', 'SAGEPAY_DIRECT', 'PAYPAL', 'STRIPEPRO']
    po_types = ['PROFORMA', 'PO']

    if len(pd_data_in) <= 0:
        return order_stats

    df = pd.DataFrame(list(pd_data_in), columns=["total", "payment_code", "date_added", "direct_website_order"])

    order_stats['total']['count'] = df['total'].count()
    order_stats['total']['value'] = df['total'].sum()
    counts_df = df.groupby(['direct_website_order', 'payment_code']).count()
    totals_df = df.groupby(['direct_website_order', 'payment_code']).sum()

    #get the count of the different order types
    count = counts_df.T.to_dict('index')
    count_values = count.get('total')
    for count_type, count_qty in count_values.items():
        if count_type[1].upper() in payment_types:
            if count_type[0] == 0:
                order_stats['medusa']['count'] += count_qty
            else:
                order_stats['direct']['count'] += count_qty
        elif count_type[1].upper() in po_types:
            order_stats['account']['count'] += count_qty

    #get the value of the different order types
    totals = totals_df.T.to_dict('index')
    total_values = totals.get('total')
    for total_type, total_qty in total_values.items():
        if total_type[1].upper() in payment_types:
            if total_type[0] == 0:
                order_stats['medusa']['value'] += total_qty
            else:
                order_stats['direct']['value'] += total_qty
        elif total_type[1].upper() in po_types:
            order_stats['account']['value'] += total_qty

    return order_stats

