$(function () {
    var daily_sales_chart = new Chart($('#daily_sales_chart').get(0).getContext("2d"), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{

              data: [],
            }]
        },
        options: {
            responsive: false,
            plugins: {
                    title: {
                        display: true,
                        text: 'Payments by Day'
                    },
                legend: {
                    display: true,
                    position: 'top',
            },

                },
        }
    })

    var weekly_sales_chart = new Chart($('#weekly_sales_chart').get(0).getContext("2d"), {
        type: 'bar',
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            datasets: [{
              label: '',
              data: [],
            }]
        },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    title: {
                        display: true,
                        text: 'Stacked Bar chart for pollution status'
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                        
                    }
                },
                datalabels: {
						// Position of the labels
						// (start, end, center, etc.)
						anchor: 'end',
						// Alignment of the labels
						// (start, end, center, etc.)
						align: 'end',
						// Color of the labels
						color: 'blue',
						font: {
							weight: 'bold',
						},
						formatter: function (value, context) {
							// Display the actual data value
							return value;
						}
					}
            }
    })

    var monthly_sales_chart = new Chart($('#monthly_sales_chart').get(0).getContext("2d"), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
              label: 'Monthly Sales',
              data: [],
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Sales for '
                },
                legend: {
                    display: false,
                }
            }
        }
    })

    $('#daily_chart_date').change(function () {
        _update_daily_sales_chart();
    });


    $('#weekly_chart_date').change(function () {
        _update_weekly_sales_chart();
    });

     $('#monthly_chart_month').change(function () {
        _update_monthly_sales_chart();
    });

      $('#monthly_chart_year').change(function () {
        _update_monthly_sales_chart();
    });

    $('#daily_chart_date').trigger('change');
    $('#weekly_chart_date').trigger('change');
    $('#monthly_chart_month').trigger('change');

    function _update_daily_sales_chart() {
        $.ajax({
            url: '/dashboard/data/chart/daily-sales',
            type: 'GET',
            dataType: 'json',
            data: {
                'day_date': $('#daily_chart_date').val(),
            },
            success: function (data) {
                _draw_daily_chart(data['data_set']);
                _draw_daily_stats(data['summary']);
               //var chart = $('#daily_sales_chart')
               // chart.series[0].setData(data['daily_by_method']);
            }
        });
    }

    function _update_weekly_sales_chart() {
        $.ajax({
            url: '/dashboard/data/chart/weekly-sales',
            type: 'GET',
            dataType: 'json',
            data: {
                'weekly_date': $('#weekly_chart_date').val(),
            },
            success: function (data) {
                  // let data_set = data['weekly_data']
                _draw_weekly_chart(data);
                _draw_weekly_stats(data['weekly_data']['summary']);
            }
        });
    }

    function _update_monthly_sales_chart() {
        //get the selected month and year
        let month = $('#monthly_chart_month').find(":selected").val();
        let year = $('#monthly_chart_year').find(":selected").val();
        $.ajax({
            url: '/dashboard/data/chart/monthly-sales',
            type: 'GET',
            dataType: 'json',
            data: {
                'month': month,
                'year': year,
            },
            success: function (data) {
                _draw_monthly_chart(data);
            }
        });
    }



    function _draw_daily_chart(data_array) {

        let dataset_values = [];
        let dataset_labels = [];
        let dataset_colours = [];
       
        for (let i = 0; i < data_array.length; i++) {
            dataset_values.push(data_array[i]['value']);
            dataset_labels.push(data_array[i]['payment_method']);
            dataset_colours.push(data_array[i]['chart_colour']);
        }

        let data_set = {
            datasets: [{ data: dataset_values }],
            labels: dataset_labels
        };

        daily_sales_chart.data.labels = dataset_labels
        daily_sales_chart.data.datasets[0].data = dataset_values
        daily_sales_chart.data.datasets[0].backgroundColor = dataset_colours

        daily_sales_chart.update();

    };

    function _draw_daily_stats(data) {
        $('#daily_total_revenue').text(data['total_value']);
        $('#daily_total_orders').text(data['total_orders']);

        let payment_types = data['payment_totals_by_type'];
        let payment_summary_str = '';
        for (let i = 0; i < payment_types.length; i++) {
            let payment_type = payment_types[i];
            let payment_type_method_name = payment_type['payment_method'];
            let payment_type_total = payment_type['total'];
            let payment_type_count = payment_type['count'];
            let payment_type_total_element_str =  '<li>' + payment_type_method_name + ' &pound;'+ payment_type_total + ' (' + payment_type_count + ')</li>';
            payment_summary_str += payment_type_total_element_str;

        }
        let payment_type_total_element = $('#daily_chart_summary');
        payment_type_total_element.html(payment_summary_str);
    }

    function _draw_weekly_chart(data) {

        weekly_sales_chart.data.datasets = data['weekly_data']['data_set']
        let date_range = data['week_range']
        weekly_sales_chart.options.plugins.title.text = "Weekly Sales from " + date_range['start'] + " to " + date_range['end']
        weekly_sales_chart.update();

    }

     function _draw_weekly_stats(data) {
        $('#weekly_total_revenue').text(data['total_value']);
        $('#weekly_total_orders').text(data['total_orders']);

        let payment_types = data['payment_totals_by_type'];
        let payment_summary_str = '';
        for (let i = 0; i < payment_types.length; i++) {
            let payment_type = payment_types[i];
            let payment_type_method_name = payment_type['payment_method'];
            let payment_type_total = payment_type['total'];
            let payment_type_count = payment_type['count'];
            let payment_type_total_element_str =  '<li>' + payment_type_method_name + ' &pound;'+ payment_type_total + ' (' + payment_type_count + ')</li>';
            payment_summary_str += payment_type_total_element_str;

        }
        let payment_type_total_element = $('#weekly_chart_summary');
        payment_type_total_element.html(payment_summary_str);
    }

    function _draw_monthly_chart(data) {

        let data_set = data['data_set']
        let date_range = data['month_range']
        monthly_sales_chart.data.datasets[0].data = data_set
         let month = $('#monthly_chart_month').find(":selected").text()
        let year = $('#monthly_chart_year').find(":selected").val();
        monthly_sales_chart.options.plugins.title.text = "Total daily Sales for the month of " + month + " " + year
       // monthly_sales_chart.options.scales.x.min = date_range['start']
       // monthly_sales_chart.options.scales.x.max = date_range['end']
        monthly_sales_chart.update();

        _draw_monthly_stats(data['summary']);

    }

    function _draw_monthly_stats(data) {
        $('#monthly_total_revenue').text(data['total_value']);
        $('#monthly_total_orders').text(data['total_orders']);

        let payment_types = data['payment_totals_by_type'];
        let payment_summary_str = '';
        for (let i = 0; i < payment_types.length; i++) {
            let payment_type = payment_types[i];
            let payment_type_method_name = payment_type['payment_method'];
            let payment_type_total = payment_type['total'];
            let payment_type_count = payment_type['count'];
            let payment_type_total_element_str =  '<li>' + payment_type_method_name + ' &pound;'+ payment_type_total + ' (' + payment_type_count + ')</li>';
            payment_summary_str += payment_type_total_element_str;

        }
        let payment_type_total_element = $('#monthly_chart_summary');
        payment_type_total_element.html(payment_summary_str);
    }



});

