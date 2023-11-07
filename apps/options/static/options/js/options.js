 if (current_group_id === undefined || current_group_id === null) {
        var current_group_id = 0
    }

$(function () {

    if ( $.fn.dataTable.isDataTable( '#value_product_table' ) ) {
                var value_product_table = $('#value_product_table').DataTable();
            }
            else {
                var value_product_table = $('#value_product_table').DataTable({
                    "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6'i><'col-sm-6'p>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
              "select": 'single',
                    "lengthChange": false,
                    "info": false,
                    "scroller": true,
                    scrollY: 300,
            "serverSide": true,
            "rowId": 'product_id',
                    "ajax": {
                        "processing": true,
                        "url": "/products/api/post-list/products/?format=datatables",
                        "type": "POST",
                        "beforeSend": function (xhr) {
                            xhr.setRequestHeader("X-CSRFToken", "{{ csrf_token|escapejs }}");
                        }
                    },
                    "deferRender": false,

                    "search": {
                        "regex": true
                    },
                    columns: [

                        {
                            data: "image_url",
                            name: "thumbnail",
                            searchable: "false",
                            sortable: "false",
                            render: function (data, type, row, meta) {
                                return '<img height="30px" class="rounded mx-auto d-block" src="' + data + '">';
                            }
                        },
                        {data: "model"},
                        {
                            data: "productdescbase.name",
                            defaultContent: ""
                        },
                        {
                            data: "productdescbase.title",
                            defaultContent: "",
                            "visible": false
                        },
                        {
                            data: "productdescbase.description",
                            defaultContent: "",
                            "visible": false
                        },
                        {
                            data: "product_id",
                            "visible": false
                        },
                        {
                            data: "corevariants",
                            name: "corevariants.supplier_code",
                            "visible": false
                        }
                    ]
                });
            };

    if ( $.fn.dataTable.isDataTable( '#value_product_table_for_variant' ) ) {
                var value_product_table_for_variant = $('#value_product_table_for_variant').DataTable();
            }
            else {
                var value_product_table_for_variant = $('#value_product_table_for_variant').DataTable({
                    "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6'i><'col-sm-6'p>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
              "select": 'single',
                    "lengthChange": false,
                    "info": false,
                    "scroller": true,
                    scrollY: 300,
            "serverSide": true,
            "rowId": 'product_id',
                    "ajax": {
                        "processing": true,
                        "url": "/products/api/post-list/products/?format=datatables",
                        "type": "POST",
                        "beforeSend": function (xhr) {
                            xhr.setRequestHeader("X-CSRFToken", "{{ csrf_token|escapejs }}");
                        }
                    },
                    "deferRender": false,

                    "search": {
                        "regex": true
                    },
                    columns: [

                        {
                            data: "image_url",
                            name: "thumbnail",
                            searchable: "false",
                            sortable: "false",
                            render: function (data, type, row, meta) {
                                return '<img height="30px" class="rounded mx-auto d-block" src="' + data + '">';
                            }
                        },
                        {data: "model"},
                        {
                            data: "productdescbase.name",
                            defaultContent: ""
                        },
                        {
                            data: "productdescbase.title",
                            defaultContent: "",
                            "visible": false
                        },
                        {
                            data: "productdescbase.description",
                            defaultContent: "",
                            "visible": false
                        },
                        {
                            data: "product_id",
                            "visible": false
                        },
                        {
                            data: "corevariants",
                            name: "corevariants.supplier_code",
                            "visible": false
                        }
                    ]
                });
            };

    if ( $.fn.dataTable.isDataTable( '#value_product_variants_table' ) ) {
                var value_product_variants_table = $('#value_product_variants_table').DataTable();
            }
            else {
        var value_product_variants_table = $('#value_product_variants_table').DataTable({
            "processing": true,
            "pageLength": 100,
            "paging": true,
            "info": false,
            "autoWidth": false,
            "searching": false,
            "responsive": true,
            "select": 'single',
            "deferRender": false,
            "scroller": true,
            scrollY: 200,
            "rowId": 'prod_variant_core_id',
            "ajax": {
                "processing": true,
                "url": "/products/api/corevariants/" + 1 + "?format=datatables",
            },
            columns: [
                {data: "supplier_code"},
                {
                    data: "size_material.product_size.size_name"
                },
                {
                    data: "size_material.product_material.material_name"
                },
            ]

        })
    };


     if ( $.fn.dataTable.isDataTable( '#group_values_table' ) ) {
                var group_values_table = $('#group_values_table').DataTable();
     }
     else {
                var group_values_table = $('#group_values_table').DataTable({
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
                    "url": "/options/api/group_values/"+current_group_id+"?format=datatables"
                },
                "deferRender": false,
                "search": {
                    "regex": true
                },
                "order": [[0, "asc"], [2, "asc"]],
                columns: [
                    {
                        data: "class_field.name",
                        render: function (data, type, row) {
                            return row['class_field']['label'] + " - " + data
                        }
                    },
                    {data: "value.title"},
                    {data: "order_id"},
                    {
                        data: "id",
                        sortable: false,
                        className: 'text-md-end text-start',
                        render: function (data, type, row) {
                            let edit_icon = '<a class="btn btn-primary btn-sm" id="js-group_value-edit" data-url="value/edit/' + data + '" role="button" ><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                            let delete_icon = '<a class="btn btn-danger btn-sm" id="js-group_value-edit" data-url="value/delete/' + data + '" role="button" ><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>';
                            return edit_icon + " " + delete_icon
                        }
                    },
                    ]
                });
            };

    value_product_table_for_variant.on('select', function (e, dt, type, indexes) {
                if (type === 'row') {
                    let product_id = value_product_table_for_variant.row(indexes).id()
                    set_variant_url(product_id)
                    set_product_details(value_product_table_for_variant.row(indexes).data())
                }
            });

    function set_variant_url(product_id) {
                let ajax_url = "/products/api/corevariants/" + product_id + "?format=datatables"
                value_product_variants_table.ajax.url(ajax_url).load();
            };

    function set_product_details(data_row) {

               // $('#form-stock #{{ form.product_id.name }}').val(data_row['product_id'])
               // $('#form-stock #{{ form.name.name }}').val(data_row['productdescbase']['name'])
               //  manual_data['name'] = data_row['productdescbase']['name']
            }

    $('#id_option_type').change(function () {
        changedto = $(this).val()

        price_desc_text = getTypeDesc(changedto)
         $('#price_mod_helper').html(price_desc_text)

        bl_show_button = getTypeIsProduct(changedto)
        if(bl_show_button == "true") {
            $('#js-show_product_button').show()
        }else {
            $('#js-show_product_button').hide()
        }

    })

    function getTypeDesc(type_id){
        type_price_desc = "";
         $.each(typeinfo_data, function(key, value) {
            if(value.option_type_id == parseInt(type_id)) {
                type_price_desc = value.price_modifier_description
                return false; // breaks
            }
        });
         return type_price_desc
    };

    function getTypeIsProduct(type_id){
        bl_rtn = false
         $.each(typeinfo_data, function(key, value) {
            if(value.option_type_id == parseInt(type_id)) {
                bl_rtn = (value.extra_product || value.extra_variant)
                return bl_rtn; // breaks
            }
        });
         return bl_rtn
    };

    $(function () {
        $('#id_option_type').trigger('change')
    })

    function SaveProduct(){
        var form = $(this);
        var tmp = form.attr("action");
        var data2 = form.serialize();
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#value_product_details").html(data.html_form);
                    $("#id_product_id").val(data.product_id);
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function SaveProductVariant(){
        var form = $(this);
        var tmp = form.attr("action");
        var data2 = form.serialize();
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#value_product_details_variant").html(data.html_form);
                    $("#id_product_id").val(data.product_id);
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    };

    function SaveGroupValue(){
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    group_values_table.ajax.reload();
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }


     $(document).on('click', '#js-value-product', loadForm);
     $(document).on('click', '#js-group_value-edit', loadForm);
     $(document).on('click', '#js-group-value-add', loadForm);
     $(document).on('click', '.js-options-edit', loadForm);
     $(document).on('submit', '#form-option_value_product', SaveProduct);
     $(document).on('submit', '#form-option_value_product_variant', SaveProductVariant);
     $(document).on('submit', '#js-group_value_create-submit', SaveGroupValue);
     $(document).on('submit', '#form-group_edit-submit', SaveGroupValue);



    value_product_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let product_id = value_product_table.row(indexes).id();
            $('#form-option_value_product #product_id').val(product_id)
            $('#form-option_value_product #value_product-submit').prop('disabled', false)
        }
    });

    value_product_table.on( 'deselect', function ( e, dt, type, indexes ) {
        if (type === 'row') {
            $('#form-option_value_product #value_product-submit').prop('disabled', true)
        }
    });

    value_product_variants_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let product_id = value_product_variants_table.row(indexes).id();
            $('#form-option_value_product_variant #product_id').val(product_id)
            $('#form-option_value_product_variant #value_product-submit').prop('disabled', false)
        }
    });

    value_product_variants_table.on( 'deselect', function ( e, dt, type, indexes ) {
        if (type === 'row') {
            $('#form-option_value_product_variant #value_product-submit').prop('disabled', true)
        }
    });

})