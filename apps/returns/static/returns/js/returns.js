$(function () {
    /*SETUP the TABLES*/
    if ($.fn.dataTable.isDataTable('#returns_list_table')) {
        let returns_list_table = $('#returns_list_table').DataTable();
    } else {
        let returns_list_table = $('#returns_list_table').DataTable({
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
                "url": "/returns/api/returns/?format=datatables"
            },
            "deferRender": false,
            "search": {
                "regex": true
            },
            "rowId": 'id',
            "order": [[1, "asc"]],
            columns: [
                {
                    data: "store.thumb",
                    sortable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        let image_src = media_url + "stores/branding/logos/" + data;
                        return '<img height="15px" src="' + image_src + '">'
                    }
                },
                {
                    data: "id",
                    sortable: true,
                    render: function (data, type, row) {
                        return "RTN-"+row['store']['prefix'] + "-"+ data;
                    }
                },

                {
                    data: "order.order_id",
                    render: function (data, type, row) {
                        return '<a href="/orders/' + data + '" target="_blank">' + row['order']['invoice_prefix'] + data + '</a>';
                    }
                },
                {
                    data: "contact_name"
                },
                {
                    data: "date_created",
                    sortable: true,

                },

                {
                    data: "contact_requested",

                },
                {
                    data: "comment",
                },
                {
                    data: "status.title",
                    sortable: true,

                },
                {
                    data: "id",
                    sortable: false,
                    searchable: false,
                    className: 'text-end',
                    render: function (data, type, row) {
                        let btn_grp = '<div class="btn-group" role="group" aria-label="Order status">'
                        //  let printed_icon = '<button type="button" class="btn btn-tsg-row disabled ' + printed_colour + '"><i class="fa-solid fa-print  "></i></button>'
                        //  let shipping_icon = '<button type="button" class="btn btn-tsg-row disabled ' + shipping_colour + '"><i class="fa-solid fa-shipping-fast "></i></button>'
                        let edit_icon = '<a class="btn ' + button_context['BUTTON_EDIT'] + ' btn-tsg-row" role="button" href="/returns/' + data + '"><i class="' + icons_context['ICON_EDIT'] + ' "></i></a>'
                        let delete_icon = '<a class="btn ' + button_context['BUTTON_DELETE'] + ' btn-tsg-row js-return-delete" role="button" data-url="' + data + '/delete" data-dlgsize="modal-sm"><i class="' + icons_context['ICON_DELETE'] + ' fa-sm"></i></a>'

                        //let delete_icon = '<button type="button" class="btn ' + button_context['BUTTON_DELETE'] + ' btn-tsg-row" data-bs-toggle="modal" data-bs-target="#deleteModal" data-bs-id="' + data + '"><i class="' + icons_context['ICON_DELETE'] + ' "></i></button>'
                        return btn_grp + delete_icon + edit_icon + '</div>'
                    }
                }
            ]
        })
    }

     $(document).on("click", ".js-return-delete", loadForm);

     $(document).on('submit', '#js-return-delete-form', function () {
         SaveDialogUpdateTable('returns_list_table', $(this));
         return false;
     });

     $(document).on("change", "#return_notes", function()
     {
            let notes = $(this).val();
            let return_id = $(this).attr('data-id');
            $.ajax({
                url: "/returns/api/returns/" + return_id + "/",
                type: "PATCH",
                data: {
                    "comment": notes
                },
                success: function (data) {
                    console.log(data);
                }
            });
     });




    });