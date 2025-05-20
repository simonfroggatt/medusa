$(function () {

    var base_prices_table = $('#base_prices_table').DataTable({
        "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        "processing": true,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "pageLength": 25,
        "autoWidth": true,
        "select": 'single',
        "responsive": true,
        "serverSide": true,
        "ajax": {
            "processing": true,
            "url": "/pricing/api/prices/?format=datatables",


        },
        "deferRender": true,

        "search": {
            "smart": true
        },
        columns: [

            {data: "product_size.size_name", defaultContent: ""},
            {data: "product_size.size_width", defaultContent: "", searchable: true},
            {data: "product_size.size_height", defaultContent: "", searchable: true},
            {data: "product_material.material_name", defaultContent: "", searchable: true},
            {data: "price", defaultContent: 0.00},
            {data: "weight", defaultContent: 0.00},
            {
                data: "id",
                sortable: false,
                className: 'text-end',
                render: function (data, type, row) {
                    let edit_icon = '<a class="btn ' + button_context['BUTTON_EDIT'] + ' btn-tsg-row" role="button" href="' + data + '/edit"><i class="' + icons_context['ICON_EDIT'] + ' fa-sm"></i></a>';
                    let delete_icon = '<a class="btn ' + button_context['BUTTON_DELeTE'] + ' btn-tsg-row" role="button" href="delete/' + data + '"><i class="' + icons_context['ICON_DELETE'] + ' fa-sm"></i></a>';
                    let add_icon = '<a class="btn ' + button_context['BUTTON_ADD'] + ' btn-tsg-row js-pricing-edit" role="button" data-url="/pricing/prices/' + data + '/store/create"><i class="fa-solid fa-globe fa-sm"></i></a>';
                    return delete_icon + "  " + edit_icon + " " + add_icon
                }
            },
           /* {data: "product_size.size_width", "visible": false, searchable: true},
            {data: "product_size.size_height", "visible": false, searchable: true},*/

        ]
    });

    var store_prices_table = $('#store_prices_table').DataTable({
        "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        "processing": true,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "pageLength": 25,
        "autoWidth": false,
        "select": 'single',
        "responsive": false,
        "ajax": {
            "processing": true,
            "url": "/pricing/api/storeprices/1?format=datatables"
        },
        "deferRender": false,
        "search": {
            "regex": true
        },
        columns: [
            {
                data: "store.thumb",
                render: function (data, type, row) {

                    let image_src = media_url + 'stores/branding/logos/' + data;
                    return '<img height="15px" src="' + image_src + '">'
                }
            },
            {data: "size_material_comb.product_size.size_name", defaultContent: ""},
            {data: "size_material_comb.product_size.size_width", defaultContent: ""},
            {data: "size_material_comb.product_size.size_height", defaultContent: ""},
            {data: "size_material_comb.product_material.material_name", defaultContent: ""},
            {data: "price", defaultContent: 0.00},
            {data: "size_material_comb.price", defaultContent: 0.00},
            {
                data: "id",
                sortable: false,
                className: 'text-end',
                render: function (data, type, row) {
                    let store_id = row['store']['store_id'];
                    let size_material_id = row['size_material_comb']['id'];
                    let edit_icon = '<a class="btn ' + button_context['BUTTON_EDIT'] + ' btn-tsg-row js-pricing-edit" role="button" data-url="/pricing/prices/' + data + '/store/edit"><i class="' + icons_context['ICON_EDIT'] + ' fa-sm"></i></a>';
                    let delete_icon = '<a class="btn ' + button_context['BUTTON_DELETE'] + ' btn-tsg-row js-pricing-edit" role="button" data-url="/pricing/prices/' + data + '/store/delete"><i class="' + icons_context['ICON_DELETE'] + ' fa-sm"></i></a>'
                    return delete_icon + "  " + edit_icon;
                }
            }

        ]
    });

    $('#select_prices_by_store_id').on('change', function () {
        let newval = $(this).val()
        let ajax_url = "/pricing/api/storeprices/" + newval + "?format=datatables"
        store_prices_table.ajax.url(ajax_url).load();
    });

    function saveStoreComboPriceSave() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    store_prices_table.ajax.reload();
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function deletePriceSize() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    let sizes_table = $('#sizes_table').DataTable();
                    sizes_table.ajax.reload();
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function deletePriceMaterial() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    let materials_table = $('#materials_table').DataTable();
                    materials_table.ajax.reload();
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function createProductPriceText(){
        let core_vars_tbl = $('#core_variants_table').DataTable()

        var tableToQuery = $("#core_variants_table").DataTable();
        var selectedRow = $("#core_variants_table tr.selected");
        var data_row = tableToQuery.row(selectedRow).data();

        let core_variant = data_row['prod_var_core'];
        let text_string = "";
        let size_str = core_variant['size_material']['product_size']['size_name'];
        let material_str = core_variant['size_material']['product_material']['material_name'];
        let orientation_str = core_variant['size_material']['product_size']['orientation']['orientation_name'];
        let model_str = data_row['variant_code'];

        text_string = model_str + " - " + size_str
            //+ " ( " + orientation_str + " ) "
            + " - " + material_str;

        let price_string = "";
        let form_id = '#form-stock'
        let price_str = $(form_id + ' #price').val();
        let qty_str = $(form_id + ' #quantity').val();

        price_string = " @ £" + price_str + " each for " + qty_str + " off";
        let footer_string = "\n\nAll prices exclude VAT at the current rate."
        $('#form-stock #string_to_copy').val(text_string + price_string + footer_string)
        $('#form-stock #js-copy_price_stock').trigger('click')
        add_toast_message('Saved to clipboard','Create Prices', 'bg-success')
    }

    function createProductBulkText(){
        var btn = $(this);
        let api_url = btn.data('url');
        let form = $('#form-stock');
        let post_data = {};
        post_data['product_id'] = form.find('#product_id').val()
        post_data['product_variant_id'] = form.find('#product_variant_id').val()
        post_data['bulk_id'] = form.find('#stock-bulk_group_select').val()
        post_data['unit_price'] = form.find('#single_unit_price').val()
        $.ajax({
            url: api_url,
            data: post_data,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                let text_to_copy = data.html_form
                $('#form-stock #string_to_copy').val(text_to_copy)
                $('#form-stock #js-copy_price_stock').trigger('click')
                add_toast_message('Saved to clipboard','Create Prices', 'bg-success')

            }
        });
    }


    function createManualPriceText(){

        let width = $('#form-quick_manual #manualWidth').val()
        let height = $('#form-quick_manual #manualHeight').val()
        let price = $('#form-quick_manual #price').val()
        let qty = $('#form-quick_manual #quantity').val()
        let material = $('#form-quick_manual #manualMaterial').val()

        text_string = width + 'mm x ' + height + 'mm - ' + material + ' @ £' + price + ' each for ' + qty + ' off'

        let footer_string = "\n\nAll prices exclude VAT at the current rate."
        $('#form-quick_manual #string_to_copy_manual').val(text_string + footer_string)
        $('#form-quick_manual #js-copy_price_manual').trigger('click')
        add_toast_message('Saved to clipboard','Create Prices', 'bg-success')
    }


    function createManualBulkText(){
        var btn = $(this);
        let api_url = btn.data('url');
        let form = $('#form-quick_manual');
        let post_data = {};
        post_data['bulk_id'] = form.find('#stock-bulk_group_select').val()
        post_data['unit_price'] = form.find('#single_unit_price').val()
        post_data['material_name'] = form.find('#manualMaterial').val()
        post_data['manual_width'] = form.find('#manualCalcWidth').val()
        post_data['manual_height'] = form.find('#manualCalcHeight').val()
        $.ajax({
            url: api_url,
            data: post_data,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                let text_to_copy = data.html_form
                $('#form-quick_manual #string_to_copy_manual').val(text_to_copy)
                $('#form-quick_manual #js-copy_price_manual').trigger('click')
                 add_toast_message('Saved to clipboard','Create Prices', 'bg-success')

            }
        });
    }

    function createProductMaterialText(){
        var btn = $(this);
        let api_url = btn.data('url');
        let form = $('#form-stock');
        let post_data = {};
        post_data['product_id'] = form.find('#product_id').val()
        post_data['product_variant_id'] = form.find('#product_variant_id').val()
        post_data['bulk_id'] = form.find('#stock-bulk_group_select').val()
        post_data['unit_price'] = form.find('#single_unit_price').val()
        post_data['qty'] = form.find('#quantity').val()
        $.ajax({
            url: api_url,
            data: post_data,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                let text_to_copy = data.html_form
                $('#form-stock #string_to_copy').val(text_to_copy)
                $('#form-stock #js-copy_price_stock').trigger('click')
                add_toast_message('Saved to clipboard','Create Prices', 'bg-success')

            }
        });
    }

    $(document).on('click', '.js-pricing-edit', loadForm);
    $(document).on('submit', '#form-store_price-edit', saveStoreComboPriceSave);
    $(document).on('submit', '#form-store_price-create', saveStoreComboPriceSave);
    $(document).on('submit', '#form-store_price-delete', saveStoreComboPriceSave);
    $(document).on('submit', '#form-prices-size-delete', deletePriceSize);
    $(document).on('submit', '#form-prices-material-delete', deletePriceMaterial);

    //specs for materials
    $(document).on("submit", "#form_material_spec", DocumentUpload);
    $(document).on("click", ".js-company_document-delete", loadForm);
    $(document).on("submit", "#form-material_spec-delete", DocumentUpload);

    //pricing bulks
    $(document).on('click', '#quick_price_product_copy', createProductPriceText);
    $(document).on('click', '#quick_price_product_copy_bulk', createProductBulkText);
    $(document).on('click', '#quick_price_product_copy_material', createProductMaterialText);

    $(document).on('click', '#quick_price_manual_copy', createManualPriceText);
    $(document).on('click', '#quick_price_manual_copy_bulk', createManualBulkText);




    /* - manual calc stuff */

    function set_copy_price(form_id) {
        let price_string = "";
        let price_str = $(form_id + ' #price').val();
        let qty_str = $(form_id + ' #quantity').val();

        price_string = " @ £" + price_str + " each for " + qty_str + " off";
        $(form_id + ' #price_to_copy').val(price_string);

    }

    function set_copy_material() {
        let width = $('#manualCalcWidth').val() ? $('#manualCalcWidth').val() : 0;
        let height = $('#manualCalcHeight').val() ? $('#manualCalcHeight').val() : 0;
        $('#form-quick_manual #text_to_copy').val(width + 'mm x ' + height + 'mm - ' + $('#form-quick_manual #manualMaterial').val());
    }

    $(document).on('change', '#form-quick_manual #line_total_cal', function () {
        set_copy_price('#form-quick_manual');
        set_copy_material();
        let final_copy_str = $('#form-quick_manual #text_to_copy').val() + $('#form-quick_manual #price_to_copy').val()
        $('#form-quick_manual #string_to_copy_manual').val(final_copy_str);
        console.log("string_to_copy_manual: " + $('#form-quick_manual #string_to_copy_manual').val());
    })


    $(document).on('focusin', '#manualCalcHeight', function () {
        $(this).data('val', $(this).val() ? $(this).val() : 0);
    });

    $(document).on('change', '#manualCalcHeight', function () {
        var prev = $(this).data('val')
        var current = $(this).val();

        var keep_aspect = $('#switchScale').is(':checked');
        if (keep_aspect) {
            let oldwidth = $('#manualCalcWidth').val()
            let aspect = oldwidth / prev;
            let newwidth = Math.round(aspect * current)
            $('#manualCalcWidth').val(newwidth)
        }
        reCalc()
    });

    $(document).on('focusin', '#manualCalcWidth', function () {
        $(this).data('val', $(this).val() ? $(this).val() : 0);
    });

    $(document).on('change', '#manualCalcWidth', function () {
        var prev = $(this).data('val')
        var current = $(this).val();

        var keep_aspect = $('#switchScale').is(':checked');
        if (keep_aspect) {
            let oldwidth = $('#manualCalcHeight').val()
            let aspect = oldwidth / prev;
            let newwidth = Math.round(aspect * current)
            $('#manualCalcHeight').val(newwidth)
        }
        reCalc()
    });

    $(document).on('change', '.calc_line_totals', function () {
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
            //$(form_id + ' #0.00').val(line_total);
            $(form_id + ' #line_total_cal').html(line_total);

            $(form_id + ' #line_total_cal').trigger('change');

            $(form_id + ' #total').val(line_total);
            $(form_id + ' #tax').val(tax_price)
        }

    });

    $(document).on('change', '.bulk_group_select', function () {
        let form_id = '#' + $(this).parents("form").attr('id')
        let hidden_group = form_id + " #bulk_discount";
        $(hidden_group).val(this.value)

        drawBulkTable(this.value, form_id)
        SetPrice(true, form_id)
    })

    $(document).on('change', '.switchApplyBulk', function () {
    let form_id = '#' + $(this).parents("form").attr('id')
    let product_price = form_id + " #price";
    $(product_price).prop('readonly', $(this).is(":checked"))
    let bl_bulk = $(this).is(":checked")
    let hidden_bulk = form_id + " #bulk_used";
    $(hidden_bulk).val(bl_bulk);
    if(bl_bulk)
    {
        SetPrice(true, form_id)
    }
    else{
        //get the sinlge unit price
        let single_price = $(form_id + ' #single_unit_price').val();
        $(product_price).val(single_price)
        SetPrice(false, form_id)
       // alert(single_price)
    }

})

    $(document).on('change', '.calc_line_totals', function () {
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
        $(form_id + ' #tax').val(tax_price)
        $(form_id + ' #single_unit_price').val(price)
    }

});



    $('#switch_exclude_discount_manual').change(function () {
        let excluded = $(this).is(":checked");
        let exclude_id_str = '#exclude_discount';
        $(exclude_id_str).val(excluded);
    });


});








