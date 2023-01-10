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
            $(form_id + ' #0.00').val(line_total);
            $(form_id + ' #line_total_cal').html(line_total);
            $(form_id + ' #line_total_cal').trigger('change');
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
        $(form_id + ' #line_total_cal').trigger('change');
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