$(function () {

    function LoadCompanyContacts() {

        if ( ! $.fn.DataTable.isDataTable( '#company_customers_table' ) ) {
            $('#company_customers_table').dataTable({
                "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "processing": true,
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                "pageLength": 25,
                "autoWidth": false,
                "responsive": true,
                "ajax": {
                    "processing": true,
                    "url": "/customer/api/customerslist/company/" + current_company_id + "?format=datatables"
                },
                "deferRender": true,
                "order": [[1, "asc"]],
                "search": {
                    "regex": true
                },
                columns: [
                    {data: 'fullname'},
                    {data: "email"},
                    {data: "telephone"},
                    {
                        data: "customer_id",
                        sortable: false,
                        className: 'text-md-end text-start',
                        render: function (data, type, row) {

                            let edit_icon = '<a class="btn btn-primary btn-sm" role="button" href="/customer/details/' + data + '"><i class="fas fa-edit fa-sm"></i></a>';
                            let delete_icon = '<a class="btn btn-danger btn-sm" role="button" data-url="' + data + '/product/delete/' + data + '" data-dlgsize="modal-sm"><i class="fas fa-trash fa-sm"></i></a>'
                            return edit_icon;

                        }
                    }

                ]
            });
        }
        else {
            $('#company_customers_table').ajax.reload();
        }
    }

    let company_order_table = $('#company_previous_order_table').DataTable( {
        "dom": "<'row'<'col-6'f><'col-6'lT>>" +
         "<'row'<'col-12'tr>>" +
         "<'row'<'col-6'i><'col-6'p>>",
        "processing" : true,
        "lengthMenu" : [[10,25,50,100,-1], [10,25,50,100,"All"]],
        "pageLength": 25,
        "autoWidth": true,
        "responsive": true,
        "serverSide": true,
        "rowId" : 'order_id',
        "ajax": {
                 "processing": true,
                 "url": "/orders/api/orders-list?format=datatables&company_id="+current_company_id,
                "type" : "POST",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", "{{ csrf_token|escapejs }}");
            }
            },
        "deferRender": false,
        "order": [[ 1, "desc" ]],

        columns :[

            {
                data: "store",
                sortable: false,
                searchable: false,
                name: "store.name",
                render: function ( data, type, row ) {
                    let image_src = static_const + '/images/stores/' + data.thumb;
                    return '<img height="15px" src="' + image_src + '">'
                 }
            },
            {
                data: "order_id",
                 render: function ( data, type, row ) {
                    let url = '/orders/' + data;
                    return '<a href="' + url + '">'+ data + '</a>';
                 }

            },
            {
                data: "customer_order_ref"
            },
            {
                data: "date_added",
            },

            {
                data: "dow",
                 render: function ( data, type, row ) {
                    let text = data + ' (' + row.days_since_order + ')'
                     return text
                 },
                searchable: false

            },
            {
                data: "payment_status.name",
            },
            {
                data: "order_status.name",
            },
            {
                data: "total",
                class: "text-end",
                render: function ( data, type, row ) {
                    return parseFloat(data).toFixed(2);
                 }
            },
            {
                data: "order_id",
                sortable: false,
                className: 'text-end',
                render: function ( data, type, row ) {

                     let edit_icon = '<a class="btn btn-primary btn-sm" role="button" href="/orders/' + data + '"><i class="fas fa-edit fa-sm"></i></a>';


                    return edit_icon;
                }
            },
           {data: "days_since_order", "visible": false, searchable: false },
        ],
        "createdRow": function( row, data, dataIndex ) {
            if ( data.order_status.order_status_id != 15 ) {
                $(row).addClass( 'failed-order' );
            }
         },
    } );



    $(document).on('click', '.js-company-dlg', loadForm);
    $(document).on("submit", "#js-company-edit-form", SaveDialogFormRedirect);

    $(document).on('click', '.js-company-contact-create', loadForm);
    $(document).on("submit", "#js-company-contact-edit-form", SaveDialogFormRedirect);

    $(document).on("click", "#contacts-tab", LoadCompanyContacts);


})