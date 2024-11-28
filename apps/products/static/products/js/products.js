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
                     data: "image_url",
                     sortable: false,
                     searchable: false,
                     render: function (data, type, row, meta) {
                        return '<img height="30px" class="rounded mx-auto d-block" src="' + data + '">';
                    }
                 },

                 {data: "name"},
                 {data: "description"},
                 {data: "bulk_group.group_name"},
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
                         let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row" href="' + data + '/storeedit"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
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
               columns: [
                   {
                       data: "category_store.store.thumb",
                       sortable: false,
                       searchable: false,
                       render: function (data, type, row) {
                           let image_src = media_url + "stores/branding/logos/" + data;
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
                           let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-product-dlg" role="button" data-url="' + data + '/categoryedit"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                           let delete_icon = '<a  class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row js-product-dlg" role="button" data-url="' + data + '/categorydelete"><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>';
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
                        let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-product-edit" href="variant/'+data+'" role="button" ><i class="'+ icons_context['ICON_EDIT'] +' table-button"></i></a>';
                        let delete_icon = '<a class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row js-product-edit" data-url="variant/delete/'+data+'" role="button" ><i class="'+ icons_context['ICON_DELETE'] +' table-button"></i></a>';
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
            "autoWidth": true,
            "searching": false,
            "responsive": true,
            "select": 'single',
            "rowId": 'prod_variant_core_id',
            "ajax": {
                "processing": true,
                "url": "/products/api/corevariants/" + js_product_id + "?format=datatables",
            },
            columns: [
                {
                    data: "variant_image_url",
                    render: function (data, type, row, meta) {
                        return '<img height="30px" class="rounded mx-auto d-block" src="' + data + '">';
                    }
                },
                {data: "supplier_code"},
                {
                    data: "size_material.product_size.size_name"
                },
                {
                    data: "size_material.product_material.material_name"
                },

                {
                    data: "pack_count"
                },

                {
                    data: "size_material.price"
                },
                {
                    data: "supplier_price"
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
                        let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-variant-edit" data-url="corevariant/'+data+'/edit" role="button" data-dlgsize="modal-lg"><i class="'+ icons_context['ICON_EDIT'] +' table-button"></i></a>';
                        let delete_icon = '<a class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row js-variant-edit" data-url="corevariant/'+data+'/delete" role="button" ><i class="'+ icons_context['ICON_DELETE'] +' table-button"></i></a>';
                        return delete_icon + " " + edit_icon
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
                    data: "id"
                },
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
                    let image_src = media_url + "stores/branding/logos/" + data;
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
                            if(row['store_size_material_price'] > 0)
                                return '<span class="text-warning">'+row['store_size_material_price']+'</span>';
                            else
                                return  row['prod_var_core']['size_material']['price'];
                        }
                    }
                },
                {
                    data: "site_variant_image_url", defaultContent: "no-image.png",
                    render: function (data, type, row, meta) {
                        return '<img height="30px" class="rounded mx-auto d-block" src="' + data + '">';
                    },
                },
                {
                    data: "prod_variant_id",
                    sortable: false,
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {
                        let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-variant-edit" data-url="sitevariant/'+data+'/edit" role="button" data-dlgsize="modal-lg"><i class="'+ icons_context['ICON_EDIT'] +' table-button"></i></a>';
                        let delete_icon = '<a class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row js-variant-edit" data-url="variant/delete/'+data+'" role="button" ><i class="'+ icons_context['ICON_DELETE'] +' table-button"></i></a>';
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
            "search": true,
            "info": false,
            "rowId": 'id',
            "autoWidth": false,
            "order": [[0, 'asc'], [3,'asc']],
            "ajax": {
                "processing": true,
                "url": "/products/related/" + js_product_id + "/store/0?format=datatables",
            },
            columns: [
                {data: "product_related_store.store__thumb",
                    render: function ( data, type, row ) {
                    let image_src =  media_url + 'stores/branding/logos/' + data;
                    return '<img height="15px" src="' + image_src + '">'
                 }},

                {   data: "product_desc.product__image",
                    render: function ( data, type, row ) {
                    let image_src =  media_url +data;
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
                         let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-variant-edit" data-url="related/'+data+'/edit" role="button" data-dlgsize="modal-lg"><i class="'+ icons_context['ICON_EDIT'] +' table-button"></i></a>';
                           let delete_icon = '<a class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row js-variant-edit" data-url="related/'+data+'/delete" role="button" data-dlgsize="modal-sm" ><i class="'+ icons_context['ICON_DELETE'] +' table-button"></i></a>';
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
                {data: "symbol.svg_path", defaultContent: "no-image.png",
                    render: function ( data, type, row ) {
                    if(data == null ){
                        img_path = media_url + "no-image.png"
                    }
                    else{
                        img_path = data
                    }
                     return '<img class="rounded mx-auto d-block product-thumb" src="'+img_path+'" height="50px">';
                    },
                },
                {data: "symbol.refenceno"},
                {data: "symbol.referent"},
                {
                    data: "symbol.id",
                    render: function (data, type, row) {
                        let remove_icon = '<a class="btn btn-warning btn-tsg-row js-product-symbol-edit" role="button" data-url="api/product/' + product_id +'/deleteproductsymbol/' + data + '"><i class="fa-solid fa-minus"></i></a>';
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
                        let add_icon = '<a class="btn btn-success btn-tsg-row js-product-symbol-edit" role="button" data-url="api/product/' + product_id + '/addproductsymbol/' + row['id'] + '"><i class="fa-solid fa-plus"></i></a>';
                        return add_icon
                    },
                    },
                {data: "svg_path", defaultContent: "no-image.png",
                    render: function ( data, type, row ) {
                    if(data == null ){
                        img_path = media_url + "no-image.png"
                    }
                    else{
                        img_path =  data
                    }

                     return '<img class="rounded mx-auto d-block product-thumb" src="'+img_path+'" height="50px">';
                    },
                },
                {data: "refenceno"},
                {data: "referent"},


            ]
        });
    }

      if ($.fn.dataTable.isDataTable('#product_options_current')) {
        var product_options_current = $('#product_options_active_table').DataTable();
    } else {
        let product_id = sessionStorage.getItem("product_id");
        var product_options_current = $('#product_options_current').DataTable({
            "dom": "<'row'<'col-6'fl><'col-6'p>>" +
                "<'row'<'col-12'tr>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
            "serverSide": false,
            "scroller": true,
            scrollY: 400,
            "rowId": 'id',
            "select": 'single',
            "ajax": {
                "processing": true,
                "url": "/products/api/productoptions/"+product_id+"?format=datatables",
                "type": "GET",
            },
            "deferRender": true,

            "search": {
                "regex": true
            },
            "order": [[2, "asc"]],
            columns: [
                {data: "label"},
                {data: "option_type.name"},
                {data: "sort_order"},
                {
                    data: "required",
                    render: function (data, type, row) {
                    if (data) {
                        return '<span class="badge rounded-pill badge-soft-danger font-size-10">REQUIRED</span>'
                    } else {
                        return '<span class="badge rounded-pill badge-soft-success font-size-10">OPTIONAL</span>'
                    }

                    }
                },
                {
                    data: "id",
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {
                        let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-product-option-edit-btn" data-url="api/product/'+product_id+'/productoption/edit/'+data+'" role="button" data-dlgsize="modal-sm"><i class="'+ icons_context['ICON_EDIT'] +' table-button"></i></a>';
                        let remove_icon = '<a class="btn btn-warning btn-tsg-row js-product-option-edit-btn" role="button" data-url="api/product/'+product_id+'/productoption/'+data+'/delete/"><i class="fa-solid fa-minus"></i></a>';
                        return edit_icon + ' ' + remove_icon
                    },
                     sortable: false,
                     searchable: false,
                },
            ]
        });
    }



      if ($.fn.dataTable.isDataTable('#product_options_active_table')) {
        var product_options_active_table = $('#product_options_active_table').DataTable();
    } else {
        let product_id = sessionStorage.getItem("product_id");
        let product_option_id = 2
        var product_options_active_table = $('#product_options_active_table').DataTable({
            "dom": "<'row'<'col-6'fl><'col-6'p>>" +
                "<'row'<'col-12'tr>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
            "serverSide": false,
            "scroller": true,
            scrollY: 400,
            "rowId": 'id',
            "ajax": {
                "processing": true,
                "url": "/products/api/productoptions-active/"+0+"?format=datatables",
                "type": "GET",
            },
            "deferRender": true,

            "search": {
                "regex": true
            },
            "order": [[1, "asc"]],
            columns: [
                {data: "option_value.name"},
                {data: "sort_order"},
                {
                    data: "id",
                    className: 'text-md-end text-start',
                    render: function (data, type, row) {
                        let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-product-option-edit-btn" data-url="api/product/'+product_id+'/productoption/edit/sortorder/'+data+'" role="button" data-dlgsize="modal-sm"><i class="'+ icons_context['ICON_EDIT'] +' table-button"></i></a>';
                        let remove_icon = '<a class="btn btn-warning btn-tsg-row js-product-option-btn" role="button" data-url="api/product/'+product_id+'/productoption/delete/'+data+'"><i class="fa-solid fa-minus"></i></a>';
                        return edit_icon + '&nbsp;' +remove_icon
                    },
                     sortable: false,
                     searchable: false,
                },

            ]
        });
    }

       if ($.fn.dataTable.isDataTable('#product_options_available_table')) {
        var product_options_available_table = $('#product_options_active_table').DataTable();
    } else {
        let product_id = sessionStorage.getItem("product_id");
        var product_options_available_table = $('#product_options_available_table').DataTable({
            "dom": "<'row'<'col-6'fl><'col-6'p>>" +
                "<'row'<'col-12'tr>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
            "serverSide": false,
            "scroller": true,
            scrollY: 400,
            "rowId": 'option_value_id',
            "ajax": {
                "processing": true,
                "url": "/products/api/productoptions-available/"+0+"?format=datatables",
                "type": "GET",
            },
            "deferRender": true,

            "search": {
                "regex": true
            },
            columns: [
                {
                    data: "id",
                    render: function (data, type, row) {
                        let remove_icon = '<a class="btn btn-success btn-tsg-row js-product-option-btn" role="button" data-url="api/product/'+product_id+'/productoption/'+row['option_value_id']+'/add/'+data+'"><i class="fa-solid fa-plus"></i></a>';
                        return remove_icon
                    },
                     sortable: false,
                     searchable: false,
                },
                {data: "name"},
                {
                    data: 'option_value_id',
                    sortable: false,
                    visible: false
                }
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
            $('#js-variant_core_class_option-add').removeClass('disabled');

            let btn_add_url = 'variant/'+data+'/option/add';
            $('#js-variant_core_option-add').attr('data-url', btn_add_url)

            $('#js-variant_core_group_option-add').attr('data-url', 'variant/'+data+'/group_option/add')


            $('#js-variant_core_class_option-add').attr('data-url', 'variant/'+data+'/class_option/add')
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
            $('#js-variant_core_class_option-add').addClass('disabled');
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


    product_options_current.on('select', function (e, dt, type, indexes) {
         if (type === 'row') {
            let data = dt.row(indexes).id();
            let variant_url = "/products/api/productoptions-active/"+data+"?format=datatables";
            product_options_active_table.ajax.url(variant_url).load();
            let variant_url_available = "/products/api/productoptions-available/"+data+"?format=datatables";
            product_options_available_table.ajax.url(variant_url_available).load();
         }
    });

    product_options_current.on('deselect', function (e, dt, type, indexes) {

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
         form = $(this)
        $.ajax({
            url: form.attr("action"),
            data: new FormData( this ),
            type: form.attr("method"),
            //dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
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
            data: new FormData( this ),
            type: form.attr("method"),
            //dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,

            /*url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',*/
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

    function get_class_option_text(group_class_id){
        $.ajax({
            url: "/products/class_values/" + group_class_id,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if (data.html_text) {
                    $('#class_option_values').html(data.html_text)
                }
                else {
                   $('#class_option_values').html("No values")
                }
            }
        });
        return false;
    }

    function AddProductVariantSite(){
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: new FormData( this ),
            type: form.attr("method"),
            //dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
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

    function AddAdditionalProductImage(){
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: new FormData( this ),
            type: form.attr("method"),
            //dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.upload) {
                    $("#js-image-store_id").trigger('change');
                } else {
                    alert('error uploading')
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

    $(document).on("submit", "#form-core_variant_option_add", SaveVariantOptionAdd);
    $(document).on("submit", "#dlg-product_variant_core_option-delete", SaveVariantOptionAdd);
    $(document).on("submit", "#form-core_variant_edit", EditProductVariantCore);
    $(document).on("submit", "#form-core_variant_group_option_add", SaveVariantGroupAdd);
    $(document).on("submit", "#form-core_variant_class_option_add", SaveVariantGroupAdd);
    $(document).on("submit", "#from-site_variant_option_edit", SaveSiteOption);
    $(document).on("submit", "#form-core_variant_option_edit", SaveVariantOptionAdd);
    $(document).on("submit", "#form-site_variant_edit", AddProductVariantSite);
    $(document).on("submit", "#form-site_variant_add", AddProductVariantSite);

    $(document).on("submit", "#form-core_variant_add", AddProductVariantCore);
    $(document).on("change", "#js-group_option_select", function(){
         let newval = $(this).val()
         get_group_option_text(newval)
    });
    $(document).on("change", "#js-class_option_select", function(){
         let newval = $(this).val()
         get_class_option_text(newval)
    });


    $(document).on("submit", "#form_product_image_add", AddAdditionalProductImage);

    //CATEGORYS
   // $(document).on("submit", "#form-product-category-edit", loadForm);
   // $(document).on("submit", "#form-product-category-edit", loadForm);

    $(document).on('submit', '#form-product-category-edit', function () {
         SaveDialogUpdateTable('product_category_table', $(this));
         return false;
     });



    /**                                                          START - product additioanl images                                                  */

    $(document).on("change", "#js-image-store_id", function(){
         let store_id = $(this).val()
         let product_id = sessionStorage.getItem("product_id");
         let data_url = product_id + '/additional_images/' + store_id +'/add';
         if(store_id > 0) {
             $('#js-product_addtional_images_add').attr('data-url', data_url);
             $('#js-product_addtional_images_add').removeClass('disabled')

         }
         else {
            $('#js-product_addtional_images_add').addClass('disabled')
         }
          loadProductImages(product_id, store_id);
    });

    $('#js-variant-store_id').on('change', function() {
        let newval = $(this).val()
        let ajax_url = "/products/api/storevariants/" + js_product_id + "/"+newval+"?format=datatables";
        product_variants_site_table.ajax.url(ajax_url).load();
    });

    //delete button on product additional image by store
    $(document).on("click", ".store_product_additional_images-dlg", loadForm);
    $(document).on("click", ".product_additional_images-dlg", loadForm);

    $(document).on('submit', '#frm-store_product_additional_images-delete', function() {

        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.is_saved) {
                    $("#modal-base").modal("hide");
                    $('#js-image-store_id').trigger('change');
                }
            }
        });
        return false;

    });

    $(document).on('submit', '#frm-store_product_additional_images-edit', function() {

        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide");
                    $('#js-image-store_id').trigger('change');
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    });

    $(document).on('submit', '#frm-store_product_additional_images-update', function() {

        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.is_saved) {
                    $("#modal-base").modal("hide");
                    $('#js-image-store_id').trigger('change');
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    });


    $(document).on("click", "#js-product_addtional_images_add", loadForm);


    $(document).on("click", ".js-variant_site-add", function(){
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

    $(document).on("click", ".js-variant_site-delete", function(){
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
    function loadProductImages(product_id, store_id){

       let ajax_url = '/products/'+product_id+'/additional_images/' + store_id

           $.ajax({
               url: ajax_url,  // <-- AND HERE
               type: 'get',

               success: function (data) {
                   // $("#modal-base .modal-title").html("Edit Address");
                   $("#js-product_images").html(data);
               }
           });
           return false;
    };


    $(document).on("submit", "#form_product_document", DocumentUpload);
    $(document).on("click", ".js-product_document-delete", loadForm);
    $(document).on("submit", "#form-product_document-delete", DocumentUpload);



    /** - RELATED ITEMS **/
    $(document).on("submit", "#form-related_products-add", RelatedProductUpdate);
    $(document).on("submit", "#form-related_product_edit", RelatedProductUpdate);
    $(document).on("submit", "#dlg-related_product-delete", RelatedProductUpdate);



    $(document).on("change", "#js-related_list-store_id", function(){
         let store_id = $(this).val();
         let ajax_url = "/products/related/" + js_product_id + "/store/" + store_id + "?format=datatables";
         let dt = $('#product_related_table').DataTable();
         dt.ajax.url(ajax_url).load();


    });

    /** --  product options  --  **/
     $(document).on("click", ".js-product-option-edit-btn", loadForm);
     $(document).on("click", "#js-product_add_option", loadForm);

     $(document).on("click", ".js-product-option-btn", AddRemoveProductOption);
     $(document).on("submit", "#dlg_product_option_edit_form", function() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.is_saved) {
                    $("#modal-base").modal("hide");
                    var product_options_current = $('#product_options_current').DataTable();
                     product_options_current.ajax.reload();
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    });

     $(document).on("submit", "#dlg_product_option_edit_sort_form", function() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.is_saved) {
                    $("#modal-base").modal("hide");
                    var product_option_table_active = $('#product_options_active_table').DataTable();
                     product_option_table_active.ajax.reload();
                }
                else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    });

    function updateProductOptionsTables()
    {
        var product_option_table_available = $('#product_options_available_table').DataTable();
        var product_option_table_active = $('#product_options_active_table').DataTable();


        product_option_table_available.ajax.reload();
        product_option_table_active.ajax.reload();


    }

    function AddRemoveProductOption() {
        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'POST',
            data: {csrfmiddlewaretoken: window.CSRF_TOKEN},
            success: function (data) {
                if (data.is_saved) {
                    updateProductOptionsTables()
                }
            }
        });
        return false;
    }



})





