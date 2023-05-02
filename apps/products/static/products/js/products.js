$(function () {

    if ($.fn.dataTable.isDataTable('#core_variants_table')) {
        var core_variants_table = $('#core_variants_table').DataTable();
    } else {
        var core_variants_table = $('#core_variants_table').DataTable({
            "processing": true,
            "pageLength": 100,
            "paging": false,
            "info": false,
            "autoWidth": false,
            "searching": false,
            "responsive": true,
            "select": 'single',
            "rowId": 'prod_variant_core_id',
            "ajax": {
                "processing": true,
                "url": "/products/api/corevariants/" + js_product_id + "?format=datatables",
            },
            columns: [
                {data: "supplier_code"},
                {
                    data: "size_material.product_size.size_name"
                },
                {
                    data: "size_material.product_material.material_name"
                },
                {
                    data: "size_material.price"
                },
                {
                    data: "variant_image_url",
                    render: function (data, type, row, meta) {
                        return '<img height="30px" class="rounded mx-auto d-block" src="' + data + '">';
                    }
                },
                {
                    data: "prod_variant_core_id",
                    sortable: false,
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {
                        let edit_icon = '<a class="btn btn-primary btn-xs js-product-edit" href="variant/'+data+'" role="button" ><i class="fas fa-edit table-button"></i></a>';
                        let delete_icon = '<a class="btn btn-danger btn-xs js-product-edit" data-url="variant/delete/'+data+'" role="button" ><i class="fas fa-trash table-button"></i></a>';
                        return edit_icon + " " + delete_icon
                    }
                },
            ]

        });

    }

    if ($.fn.dataTable.isDataTable('#product_core_variants_table')) {
        var product_core_variants_table = $('#product_core_variants_table').DataTable();
    } else {
        var product_core_variants_table = $('#product_core_variants_table').DataTable({
            "processing": true,
            "pageLength": 100,
            "paging": false,
            "info": false,
            "autoWidth": false,
            "searching": false,
            "responsive": true,
            "select": 'single',
            "rowId": 'prod_variant_core_id',
            "ajax": {
                "processing": true,
                "url": "/products/api/corevariants/" + js_product_id + "?format=datatables",
            },
            columns: [
                {data: "supplier_code"},
                {
                    data: "size_material.product_size.size_name"
                },
                {
                    data: "size_material.product_material.material_name"
                },
                {
                    data: "size_material.price"
                },
                {
                    data: "variant_image_url",
                    render: function (data, type, row, meta) {
                        return '<img height="30px" class="rounded mx-auto d-block" src="' + data + '">';
                    }
                },
                {
                    data: "bl_live",
                    render: function (data, type, row) {
                    if (data == 1) {
                        return '<span class="badge rounded-pill badge-soft-success font-size-10">LIVE</span>'
                    } else {
                        return '<span class="badge rounded-pill badge-soft-danger font-size-10">OFF-LINE</span>'
                    }

                }
                },
                {
                    data: "prod_variant_core_id",
                    sortable: false,
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {
                        let edit_icon = '<a class="btn btn-primary btn-xs js-variant-edit" data-url="corevariant/'+data+'/edit" role="button" data-dlgsize="modal-lg"><i class="fas fa-edit table-button"></i></a>';
                        let delete_icon = '<a class="btn btn-danger btn-xs js-variant-edit" data-url="variant/delete/'+data+'" role="button" ><i class="fas fa-trash table-button"></i></a>';
                        return edit_icon + " " + delete_icon
                    }
                },
            ]

        });

    }

    if ($.fn.dataTable.isDataTable('#core_variants_options')) {
        var core_variants_options = $('#core_variants_options').DataTable();
    } else {
        var core_variants_options = $('#core_variants_options').DataTable({
            "processing": true,
            "pageLength": 100,
            "paging": false,
            "info": false,
            "autoWidth": false,
            "searching": false,
            "responsive": true,
            "select": true,
            "rowId": 'id',
            "ajax": {
                "processing": true,
                "url": "/products/api/product_variant_options/-1?format=datatables",
            },
            columns: [
                {
                    data: "option_class.label"

                }
                    ,
                {
                    data: "option_value.title"
                },
                {
                    data: "order_by"
                },

            ]

        });
    }

    if ($.fn.dataTable.isDataTable('#variant_core_sizes_table')) {
        var variant_core_sizes_table = $('#variant_core_sizes_table').DataTable();
    } else {
        var variant_core_sizes_table = $('#variant_core_sizes_table').DataTable({
            "dom": "<'row'<'col-sm-6'f><'col-sm-6'T>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row'<'col-sm-6'><'col-sm-6'>>",
            "processing": true,
            "select": true,
            "search": true,
            "info": false,
            "rowId": 'size_id',
            "ajax": {
                "processing": true,
                "url": "/pricing/api/sizes?format=datatables",
            },
            columns: [
                {   data: "size_name", defaultContent: "" },
                {   data: "size_width", defaultContent: ""},
                {   data: "size_height", defaultContent: ""},
                {   data: "orientation.orientation_name", defaultContent: ""},
            ]
        });
    }

    if ($.fn.dataTable.isDataTable('#variant_core_materials_table')) {
        var variant_core_materials_table = $('#variant_core_materials_table').DataTable();
    } else {
        var variant_core_materials_table = $('#variant_core_materials_table').DataTable({
            "dom": "<'row'<'col-sm-6'f><'col-sm-6'T>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row'<'col-sm-6'><'col-sm-6'>>",
            "processing": true,
            "select": 'single',
            "search": true,
            "info": false,
            "rowId": 'id',
            "autoWidth": true,
            "order": [[1, 'asc']],
            columns: [
                {   data: "product_material.material_name", defaultContent: "" },
                {   data: "price", defaultContent: 0.00 },
            ]
        });
    }

    product_core_variants_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            let variant_url = '/products/api/product_variant_options/'+data+'?format=datatables'
            core_variants_options.ajax.url(variant_url).load()
            $('#js-variant_core_option-add').removeClass('disabled');
            $('#js-variant_core_group_option-add').removeClass('disabled');
            let btn_add_url = 'variant/'+data+'/option/add';
            $('#js-variant_core_option-add').attr('data-url', btn_add_url)
            $('#js-variant_core_group_option-add').attr('data-url', 'variant/'+data+'/group_option/add')
            // do something with the ID of the selected items
        }
    });

    product_core_variants_table.on('deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#js-variant_core_option-add').addClass('disabled')
            $('#js-variant_core_group_option-add').addClass('disabled');
        }
    });

    core_variants_options.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            let variant_url = '/products/api/product_variant_options/'+data+'?format=datatables'
            $('#dropdownVariantOptions').removeClass('disabled');
            $('#js-core_variant_edit_order').attr('data-url', 'variant/'+data+'/option/edit')
            $('#js-variant_core_option-delete').attr('data-url', 'variant/'+data+'/option/delete')
            // do something with the ID of the selected items
        }
    });

    core_variants_options.on('deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#dropdownVariantOptions').addClass('disabled')
        }
    });

    variant_core_sizes_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            let variant_url = '/pricing/api/sizematerials/'+data+'?format=datatables'
            variant_core_materials_table.ajax.url(variant_url).load()

            // do something with the ID of the selected items
        }
    });

    variant_core_sizes_table.on('deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#btn_product_core_var_add').addClass('disabled')
            let variant_url = '/pricing/api/sizematerials/'+0+'?format=datatables'
            variant_core_materials_table.ajax.url(variant_url).load()
        }
    });

    variant_core_materials_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            // do something with the ID of the selected items
            $('#id_size_material').val(data)
            $('#btn_product_core_var_add').removeClass('disabled')
        }
    });

    variant_core_materials_table.on('deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#btn_product_core_var_add').addClass('disabled')
        }
    });

    function SaveVariantOptionAdd(){
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    core_variants_options.ajax.reload();
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function updateSymbolTables()
    {
        var product_symbol_table_available = $('#product_symbol_table_available').DataTable();
        var product_symbol_table = $('#product_symbol_table').DataTable();

        product_symbol_table.ajax.reload();
        product_symbol_table_available.ajax.reload();

    }

    function AddRemoveProductSymbol() {
        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'POST',
            data: {csrfmiddlewaretoken: window.CSRF_TOKEN},
            success: function (data) {
                if (data.is_saved) {
                    updateSymbolTables()
                }
            }
        });
        return false;
    }

    function AddProductVariantCore(form){
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateProductVariantCoreTable();
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function EditProductVariantCore(){
        form = $(this)
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateProductVariantCoreTable();
                    $("#modal-base").modal("hide");
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function SaveVariantGroupAdd(){
        form = $(this)
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    core_variants_options.ajax.reload()
                    $("#modal-base").modal("hide");
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function get_group_option_text(group_class_id){
        $.ajax({
            url: "/products/group_class/" + group_class_id,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if (data.html_text) {
                    $('#group_option_values').html(data.html_text)
                }
                else {
                   $('#group_option_values').html("No values")
                }
            }
        });
        return false;
    }


    function updateProductVariantCoreTable(){
        product_core_variants_table.ajax.reload()
    }

    $(document).on("click", ".js-product-symbol-edit", AddRemoveProductSymbol);
    $(document).on("click", ".js-variant-option-edit", loadForm);
    $(document).on("click", ".js-variant-edit", loadForm);
    $(document).on("click", "#js-product_variant_core-add", loadForm);
    $(document).on("submit", "#from-core_variant_option_add", SaveVariantOptionAdd);
    $(document).on("submit", "#dlg-product_variant_core_option-delete", SaveVariantOptionAdd);
    $(document).on("submit", "#form-core_variant_edit", EditProductVariantCore);
    $(document).on("submit", "#from-core_variant_group_option_add", SaveVariantGroupAdd);
    $(document).on("change", "#js-group_option_select", function(){
         let newval = $(this).val()
         get_group_option_text(newval)
    });

    $("#form-core_variant_add").on("submit" , function (e) {
        e.preventDefault()
        AddProductVariantCore(form = $(this))
    })





})

