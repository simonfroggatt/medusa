$(function () {

     if ($.fn.dataTable.isDataTable('#product_sites_table')) {
        var product_sites_table = $('#product_sites_table').DataTable();
    } else {
         let product_id = sessionStorage.getItem("product_id");
         var product_sites_table = $('#product_sites_table').DataTable({
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
                 "url": "/products/api/productsite/" + product_id + "?format=datatables"
             },
             "deferRender": true,
             "order": [[1, "desc"]],
             "search": {
                 "regex": true
             },
             select: 'single',
             columns: [
                 {
                     data: "store.thumb",
                     sortable: false,
                     searchable: false,
                     render: function (data, type, row) {
                         let image_src = static_const + "images/stores/" + data;
                         return '<img height="15px" src="' + image_src + '">'
                     }
                 },
                 {data: "name"},
                 {data: "description"},
                 {
                     data: "status",
                     render: function (data, type, row) {
                         if (data == 1) {
                             return '<span class="badge rounded-pill badge-soft-success font-size-14">LIVE</span>'
                         } else {
                             return '<span class="badge rounded-pill badge-soft-danger font-size-14">OFF-LINE</span>'
                         }

                     }
                 },
                 {
                     data: "id",
                     sortable: false,
                     className: 'text-md-end text-start',
                     render: function (data, type, row) {
                         let edit_icon = '<a class="btn btn-primary btn-sm" href="' + data + '/storeedit"><i class="fas fa-edit fa-sm"></i></a>';
                         return edit_icon;

                     }
                 },
             ]
         });
     }



       if ($.fn.dataTable.isDataTable('#product_category_table')) {
        var product_category_table = $('#product_category_table').DataTable();
    } else {
           let product_id = sessionStorage.getItem("product_id");
           var product_category_table = $('#product_category_table').DataTable({
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
                   "url": "/products/api/categories/" + product_id + "?format=datatables"
               },
               "deferRender": true,
               "order": [[1, "desc"]],
               "search": {
                   "regex": true
               },
               select: 'single',
               columns: [
                   {
                       data: "category_store.store.thumb",
                       sortable: false,
                       searchable: false,
                       render: function (data, type, row) {
                           let image_src = static_const + "images/stores/" + data;
                           return '<img height="15px" src="' + image_src + '">'
                       }
                   },
                   {
                       data: "category_store.name",
                       render: function (data, type, row) {
                           if (data == null) {
                               return row['category_store']['category']['name']
                           } else
                               return data
                       }
                   },
                   {
                       data: "status",
                       render: function (data, type, row) {
                           if (data == 1) {
                               return '<span class="badge rounded-pill badge-soft-success font-size-14">LIVE</span>'
                           } else {
                               return '<span class="badge rounded-pill badge-soft-danger font-size-14">OFF-LINE</span>'
                           }

                       }
                   },
                   {
                       data: "id",
                       sortable: false,
                       className: 'text-md-end text-start',
                       render: function (data, type, row) {
                           let edit_icon = '<a class="btn btn-primary btn-sm js-product-dlg" role="button" data-url="' + data + '/categoryedit"><i class="fas fa-edit fa-sm"></i></a>';
                           let delete_icon = '<a  class="btn btn-danger btn-sm js-product-dlg" role="button" data-url="' + data + '/categorydeletedlg"><i class="fas fa-trash fa-sm"></i></a>';
                           return edit_icon + " " + delete_icon;

                       }
                   },
               ]
           });
       }



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
                "url": "/products/api/product_core_variant_options/-1?format=datatables",
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

    if ($.fn.dataTable.isDataTable('#site_variants_options')) {
        var site_variants_options = $('#site_variants_options').DataTable();
    } else {
        var site_variants_options = $('#site_variants_options').DataTable({
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
                "url": "/products/api/product_site_variant_options/-1?format=datatables",
            },
            columns: [
                {
                    data: "product_var_core_option.option_class.label"

                }
                    ,
                {
                    data: "product_var_core_option.option_value.title"
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

    if ($.fn.dataTable.isDataTable('#product_variants_site_table')) {
        var product_variants_site_table = $('#product_variants_site_table').DataTable();
    } else {
        var product_variants_site_table = $('#product_variants_site_table').DataTable({
            "processing": true,
            "pageLength": 100,
            "paging": false,
            "info": false,
            "autoWidth": false,
            "searching": false,
            "responsive": true,
            "select": 'single',
            "rowId": 'prod_variant_id',
            "ajax": {
                "processing": true,
                "url": "/products/api/storevariants/" + js_product_id + "/0?format=datatables",
            },
            columns: [
                {data: "store.thumb",
                    render: function ( data, type, row ) {
                    let image_src =  static_const + 'images/stores/' + data;
                    return '<img height="15px" src="' + image_src + '">'
                 }},
                {
                    data: "variant_code", defaultContent: ""},
                {
                    data: "prod_var_core.size_material.product_size.size_name", defaultContent: ""
                },
                {
                    data: "prod_var_core.size_material.product_material.material_name" , defaultContent: ""
                },
                {
                    data: "variant_overide_price",
                    render: function (data, type, row, meta) {
                        if (data > 0) {
                            return '<span class="text-danger">'+data+'</span>'
                        }
                        else {
                            return  row['prod_var_core']['size_material']['price'];
                        }
                    }
                },
                {
                    data: "alt_image", defaultContent: "no-image.png",
                    render: function (data, type, row, meta) {
                        if (data == null)
                        {
                            let base_image = row['prod_var_core']['variant_image']
                            if(base_image == null)
                            {
                                var base_image_url = row['prod_var_core']['product']['image']
                            }
                            else {
                                var base_image_url = base_image
                            }
                            return '<img height="30px" class="rounded mx-auto d-block" src="'+media_url + base_image_url + '">';
                        }
                        else{
                            return '<img height="30px" class="rounded mx-auto d-block" src="'+media_url + data + '">';
                        }

                    }
                },
                {
                    data: "prod_variant_id",
                    sortable: false,
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {
                        let edit_icon = '<a class="btn btn-primary btn-xs js-variant-edit" data-url="sitevariant/'+data+'/edit" role="button" data-dlgsize="modal-lg"><i class="fas fa-edit table-button"></i></a>';
                        let delete_icon = '<a class="btn btn-danger btn-xs js-variant-edit" data-url="variant/delete/'+data+'" role="button" ><i class="fas fa-trash table-button"></i></a>';
                        return edit_icon;//+ " " + delete_icon
                    }
                },
            ]

        });

    }

     if ($.fn.dataTable.isDataTable('#product_related_table')) {
        var product_related_table = $('#product_related_table').DataTable();
    } else {
        var product_related_table = $('#product_related_table').DataTable({
            "dom": "<'row'<'col-sm-6'f><'col-sm-6'T>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row'<'col-sm-6'><'col-sm-6'>>",
            "processing": true,
            "select": 'single',
            "search": true,
            "info": false,
            "rowId": 'id',
            "autoWidth": false,
            "order": [[0, 'asc'], [3,'asc']],
            "ajax": {
                "processing": true,
                "url": "/products/api/related/" + js_product_id + "?format=datatables",
            },
            columns: [
                {data: "product_related_store.store__thumb",
                    render: function ( data, type, row ) {
                    let image_src =  static_const + 'images/stores/' + data;
                    return '<img height="15px" src="' + image_src + '">'
                 }},

                {   data: "product_desc.product__image",
                    render: function ( data, type, row ) {
                    let image_src =  media_url + data;
                    return '<img height="50px" src="' + image_src + '">';
                 },
                 defaultContent: "" },

                {   data: "product_desc.product__productdescbase__name", defaultContent: "" },

                {   data: "order", defaultContent: 0 },

                {
                    data: "id",
                    sortable: false,
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {
                         let edit_icon = '<a class="btn btn-primary btn-xs js-variant-edit" data-url="related/'+data+'/edit" role="button" data-dlgsize="modal-lg"><i class="fas fa-edit table-button"></i></a>';
                           let delete_icon = '<a class="btn btn-danger btn-xs js-variant-edit" data-url="related/'+data+'/delete" role="button" data-dlgsize="modal-sm" ><i class="fas fa-trash table-button"></i></a>';
                        return edit_icon+ " " + delete_icon
                    }
                }
            ]
        });
    }

     if ($.fn.dataTable.isDataTable('#product_symbol_table')) {
        var product_symbol_table = $('#product_symbol_table').DataTable();
    } else {
        let product_id = sessionStorage.getItem("product_id");
        var product_symbol_table = $('#product_symbol_table').DataTable({
            "dom": "<'row'<'col-6'fl><'col-6'p>>" +
                "<'row'<'col-12'tr>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
            "serverSide": false,
            "select": 'single',
            "scroller": true,
            scrollY: 400,
            "rowId": 'product_id',
            "ajax": {
                "processing": true,
                "url": "/products/api/productsymbols/"+product_id+"?format=datatables",
                "type": "GET",
            },
            "deferRender": false,

            "search": {
                "regex": true
            },
            columns: [
                {data: "symbol.image_path", defaultContent: "no-image.png",
                    render: function ( data, type, row ) {
                    if(data == null ){
                        img_path = media_url + "no-image.png"
                    }
                    else{
                        img_path = media_url + data
                    }
                     return '<img class="rounded mx-auto d-block product-thumb" src="'+img_path+'" height="50px">';
                    },
                },
                {data: "symbol.referent"},
                {
                    data: "symbol.id",
                    render: function (data, type, row) {
                        let remove_icon = '<a class="btn btn-warning btn-sm js-product-symbol-edit" role="button" data-url="api/product/' + product_id +'/deleteproductsymbol/' + data + '"><i class="fa-solid fa-minus"></i></a>';
                        return remove_icon
                    },
                }

            ]
        });
    }

     if ($.fn.dataTable.isDataTable('#product_symbol_table_available')) {
        var product_symbol_table_available = $('#product_symbol_table_available').DataTable();
    } else {
         let product_id = sessionStorage.getItem("product_id");
        var product_symbol_table_available = $('#product_symbol_table_available').DataTable({
            "dom": "<'row'<'col-6'fl><'col-6'p>>" +
                "<'row'<'col-12'tr>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
            "serverSide": false,
            "select": 'single',
            "scroller": true,
            scrollY: 400,
            "rowId": 'id',
            "ajax": {
                "processing": true,
                "url": "/products/api/productsymbols-available/"+product_id+"?format=datatables",
                "type": "GET",
            },
            "deferRender": false,

            "search": {
                "regex": true
            },
            columns: [
                    {data: "id",
                    render: function ( data, type, row ) {
                        let add_icon = '<a class="btn btn-success btn-sm js-product-symbol-edit" role="button" data-url="api/product/' + product_id + '/addproductsymbol/' + row['id'] + '"><i class="fa-solid fa-plus"></i></a>';
                        return add_icon
                    },
                    },
                {data: "image_path", defaultContent: "no-image.png",
                    render: function ( data, type, row ) {
                    if(data == null ){
                        img_path = media_url + "no-image.png"
                    }
                    else{
                        img_path = media_url + data
                    }

                     return '<img class="rounded mx-auto d-block product-thumb" src="'+img_path+'" height="50px">';
                    },
                },
                {data: "referent"},


            ]
        });
    }

    product_core_variants_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            let variant_url = '/products/api/product_core_variant_options/'+data+'?format=datatables'
            core_variants_options.ajax.url(variant_url).load()
            $('#js-variant_core_option-add').removeClass('disabled');
            $('#js-variant_core_group_option-add').removeClass('disabled');
            let btn_add_url = 'variant/'+data+'/option/add';
            $('#js-variant_core_option-add').attr('data-url', btn_add_url)
            $('#js-variant_core_group_option-add').attr('data-url', 'variant/'+data+'/group_option/add')
            // do something with the ID of the selected items
        }
    });

    product_variants_site_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            let variant_url = '/products/api/product_site_variant_options/'+data+'?format=datatables'
            site_variants_options.ajax.url(variant_url).load()
            $('#js-product-site-variant_option-add').removeClass('disabled');

            let btn_add_url = 'sitevariant/'+data+'/option/add';
            $('#js-product-site-variant_option-add').attr('data-url', btn_add_url)
           // $('#js-variant_core_group_option-add').attr('data-url', 'variant/'+data+'/group_option/add')
            // do something with the ID of the selected items
        }
    });

    product_core_variants_table.on('deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#js-variant_core_option-add').addClass('disabled')
            $('#js-variant_core_group_option-add').addClass('disabled');
            $('#dropdownVariantOptions').addClass('disabled')
        }
    });

    product_variants_site_table.on('deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#js-product-site-variant_option-add').addClass('disabled')
            $('#dropdownSiteVariantOptions').addClass('disabled')
            //$('#js-variant_core_group_option-add').addClass('disabled');
        }
    });

    core_variants_options.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
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

    site_variants_options.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            $('#dropdownSiteVariantOptions').removeClass('disabled');
            $('#js-site_variant_edit_order').attr('data-url', 'sitevariant/'+data+'/option/edit')
            $('#js-site_variant_option-delete').attr('data-url', 'sitevariant/'+data+'/option/delete')
            // do something with the ID of the selected items
        }
    });

    site_variants_options.on('deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#dropdownSiteVariantOptions').addClass('disabled')
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

    function AddProductVariantSite(form){
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateProductVariantSiteTable();
                    $("#modal-base").modal("hide");
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function get_product_stores(product_id){
        $.ajax({
            url: "/products/api/variantstore/" + product_id,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if (data.html_text) {
                    $('#tab-site-variants_contents').html(data.html_text)
                    product_variants_site_table.ajax.reload()
                }
                else {
                   $('#tab-site-variants_contents').html("No values")
                }
            }
        });
        return false;
    }


    function SaveSiteOption(){
        form = $(this)
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    updateSiteVariantOptionTable();
                    $("#modal-base").modal("hide");
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function RelatedProductUpdate(){
        form = $(this)
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    product_related_table.ajax.reload();
                    $("#modal-base").modal("hide");
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    function updateSiteVariantOptionTable(){
        site_variants_options.ajax.reload()
    }

    function updateProductVariantCoreTable(){
        product_core_variants_table.ajax.reload()
    }

    function updateProductVariantSiteTable(){
        product_variants_site_table.ajax.reload()
    }

     $(document).on('click', '.js-product-dlg', loadForm);
    $(document).on("click", ".js-product-symbol-edit", AddRemoveProductSymbol);
    $(document).on("click", ".js-variant-option-edit", loadForm);
    $(document).on("click", ".js-variant-edit", loadForm);
    $(document).on("click", "#js-product_variant_core-add", loadForm);
    $(document).on("click", "#js-product_variant_site-add", loadForm);
    $(document).on("submit", "#from-core_variant_option_add", SaveVariantOptionAdd);
    $(document).on("submit", "#dlg-product_variant_core_option-delete", SaveVariantOptionAdd);
    $(document).on("submit", "#form-core_variant_edit", EditProductVariantCore);
    $(document).on("submit", "#from-core_variant_group_option_add", SaveVariantGroupAdd);
    $(document).on("submit", "#from-site_variant_option_edit", SaveSiteOption);
    $(document).on("submit", "#form-core_variant_option_edit", SaveVariantOptionAdd);
    $(document).on("submit", "#form-site_variant_edit", AddProductVariantSite);
    $(document).on("submit", "#dlg-related_product-delete", RelatedProductUpdate);
    $(document).on("change", "#js-group_option_select", function(){
         let newval = $(this).val()
         get_group_option_text(newval)
    });

    $("#form-core_variant_add").on("submit" , function (e) {
        e.preventDefault()
        AddProductVariantCore(form = $(this))
    })

    $("#form-site_variant_add").on("submit" , function (e) {
        e.preventDefault()
        AddProductVariantSite(form = $(this))
    })

    $("#form-site_variant_edit").on("submit" , function (e) {
        e.preventDefault()
        AddProductVariantSite(form = $(this))
    })


    $('#js-variant-store_id').on('change', function() {
        let newval = $(this).val()
        let ajax_url = "/products/api/storevariants/" + js_product_id + "/"+newval+"?format=datatables";
        product_variants_site_table.ajax.url(ajax_url).load();
    });


    /*$('#site-variants-tab').on("click", function(){
        get_product_stores(1)
    })*/


    /***
 * code for product variants
 */

    /*  when we add a new variant */
   $('#product_variant_table_available').on('click', '.js-variant_site-add', function(){

        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'POST',
            data: {csrfmiddlewaretoken: window.CSRF_TOKEN},
            success: function (data) {
                if (data.is_saved) {
                    updateSiteVariantTables()
                }
            }
        });
        return false;

    });

    /*  when we remove an active variant */
   $('#product_variant_active_table').on('click', '.js-variant_site-delete', function(){

        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'POST',
            data: {csrfmiddlewaretoken: window.CSRF_TOKEN},
            success: function (data) {
                if (data.is_saved) {
                    updateSiteVariantTables()
                }
            }
        });
        return false;

    });

    /*  update the 2 table to show the changes */
    function updateSiteVariantTables(){
        let dtAvailable = $('#product_variant_table_available').DataTable();
        dtAvailable.ajax.reload();

        let dtActive = $('#product_variant_active_table').DataTable();
        dtActive.ajax.reload()
    }

    /* we have closed the dialogue box for the variants - so update the variant table */



})





