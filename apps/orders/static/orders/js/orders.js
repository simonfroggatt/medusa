$(function () {
    //navigator.clipboard.writeText(
    //copy the order number to clipboard
    var product_list_table = $('#order_product_list').DataTable({
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
        "ajax": "/orders/api/order-products/" + current_order_id + "/?format=datatables",
        "columns": [
            {
                "data": "model",
                responsivePriority: 1
            },
            {

                "data": "product_variant.prod_var_core.product.image",
                "className": "center",
                "searchable": false,
                "sortable": false,
                "defaultContent": 'no-image.png',
                render: function (data, type, row) {
                    if (data === undefined || data === null) {
                        return '<img height="30px" class="rounded mx-auto d-block" src="'+ media_url+'stores/no-image.png">'
                    } else {
                        let image_src =  data;
                        return '<a href="' + image_src + '" data-lightbox="image"><img height="30px" class="rounded mx-auto d-block" src="' + image_src + '">';
                    }

                }
            },
            {
                "data": "name",
                responsivePriority: 4
            },
            {"data": "size_name"},
            {"data": "material_name"},
            {
                "data": "order_product_option",
                "searchable": false,
                render: function (data, type, row) {
                    let options_text = "";
                    $.each(data, function (index, value) {
                        options_text += index > 0 ? '<br>' + value.option_name + " : " + value.value_name : value.option_name + " : " + value.value_name;
                    });
                    return options_text;
                },
            },
            {
                "data": "order_product_variant_options",
                "searchable": false,
                render: function (data, type, row) {
                    let options_text = "";
                    $.each(data, function (index, value) {
                        options_text += index > 0 ? '<br>' + value.class_name + " : " + value.value_name : value.class_name + " : " + value.value_name;
                    });
                    return options_text;
                },
            },
            {
                "data": "status.name",
                "defaultContent": 'open',
                className: 'text-md-end',
                responsivePriority: 5,
                render: function (data, type, row) {
                    let order_product_id = row['order_product_id']
                    let history_icon = '<a class="btn btn-outline-secondary btn-xs js-order-product-edit" role="button" data-url="' + current_order_id + '/product/' + order_product_id + '/history" data-dlgsize="modal-lg"><i class="fa-regular fa-clock-rotate-left fa-sm"></i></a>';
                    let history_link = '<a class="js-order-product-edit info-link" data-url="' + current_order_id + '/product/' + order_product_id + '/history" data-dlgsize="modal-lg">'+data+'</a>';

                    return history_link
                }
            },
            {
                "data": "quantity",
                responsivePriority: 3,
                className: 'text-md-end'
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

                data: "order_product_id",
                sortable: false,
                className: 'text-md-end text-start',
                render: function (data, type, row) {

                    let edit_icon = '<a class="btn '+button_context['BUTTON_EDIT']+' btn-tsg-row js-order-product-edit" role="button" data-url="' + current_order_id + '/product/edit/' + data + '" data-dlgsize="modal-xl"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                    let delete_icon = '<a class="btn '+button_context['BUTTON_DELETE']+' btn-tsg-row js-order-product-edit" role="button" data-url="' + current_order_id + '/product/delete/' + data + '" data-dlgsize="modal-sm"><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>'
                    return delete_icon + "  " + edit_icon;

                },
            },


        ],
    });


    let order_totals_table = $('#order_totals').DataTable({
        "lengthChange": false,
        "autoWidth": true,
        'serverSide': true,
        'searching': false,
        "paging": false,
        "info": false,
        "ajax": "/orders/api/ordertotal/" + current_order_id + "/?format=datatables",
        "columns": [
            {
                "data": "code",
                "visible": false,

            },
            {
                "data": "title", "orderable": false,
                render: $.fn.dataTable.render.number(',', '.', 2, ''),
                className: 'text-end'
            },
            {
                "data": "value", "orderable": false,
                render: function(data, type, row) {
                    //let rtn_val = $.fn.dataTable.render.number(',', '.', 2, '')
                    let rtn_val = parseFloat(data).toFixed(2)
                    if(row['code'] == 'total')
                        rtn_val = currency_symbol+ rtn_val
                    return rtn_val
                },
                className: 'text-end'
            }
        ],

        "drawCallback": function (settings) {
            $("#order_totals thead").remove();
        },

        "createdRow": function (row, data, dataIndex) {
            if (data.code == 'total') {
                $(row).addClass('order-total');
            }
            if (data.code == 'shipping') {
                $(row).addClass('align-middle');
            }
        }
    })

    let loadOrderOptionsForm = function () {
        var btn = $(this);  // <-- HERE
        let dlg_size = btn.attr("data-dlgsize")
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass(dlg_size)
                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                } else {
                    // $("#modal-base .modal-title").html("Edit Address");
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
    }


    let saveOrderDeleteForm = function () {
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
                    $("#modal-base").modal("hide");  // <-- Close the modal
                    if (Boolean(data.redirect_url)) {
                        window.location.href = data.redirect_url
                    }
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    let loadProductEditForm = function () {
        var btn = $(this);  // <-- HERE
        let dlg_size = btn.attr("data-dlgsize")
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass(dlg_size)
                $("#modal-base .modal-content").html('<html><body></body></html>');
                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                } else {
                    // $("#modal-base .modal-title").html("Edit Address");
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
    }

    let saveProductEditForm = function () {
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
                    $("#modal-base").modal("hide");  // <-- Close the modal
                    updateProductTable()
                    updateTotalsTable()
                    updateOrderTotalText(form)
                    updateOrderFlags()
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    let saveProductAddForm = function (form, bl_extra = false) {
        //var form = $(this);
        let data = form.serialize()
        if(bl_extra) {
             let data_variant_options = $('#form_variant_options').serialize()
             let data_options = $('#form_product_options').serialize()
             data += '&' + data_variant_options + '&' + data_options
             //let data_options_values = selected_option_values
             //if(data_options_values.length > 0) {
             //   data += '&option_data_values='+ data_options_values

        }

        $.ajax({
            url: form.attr("action"),
            data: data,
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateProductTable()
                    updateTotalsTable()
                    updateOrderTotalText(form)
                    add_toast_message('Item was added to Cart','Add Products', 'bg-success')
                } else {
                    add_toast_message('Opps, something went wrong','Add Products', 'bg-error')
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }


    var updateProductTable = function () {
        //let url =  "/orders/api/order-products/" + current_order_id + "/?format=datatables";
        //product_list_table.ajax.url( url ).load();
        product_list_table.ajax.reload();
        return false;
    }

    var updateTotalsTable = function () {
        order_totals_table.ajax.reload();
        return false;
    }

    var updateOrderTotalText = function () {
        $.ajax({
            url: "api/orders/product_text",
            data: "order_id="+current_order_id,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                let output_str = "<strong>"+data['order_lines']+"</strong> lines and <strong>" + data['order_product_count'] + "</strong> products"
                $("#order_product_summary").html(output_str);
            }
        });
        return false;
    }

    let loadAddressEditForm = function () {
        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                    updateAddressDiv();
                } else {
                    // $("#modal-base .modal-title").html("Edit Address");
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
    }

    let loadOrderDetailsEditForm = function () {
        var btn = $(this);  // <-- HERE
        let dlg_size = btn.attr("data-dlgsize")
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass(dlg_size)
                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                } else {
                    // $("#modal-base .modal-title").html("Edit Address");
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
    }

    let loadOrderShippingChoiceEditForm = function () {
        var btn = $(this);  // <-- HERE
        let dlg_size = btn.attr("data-dlgsize")
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass(dlg_size)
                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
        return false;
    }


    let SaveOrderShippingChoiceEditForm = function () {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide");  // <-- Close the modal
                    updateTotalsTable()
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    let LoadOrderShipIt = function () {
        var btn = $(this);  // <-- HERE
        let dlg_size = btn.attr("data-dlgsize")
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass(dlg_size)
                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
    }

    let SaveOrderShipIt = function () {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateOrderDetails()
                    updateProductTable()
                    updateOrderFlags()
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
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

    let updateAddressDiv = function () {
        $.ajax({
            url: '/orders/' + current_order_id + '/addresses',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                $('#div_billing-address #order-billing').html(data.html_billing_address)
                $('#div_shipping-address #order-shipping').html(data.html_shipping_address)
            }
        });
        return false;
    }

    let updateOrderFlags = function () {
         $.ajax({
            url: '/orders/' + current_order_id + '/flags',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $('#div_order_flags').html(data.html_order_flags)
            }
        });
        return false;

    }

    let saveOrderEditForm = function () {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateOrderDetails()
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    let updateOrderDetails = function () {
        //now update the order details and notes section
        $.ajax({
            url: '/orders/' + current_order_id + '/details',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                $('#div_order_details').html(data.html_order_details)
                $('#order_comment').html(data.html_comment)
            }
        });
        return false;
    }
/*
    $(".switchApplyBulk").change(function () {
        alert('bulk js')
        let form_id = '#' + $(this).parents("form").attr('id')
        let product_price = form_id + " #price";
        $(product_price).prop('readonly', $(this).is(":checked"))
    })


    $(".calc_line_totals").change(function (element) {
        alert('here')
        let form_id = '#' + $(this).parents("form").attr('id')
        let tax_price = 0.00;
        let use_bulk = $(form_id + ' #switchApplyBulk').is(":checked");
        if (use_bulk)
            SetPrice(true, form_id);
        else {
            let qty = $(form_id + ' #quantity').val();
            let price = $(form_id + ' #price').val();
            let line_total = calc_totals(price, qty);
            tax_price = parseFloat(line_total * tax_rate).toFixed(2);
            $(form_id + ' #total').val(line_total);
            $(form_id + ' #line_total_cal').html(line_total);
            $(form_id + ' #line_total_cal').trigger('change');
            $(form_id + ' #total').val(line_total);
            $(form_id + ' #tax').val(tax_price);
            $(form_id + ' #single_price').val(price);
        }

    });
*/

    function calc_totals(price, qty) {
        return (price * qty).toFixed(2);
    }

    function SetPrice(getbulk = true, form_id) {
        let qty_field = form_id + " #quantity";
        let product_price = form_id + " #price";
        let line_price = 0.00;
        let tax_price = 0.00;
        let base_price = $(form_id + ' #single_unit_price').val().toFixed(2);
        let discount_price = 0.00;
        let qty = parseInt($(qty_field).val())
        let bulk_group_id = $(form_id + ' .bulk_group_select').val();

        drawBulkTable(bulk_group_id, form_id);
        $(form_id + ' #single_unit_price').val(base_price)


        if (getbulk) {
            let discount = getBulkPriceDiscount(bulk_group_id, qty, form_id)
            discount_price = (parseFloat(base_price).toFixed(2) * discount).toFixed(2);
            line_price = parseFloat(qty * discount_price).toFixed(2);
            $(product_price).val(discount_price);

        } else {
            line_price = (qty * $('#single_unit_price').val()).toFixed(2);
        }

        tax_price = parseFloat(line_price * tax_rate).toFixed(2);

        $(form_id + ' #total').val(parseFloat(line_price).toFixed(2));
        $(form_id + ' #tax').val(tax_price)
        $(form_id + ' #line_total_cal').html(line_price);
        $(form_id + ' #line_total_cal').trigger('change');


    }



    $('.bulk_group_select').change(function () {
        let form_id = '#' + $(this).parents("form").attr('id')
        drawBulkTable(this.value, form_id)
        SetPrice(true, form_id)
    })


    function drawBulkTable(bulk_group_id, form_id) {
        let base_price = $(form_id + ' #single_unit_price').val().toFixed(2);
        var bulk_array = $.grep(bulk_table_data, function (e) {
            return e.id == bulk_group_id;
        })[0];
        var tbl = $('<table class="table table-hover table-striped align-middle table-sm"></table>').attr({id: "bulk_pricing_tbl"});
        var header = $('<thead></thead>').appendTo(tbl);
        var headerrow = $('<tr></tr>').appendTo(header);
        var body = $('<tbody></tbody>').appendTo(tbl);
        var row = $('<tr></tr>').appendTo(body);

        $(form_id + ' #bulk_pricing_div').empty();

        $.each(bulk_array['breaks'], function (index, value) {
            if (index == 0) {
                $('<th></th>').text(value['qty_range_min']).appendTo(headerrow);
            } else if (index == bulk_array['breaks'].length - 1) {
                $('<th></th>').text(value['qty_range_min'] + "+").appendTo(headerrow);
            } else {
                var nextbreak = bulk_array['breaks'][index + 1]['qty_range_min'] - 1;

                $('<th></th>').text(value['qty_range_min'] + "-" + nextbreak).appendTo(headerrow);
            }
            let bulkprice = base_price * ((100 - value['discount_percent']) / 100)
            $('<td class="bulkcell" data-variant-cellid="' + index + '"></td>').text(parseFloat(bulkprice).toFixed(2)).appendTo(row);
        })
        tbl.appendTo(form_id + ' #bulk_pricing_div');


    }

    function getBulkPriceDiscount(bulk_group_id, qty, form_id) {
        var bulk_array = $.grep(bulk_table_data, function (e) {
            return e.id == bulk_group_id;
        })[0];
        let discount = 1;
        let cell_index = 1;
        $.each(bulk_array['breaks'], function (index, value) {
            if (index >= bulk_array['breaks'].length - 1) {
                discount = 100 - value['discount_percent'];
                cell_index = index;
                return false;
            }
            var nextbreak = bulk_array['breaks'][index + 1]['qty_range_min']
            if ((value['qty_range_min'] <= qty) && qty < nextbreak) {
                discount = 100 - value['discount_percent'];
                cell_index = index;
                return false;
            }
        })
        setDiscountCellColour(cell_index, form_id)
        return (discount / 100).toFixed(2)
    }

    function setDiscountCellColour(cell_index, form_id) {

        var allCells = $(form_id + " .bulkcell");
        allCells.removeClass("table-success");

        var cellToColour = $(form_id + ' [data-variant-cellid="' + cell_index + '"]');
        cellToColour.addClass("table-success");

    }

    function BillingAddressQuick() {
        let add_id = $('input[name="addressListItem_billing"]:checked').data('addressListIdBilling');
        $('#order_billing_addressbook #address_book_id_billing').val(add_id)
        let form = $('#order_billing_addressbook');
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
    }


    function ShippingAddressQuick() {
        let add_id = $('input[name="addressListItem_shipping"]:checked').data('addressListIdShipping');
        $('#order_shipping_addressbook #address_book_id_shipping').val(add_id)
        let form = $('#order_shipping_addressbook');
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
    }

    function ShippingAddressSearchQuick() {
        let form = $('#js-order-shipping-change');
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

    function SaveOrderDiscountForm() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateTotalsTable()
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function PrintPaperWork() {
        $('#form-order-print').submit()
        return false;
    }


    $(document).on('click', '.js-order-product-edit', loadProductEditForm);
    $(document).on("submit", "#js-product-edit-submit", saveProductEditForm);
    $(document).on("submit", ".js-product-add",function ()
    {
        saveProductAddForm($(this), true);
        return false;
    });

    $(document).on("submit", ".js-product-add-bespoke", function ()
    {
        saveProductAddForm($(this), false);
        return false;
    });

    $(document).on('click', '.js-order-address-edit', loadProductEditForm);
    $(document).on("submit", "#js-order-address-edit-submit", saveAddressEditForm);

    $(document).on("click", ".js-order-details-edit", loadOrderDetailsEditForm);
    $(document).on("submit", "#js-order-details-edit-submit", saveOrderEditForm);

    $(document).on("click", "#js_order_billing_address_btn", BillingAddressQuick);
    $(document).on("click", "#js_order_shipping_address_btn", ShippingAddressQuick);

    $(document).on('click', '.js-order-shipping-choice-edit', loadOrderShippingChoiceEditForm);
    $(document).on("submit", "#js-order-shipping-choice-edit", SaveOrderShippingChoiceEditForm);

    $(document).on('click', '.js-order-ship-it', LoadOrderShipIt);
    $(document).on("submit", "#js-order-ship-it", SaveOrderShipIt);

    $(document).on("submit", "#js-order-delete-form", saveOrderDeleteForm);

    $(document).on("submit", "#js-order-tax-change-rate", SaveOrderShippingChoiceEditForm);
    $(document).on("submit", "#js-order-discount-change-form", SaveOrderDiscountForm);


    $(document).on("click", "#dropdownMenuPrint", PrintPaperWork);


    $(document).on("submit", "#js-order-shipping-change", ShippingAddressSearchQuick);


    //order documents
    $(document).on("submit", "#form_order_document", DocumentUpload);
    $(document).on("click", ".js-order_document-delete", loadForm);
    $(document).on("submit", "#form-order_document-delete", DocumentUpload);

    //XERO api stuff
    $(document).on("click", ".js-xero-api", XeroApiCall);
    $(document).on("click", ".js-xero-dlg", XeroApiCallDlg);

})

function copy_orderno_to_clipboard(order_number) {
    const el = document.createElement('textarea');
    el.value = '#' + order_number;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

}

//Dropzone.autoDiscover = false;

Dropzone.options.orderDocDropzone = { // camelized version of the `id`
    paramName: "filename", // The name that will be used to transfer the file
    maxFilesize: 2, // MB
    autoProcessQueue: false,
    uploadMultiple: false,

    init: function() {
        var myDropzone = this;

        // First change the button to actually tell Dropzone to process the queue.
        this.element.querySelector("button[type=submit]").addEventListener("click", function (e) {
            // Make sure that the form isn't actually being sent.
            e.preventDefault();
            e.stopPropagation();
            myDropzone.processQueue();
        });


    },

    success: function (file, response) {
        if(response.upload){
            alert('uploaded done')
        } else {
            alert('error')
        }
    }

  };

var ORDERSNAMESPACE_old = {}
ORDERSNAMESPACE_old.SetSingleUnitPrice = function (new_price, form_id, bl_update_pricing = false) {
        $(form_id + ' #single_unit_price').val(new_price);
        if (bl_update_pricing) {
            SetPrice(true, form_id)
        }
    }