function calc_totals(price, qty) {
    return (price * qty).toFixed(2);
}

function SetPrice(getbulk = true, form_id) {
    let qty_field = form_id + " #quantity";
    let product_price = form_id + " #price";
    let line_price = 0.00;
    let tax_price = 0.00;
    let single_unit_price = $(form_id + ' #single_unit_price').val();
    let base_price = $(form_id + ' #base_unit_price').val();
    let discount_price = 0.00;
    let qty = parseInt($(qty_field).val())
    let bulk_group_id = $(form_id + ' .bulk_group_select').val();

    drawBulkTable(bulk_group_id, form_id);
    $(form_id + ' #single_unit_price').val(single_unit_price)

    //Use the acutal value from the form
    let use_bulk = $(form_id + ' #switchApplyBulk').is(":checked");

    if (use_bulk) {
        let discount = getBulkPriceDiscount(bulk_group_id, qty, form_id)
        discount_price = (parseFloat(single_unit_price).toFixed(2) * discount).toFixed(2);
        line_price = parseFloat(qty * discount_price).toFixed(2);
        $(product_price).val(discount_price);

    } else {
        $(product_price).val(single_unit_price);
        line_price = (qty * $(product_price).val()).toFixed(2);


    }

    tax_price = parseFloat(line_price * tax_rate).toFixed(2);

    $(form_id + ' #total').val(parseFloat(line_price).toFixed(2));
    $(form_id + ' #tax').val(tax_price)
    $(form_id + ' #line_total_cal').html(line_price);
    $(form_id + ' #line_total_cal').trigger('change');
}


