from apps.orders.models import OcOrder, OcTsgPaymentMethod
from django.db.models import Sum
import datetime as dt
import pandas as pd


def create_date_range(range_type):
    start_date = dt.date.today()
    end_date = start_date + dt.timedelta(days=1)
    if range_type == 'D':
        start_date = dt.date.today()
        end_date = (start_date + dt.timedelta(days=1)) - dt.timedelta(seconds=1)
    elif range_type == 'W':
        today = dt.date.today()
        start_date = today - dt.timedelta(days=today.weekday())
        end_date = (start_date + dt.timedelta(days=7)) - dt.timedelta(seconds=1)
    elif range_type == 'M':
        today = dt.date.today()
        start_date = today.replace(day=1)
        if start_date.month == 12:  # December
            end_date = dt.date(start_date.year, start_date.month, 31)
        else:
            end_date = dt.date(start_date.year, start_date.month + 1, 1) - dt.timedelta(seconds=1)

    return {'start': start_date, 'end': end_date}


def get_daily_sales_by_method():
    date_range = create_date_range('D')
    sales_queryset = OcOrder.objects.orders_range(date_range['start'], date_range['end'])
    return create_daily_payment_method_data(sales_queryset, date_range)

def get_weekly_sales_by_method():
    date_range = create_date_range('W')
    sales_queryset = OcOrder.objects.orders_range(date_range['start'], date_range['end'])
    return create_weekly_payment_method_data(sales_queryset, date_range)


def get_monthly_sales_by_method():
    date_range = create_date_range('M')
    sales_queryset = OcOrder.objects.orders_range(date_range['start'], date_range['end'])
    return create_monthly_payment_method_data(sales_queryset, date_range)


def create_daily_payment_method_data(pd_data_in, date_range):
    chart_data = {}

    if len(pd_data_in) <= 0:
        return chart_data

    pd_data_values = pd_data_in.values_list('total', 'payment_method__method_name', 'payment_method_id')
    df = pd.DataFrame(list(pd_data_values), columns=["total", "payment_method", "payment_method_id"])

    totals_df = df.groupby(['payment_method', 'payment_method_id'])[['total']].sum()
    totals_df['total'] = totals_df['total'].apply(pd.to_numeric, errors='coerce')

    totals = totals_df.T.to_dict('index')
    total_values = totals.get('total')
    payment_types = []
    for total_type, total_qty in total_values.items():
        if total_type[1] not in payment_types:
            payment_types.append(total_type[1])
            chart_data[total_type[0]] = 0
        chart_data[total_type[0]] = total_qty

    return chart_data

def create_weekly_payment_method_data(pd_data_in, date_range):
    # chart_type_stats = {'direct': {'count': 0, 'value': 0}, 'medusa': {'count': 0, 'value': 0}, 'account': {'count': 0, 'value': 0}, 'total': {'count': 0, 'value': 0}}
    chart_data = {}

    if len(pd_data_in) <= 0:
        return chart_data

    pd_data_values = pd_data_in.values_list('total', 'payment_method__method_name', 'payment_method_id','date_added')
    df = pd.DataFrame(list(pd_data_values), columns=["total", "payment_method", "payment_method_id", "date_added"])
    df.sort_values(by='date_added', inplace=True)
    df['day_of_week'] = df['date_added'].dt.dayofweek
    df['day_of_week_name'] = df['date_added'].dt.day_name()

    totals_df = df.groupby(['day_of_week', 'payment_method', 'payment_method_id'])[['total']].sum()
    totals_df['total'] = totals_df['total'].apply(pd.to_numeric, errors='coerce')

    totals = totals_df.T.to_dict('index')
    total_values = totals.get('total')
    dow = 0
    payment_types = []
    for total_type, total_qty in total_values.items():  # total_type = ['day of week', 'website_direct', 'payment_type']
        if total_type[2] not in payment_types:
            payment_types.append(total_type[2])
            chart_data[total_type[1]] = [0,0,0,0,0,0,0]
        chart_data[total_type[1]][total_type[0] - 1] = total_qty

    return chart_data


def create_monthly_payment_method_data(pd_data_in, date_range):
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


