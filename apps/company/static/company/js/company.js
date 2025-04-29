$(function () {

    function LoadCompanyContacts() {
        let company_customers_table = $('#company_customers_table').DataTable();
        company_customers_table.ajax.reload();
    }

     if ($.fn.dataTable.isDataTable('#company_customers_table')) {
        var company_customers_table = $('#company_customers_table').DataTable();
    } else {
         var company_customers_table = $('#company_customers_table').dataTable({
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

                         let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row" role="button" href="/customer/details/' + data + '"><i class="' + icons_context['ICON_EDIT'] + ' fa-sm"></i></a>';
                         let delete_icon = '<a class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row" role="button" data-url="' + data + '/product/delete/' + data + '" data-dlgsize="modal-sm"><i class="' + icons_context['ICON_DELETE'] + ' fa-sm"></i></a>'
                         return delete_icon + " " + edit_icon;

                     }
                 }

             ]
         });
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
        "select": 'single',
        "rowId" : 'order_id',
        "ajax": {
                 "processing": true,
                 "url": "/orders/api/company/?format=datatables&company_id=" + current_company_id,
                "type" : "GET",
            },
        "deferRender": true,
        "order": [[ 1, "desc" ]],

        columns :[

            {
                data: "storeshort",
                name: "storeshort.name",
                sortable: false,
                searchable: false,
                render: function ( data, type, row ) {
                    let image_src =  media_url + 'stores/branding/logos/' + data.thumb
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
                data: "customer.fullname"
            },
            {
                data: "date_added",
            },

            {
                data: "dow",
                 render: function ( data, type, row ) {
                    //let text = data + ' (' + row.days_since_order + ')'
                     return data
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
                render: function (data, type, row) {

                    //let edit_icon = '<a class="btn btn-primary btn-sm" role="button" href="' + data + '"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                    // let delete_icon = '<a class="btn btn-danger btn-sm" role="button" href="' + data +'/delete/"><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>'
                    let shipping_colour = 'btn-grey'
                    if (row['shipping_flag'] != null) {
                        shipping_colour = 'btn-' + row['shipping_flag']['shipping_status__status_colour']
                    }
                    // let shipping_icon = '<i class="fa-solid fa-shipping-fast ' + shipping_colour + ' "></i>'

                    let printed_colour = 'btn-grey'
                    if (row['printed'] == 1) {
                        printed_colour = 'btn-green'
                    }
                    // let printed_icon = '<i class="fa-solid fa-print ' + printed_colour + ' "></i>'


                    //return printed_icon + " " + shipping_icon + /* " " + delete_icon + "  " +*/ edit_icon;
                    let btn_grp = '<div class="btn-group" role="group" aria-label="Order status">'
                    let printed_icon = '<button type="button" class="btn btn-tsg-row disabled ' + printed_colour + '"><i class="fa-solid fa-print  "></i></button>'
                    let shipping_icon = '<button type="button" class="btn btn-tsg-row disabled ' + shipping_colour + '"><i class="fa-solid fa-shipping-fast "></i></button>'
                    let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row" role="button" href="/orders/' + data + '"><i class="'+ icons_context['ICON_EDIT'] +' "></i></a>'
                    return btn_grp + shipping_icon + printed_icon + edit_icon + '</div>'
                }
            },
             {data: "storeshort.store_id", "visible": false, searchable: false },
            {data: "printed", "visible": false, searchable: false},
            {data: "shipping_flag", "visible": false, searchable: false},
            {data: "highlight_code", "visible": false, searchable: false },
          ],
        "createdRow": function( row, data, dataIndex ) {
           /* if ( data.order_status.order_status_id != 15 ) {
                $(row).addClass( 'failed-order' );
            } */
            if(data.shipping_flag == null) {
                if (data.highlight_code == 1) {
                    $(row).addClass('live-order');
                }
                if (data.highlight_code == 2) {
                    $(row).addClass('pending-order');
                }
                if (data.highlight_code == 3) {
                    $(row).addClass('failed-order');
                }
            }

         },
    } );


    $(document).on('click', '.js-company-dlg', loadForm);
    $(document).on("submit", "#js-company-edit-form", SaveDialogFormRedirect);

    $(document).on('click', '.js-company-contact-create', loadForm);
    $(document).on("submit", "#js-company-contact-edit-form", SaveDialogFormRedirect);

    $(document).on("submit", "#js-company-contact-create-form", function() {
        let form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide");  // <-- Close the modal
                    let company_customers_table = $('#company_customers_table').DataTable();
                    company_customers_table.ajax.reload();
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
        }
    )


    $(document).on("click", "#contacts-tab", LoadCompanyContacts);
    $(document).on("submit", "#form_company_document", DocumentUpload);
    $(document).on("click", ".js-company_document-delete", loadForm);
    $(document).on("submit", "#form-company_document-delete", DocumentUpload);

    //XERO api stuff
    $(document).on("click", ".js-xero-company-api", XeroApiCall);
    $(document).on("click", ".js-xero-company-dlg", XeroApiCallDlg);


})