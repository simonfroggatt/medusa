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
                    if (data === undefined) {
                        return '<img height="30px" class="rounded mx-auto d-block" src="http://safetysigns/image/no-image.png">'
                    } else {
                        let image_src = 'http://safetysigns/image/' + data;
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
                        options_text += index > 0 ? '<br>' + value.name + " : " + value.value : value.name + " : " + value.value;
                    });
                    return options_text;
                },
            },
            {
                "data": "status.name",
                "defaultContent": 'open',
                responsivePriority: 5
            },
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

                data: "order_product_id",
                sortable: false,
                className: 'text-md-end text-start',
                render: function (data, type, row) {

                    let edit_icon = '<a class="btn btn-primary btn-sm js-order-product-edit" role="button" data-url="' + current_order_id + '/product/edit/' + data + '" data-dlgsize="modal-xl"><i class="fas fa-edit fa-sm"></i></a>';
                    let delete_icon = '<a class="btn btn-danger btn-sm js-order-product-edit" role="button" data-url="' + current_order_id + '/product/delete/' + data + '" data-dlgsize="modal-sm"><i class="fas fa-trash fa-sm"></i></a>'
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
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    let saveProductAddForm = function () {
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
                    updateProductTable()
                    updateTotalsTable()
                    updateOrderTotalText(form)
                } else {
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
                $("#order_product_summary span").html(output_str);
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

    $(".switchApplyBulk").change(function () {
        let form_id = '#' + $(this).parents("form").attr('id')
        let product_price = form_id + " #price";
        $(product_price).prop('readonly', $(this).is(":checked"))
    })


    $(".calc_line_totals").change(function (element) {
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
            $(form_id + ' #total').val(line_total);
            $(form_id + ' #tax').val(tax_price)
        }

    });


    function calc_totals(price, qty) {
        return (price * qty).toFixed(2);
    }

    function SetPrice(getbulk = true, form_id) {
        let qty_field = form_id + " #quantity";
        let product_price = form_id + " #price";
        let line_price = 0.00;
        let tax_price = 0.00;
        let base_price = $(form_id + ' #single_unit_price').val();
        let discount_price = 0.00;
        qty = parseInt($(qty_field).val())
        bulk_group_id = $(form_id + ' .bulk_group_select').val();

        drawBulkTable(bulk_group_id, form_id);

        if (getbulk) {
            discount = getBulkPriceDiscount(bulk_group_id, qty, form_id)
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
    }

    $('.bulk_group_select').change(function () {
        let form_id = '#' + $(this).parents("form").attr('id')
        drawBulkTable(this.value, form_id)
        SetPrice(true, form_id)
    })


    function drawBulkTable(bulk_group_id, form_id) {

        let base_price = $(form_id + ' #single_unit_price').val()
        var bulk_array = $.grep(bulk_table_data, function (e) {
            return e.id == bulk_group_id;
        })[0];
        var tbl = $('<table class="table table-bordered table-condensed"></table>').attr({id: "bulk_pricing_tbl"});
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


    $(document).on('click', '.js-order-product-edit', loadProductEditForm);
    $(document).on("submit", "#js-product-edit-submit", saveProductEditForm);
    $(document).on("submit", ".js-product-add", saveProductAddForm);

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

    //$(document).on("submit", ".order_billing_addressbook", BillingAddressQuick)


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

