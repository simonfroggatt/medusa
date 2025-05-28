$(function () {


    var quote_product_list = $('#quote_product_list').DataTable({
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
            "ajax": "/quotes/api/quote-products/"+ current_quote_id +"/?format=datatables",
            "columns": [
                {
                    "data": "model",
                    responsivePriority: 1
                },
                {

                    "data": "product_image_url",
                    "className": "center",
                    "searchable": false,
                    "sortable": false,
                    "defaultContent": 'no-image.png',
                    render: function (data, type, row) {
                             let image_src =  data;
                            return '<a href="' + image_src + '" data-lightbox="image"><img height="30px" class="rounded mx-auto d-block" src="' + image_src + '">';

                    }
                },
                {
                    "data": "name",
                    responsivePriority: 4
                },
                {"data": "size_name"},
                {"data": "material_name"},
                /*{
                    "data": "order_product_option",
                    "searchable": false,
                    render: function (data, type, row) {
                        let options_text = "";
                        $.each(data, function (index, value) {
                            options_text += index > 0 ? '<br>' + value.name + " : " + value.value : value.name + " : " + value.value;
                        });
                        return options_text;
                    },
                },*/
                {
                    "data": "quantity",
                    responsivePriority: 3
                },
                {
                    "data": "price",
                    "searchable": true,

                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                    className: 'text-md-end'
                },
                {
                    "data": "total",
                    responsivePriority: 2,
                    "searchable": true,
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                    className: 'text-md-end'
                },
                {

                    data: "quote_product_id",
                    sortable: false,
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {

                        let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-quote-product-edit" role="button" data-url="' + current_quote_id + '/product/edit/' + data + '" data-dlgsize="modal-xl"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                        let delete_icon = '<a class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row js-quote-product-edit" role="button" data-url="' + current_quote_id + '/product/delete/' + data + '" data-dlgsize="modal-sm"><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>'
                        return delete_icon + "  " + edit_icon;

                    },
                },


            ],
        });


     let updateQuoteTable = function () {
        quote_product_list.ajax.reload();
        return false;
    }

      let saveQuoteAddForm = function () {
        var form = $(this);
        let url = form.attr("action");
        let data = form.serialize();
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateQuoteTable()
                   // updateTotalsTable()
                     updateQuoteTotalText(form)
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    let saveQuoteEditForm = function () {
        var form = $(this);
        let url = form.attr("action");
        let data = form.serialize();
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateQuoteTable()
                   // updateTotalsTable()
                     updateQuoteTotalText(form)
                    $("#modal-base").modal("hide")
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    var updateQuoteTotalText = function () {
        $.ajax({
            url: "api/quotes/product_text",
            data: "quote_id="+current_quote_id,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                let output_str = "<strong>"+data['order_lines']+"</strong> lines and <strong>" + data['order_product_count'] + "</strong> products"
                $("#quote_product_summary").html(output_str);
                $("#span_quote_subtotal").html(data['quote_total']['subtotal'])
                $("#span_quote_discount").html(data['quote_total']['discount'])
                $("#span_quote_tax").html(data['quote_total']['tax_value'])
                $("#span_quote_total").html(data['quote_total']['total'])
            }
        });
        return false;
    }

    function PrintQuote() {
        $('#form-quote-print').submit()
        return false;
    }


    function resetQuoteCompanyBillingAddress()
    {
        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                   updateAddressDiv()
                } else {
                    // $("#modal-base .modal-title").html("Edit Address");
                }
            },
        });

    }

    function BillingAddressQuick() {
        let add_id = $('input[name="addressListItem_billing"]:checked').data('addressListIdBilling');
        $('#quote_billing_addressbook #address_book_id_billing').val(add_id)

        let form = $('#quote_billing_addressbook');
        let tmp = form.serialize();
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                updateAddressDiv()
                $("#modal-base").modal("hide");  // <-- Close the modal
            }
        });

        $('#collapseBillingAddress').collapse("hide");

        return false;
    }

    function ShippingAddressQuick() {
        let add_id = $('input[name="addressListItem_shipping"]:checked').data('addressListIdShipping');

        $('#quote_shipping_addressbook #address_book_id_shipping').val(add_id)
        let form = $('#quote_shipping_addressbook');
        let tmp = form.serialize();
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                updateAddressDiv()
                $("#modal-base").modal("hide");  // <-- Close the modal
            }
        });

        $('#collapseShippingAddress').collapse("hide");
        return false;
    }

    function ShippingAddressSearchQuick() {
        let form = $('#js-quote-shipping-change');
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                updateAddressDiv()
                $("#modal-base").modal("hide");  // <-- Close the modal
            }
        });
        return false;
    }

    let updateAddressDiv = function (quote_id) {
        $.ajax({
            url: '/quotes/' + current_quote_id + '/addresses',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                $('#div_billing-address #quote-billing').html(data.html_billing_address)
                $('#div_shipping-address #quote-shipping').html(data.html_shipping_address)
            }
        });
        return false;
    }

    let saveAddressEditForm = function () {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateAddressDiv()
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }


    $(document).on('click', '#js-quote-edit', loadForm);
    $(document).on('submit', '#js-quote-details-edit-submit', SaveDialogFormRedirect);

    $(document).on("submit", ".js-quote-add", saveQuoteAddForm);

    $(document).on('click', '#js-quote-product-edit', loadForm);

    $(document).on('click', '.js-quote-product-edit', loadForm);
    $(document).on('submit', '#js-quote-product-edit-submit', saveQuoteEditForm);
    $(document).on('submit', '.js-quote-product-edit-submit', saveQuoteEditForm);

    $(document).on('click', '.js-quote-cog-option', loadForm);

    $(document).on("click", "#dropdownMenuPrintQuote", PrintQuote);
    $(document).on("submit", "#js-quote-discount-change-form", SaveDialogFormRedirect);

    $(document).on("submit", "#js-quote-delete-form", SaveDialogFormRedirect);

    //REST BILLING ADDRESS
    $(document).on("click", "#resetQuoteCompanyBillingAddress", resetQuoteCompanyBillingAddress);
    $(document).on("click", "#js_quote_billing_address_btn", BillingAddressQuick);
    $(document).on("click", "#js_quote_shipping_address_btn", ShippingAddressQuick);
    $(document).on("submit", "#js-quote-shipping-change", ShippingAddressSearchQuick);
    $(document).on('click', '.js-quote-address-edit', loadForm);
    $(document).on("submit", "#js-quote-address-edit-submit", saveAddressEditForm);

    $(document).on('click', '.js-quote-convert-form', loadForm);
    $(document).on("submit", "#js-quote-convert-form", SaveDialogFormRedirect);

    $(document).on('click', '#js-quote-billing-copy', resetQuoteCompanyBillingAddress);


})