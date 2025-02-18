$(function () {
    /*SETUP the TABLES*/
    if ($.fn.dataTable.isDataTable('#returns_list_table')) {

        let return_product_list = $('#return_product_list').DataTable();
    } else {

        let return_product_list = $('#return_product_list').DataTable({
             "lengthChange": false,
             "responsive": true,
             "autoWidth": false,
             'serverSide': true,
             'order': [[0, 'desc']],
             'searching': false,
             "paging": false,
             "processing": true,
             "select": true,
             "info": false,
             "ajax": "/returns/api/returns/" +current_return_id + "/products?format=datatables",
             "rowId": 'id',
             "columns": [
                 {
                     "data": "order_product.model",
                     responsivePriority: 1
                 },

                 {

                     "data": "product_image_url",
                     "className": "center",
                     "searchable": false,
                     "sortable": false,
                     "defaultContent": 'no-image.png',
                     render: function (data, type, row) {
                         if (data === undefined || data === null) {
                             return '<img height="30px" class="rounded mx-auto d-block" src="' + media_url + 'stores/no-image.png">'
                         } else {

                             let image_src = data;
                             return '<a href="' + image_src + '" data-lightbox="image"><img height="30px" class="rounded mx-auto d-block" src="' + image_src + '">';
                         }

                     }
                 },
                 {
                     "data": "order_product.name",
                     responsivePriority: 4
                 },
                 {"data": "order_product.size_name"},
                 {"data": "order_product.material_name"},
                 {"data": "comment"},
                 {"data": "status.title",},
                 {"data": "reason.title",},
                 {
                     "data": "order_product.quantity",
                     responsivePriority: 3,
                     className: 'text-md-end'
                 },
                 {
                     "data": "order_product.price",
                     "searchable": true,

                     render: $.fn.dataTable.render.number(',', '.', 2, ''),
                     className: 'text-md-end'
                 },
                 {
                     "data": "order_product.total",
                     responsivePriority: 2,
                     "searchable": true,
                     render: $.fn.dataTable.render.number(',', '.', 2, ''),
                     className: 'text-md-end'
                 },
                 {

                     data: "id",
                     sortable: false,
                     className: 'text-md-end text-start',
                     render: function (data, type, row) {

                         let edit_icon = '<a class="btn ' + button_context['BUTTON_EDIT'] + ' btn-tsg-row js-return-product-edit" role="button" data-url="product/' + data + '/edit" data-dlgsize="modal-sm"><i class="' + icons_context['ICON_EDIT'] + ' fa-sm"></i></a>';
                         let delete_icon = '<a class="btn ' + button_context['BUTTON_DELETE'] + ' btn-tsg-row js-return-product-edit" role="button" data-url="product/' + data + '/delete" data-dlgsize="modal-sm"><i class="' + icons_context['ICON_DELETE'] + ' fa-sm"></i></a>'

                         return  delete_icon + "  " + edit_icon;

                     },
                 },
             ],
         });
    }

    $(document).on("click", ".js-return-product-edit", loadForm);

    $(document).on('submit', '#js-return-product-edit-form', function () {
         SaveDialogUpdateTable('return_product_list', $(this));
         return false;
     });

    $(document).on("click", "#js-return-edit", loadForm);
    $(document).on("click", "#js-add-return-product-link", loadForm);

    $(document).on('submit', '#js-return-edit-form', SaveDialogFormRedirect);

    });