function drawBulkTable(bulk_group_id, form_id) {
    let single_price = $(form_id + ' #single_unit_price').val()
    let base_price = $(form_id + ' #base_unit_price').val()
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
            $('<th data-variant-headerid="' + index + '"></th>').text(value['qty_range_min']).appendTo(headerrow);
        } else if (index == bulk_array['breaks'].length - 1) {
            $('<th data-variant-headerid="' + index + '"></th>').text(value['qty_range_min'] + "+").appendTo(headerrow);
        } else {
            var nextbreak = bulk_array['breaks'][index + 1]['qty_range_min'] - 1;

            $('<th data-variant-headerid="' + index + '"></th>').text(value['qty_range_min'] + "-" + nextbreak).appendTo(headerrow);
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


function reCalc() {
    let width = $('#manualWidth').val() ? $('#manualWidth').val() : 0;
    let height = $('#manualHeight').val() ? $('#manualHeight').val() : 0;
    let price = $('#manualPrice').val() ? $('#manualPrice').val() : 0;

    let calc_width = $('#manualCalcWidth').val()
    let calc_height = $('#manualCalcHeight').val()


    let m2 = (width / 1000) * (height / 1000)
    let cpstperm2 = 0
    if (m2 > 0) {
        cpstperm2 = price / m2
    }

    let newprice = (calc_width / 1000) * (calc_height / 1000) * cpstperm2
    $('#form-quick_manual #single_unit_price').val(parseFloat(newprice).toFixed(2));
    $('#form-quick_manual #base_unit_price').val(parseFloat(newprice).toFixed(2));
    $('#form-quick_manual #price').val(parseFloat(newprice).toFixed(2));


    let size_name = calc_width + 'mm x ' + calc_height + 'mm - ' + $('#form-quick_manual #manualMaterial').val()
    $('#form-quick_manual #text_to_copy').val(size_name);

    if ($('#form-quick_manual #size_name').length) {
        $('#form-quick_manual #size_name').val(calc_width + 'mm x ' + calc_height + 'mm ')
    }

    if ($('#form-quick_manual #width').length) {
        $('#form-quick_manual #width').val(calc_width)
    }

    if ($('#form-quick_manual #height').length) {
        $('#form-quick_manual #height').val(calc_height)
    }

    if ($('#form-quick_manual #product_variant').length) {
        $('#form-quick_manual #product_variant').val(null)
    }

    if ($('#form-quick_manual #material_name').length) {
        $('#form-quick_manual #material_name').val($('#form-quick_manual #manualMaterial').val())
    }

    if (newprice > 0) {
        SetPrice(true, '#form-quick_manual')
    }

    console.log("text_to_copy" + $('#form-quick_manual #text_to_copy').val());

    $(document).find('.tsg_option_class_bespoke').trigger('change');

}

