$(function () {

    if ($.fn.dataTable.isDataTable('#product_sites_table')) {
        var product_no_symbol_table = $('#product_no_symbol_table').DataTable();
    } else {
        var product_no_symbol_table = $('#product_no_symbol_table').DataTable({
            "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6'i><'col-sm-6'p>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 25,
            "autoWidth": true,
            "responsive": true,
            "serverSide": true,
            "select": true,
            "ajax": {
                "processing": true,
                "url": "/symbols/api/productnosymbol?format=datatables"
            },
            "deferRender": false,
            "search": {
                "regex": true
            },
            "rowId": 'product_id',
            columns: [
                {data: "product_id"},

                {
                    data: "image_url",
                    name: "thumbnail",
                    searchable: "false",
                    sortable: "false",
                    render: function (data, type, row, meta) {
                        return '<img class="rounded mx-auto d-block product-thumb-lg" src="' + data + '">';
                    }
                },
                {
                    data: "product_id",
                    sortable: false,
                     className: 'text-md-end text-start',
                     render: function (data, type, row) {
                         let edit_icon = '<a class="btn btn-warning btn-tsg-row" role="button" data-url="product/' + data + '/exclude"><i class="fa-solid fa-link-slash fa-sm"></i></a>';
                         return edit_icon;
                     }
                },
                {
                    data: 'productdescbase.name',
                    searchable: true,
                    visible: false
                },
                {
                    data: 'productdescbase.title',
                    searchable: true,
                    visible: false
                },
                {
                    data: 'productdescbase.description',
                    searchable: true,
                    visible: false
                }

            ]
        });
    }


    if ($.fn.dataTable.isDataTable('#product_missing_symbol_table')) {
        var product_missing_symbol_table_active = $('#product_missing_symbol_table_active').DataTable();
        let product_id = sessionStorage.getItem("product_missing_id");
    } else {
        let product_id = sessionStorage.getItem("product_missing_id");
        var product_missing_symbol_table_active = $('#product_missing_symbol_table_active').DataTable({
            "dom": "<'row'<'col-6'fl><'col-6'p>>" +
                "<'row'<'col-12'tr>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 10,
            "autoWidth": false,
            "responsive": false,
            "serverSide": false,
            "scroller": true,
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
                {data: "symbol.id"},
                {data: "symbol_image_url", defaultContent: "no-image.png",
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
                        let remove_icon = '<a class="btn btn-warning btn-tsg-row js-product-missing-symbol-edit" role="button" data-url="/products/api/product/<product_id>/deleteproductsymbol/' + data + '"><i class="fa-solid fa-minus"></i></a>';
                        return remove_icon
                    },
                }

            ]
        });
    }


     if ($.fn.dataTable.isDataTable('#product_missing_symbol_table_available')) {
         let product_id = sessionStorage.getItem("product_missing_id");
        var product_missing_symbol_table_available = $('#product_missing_symbol_table_available').DataTable();
    } else {
         let product_id = sessionStorage.getItem("product_missing_id");
        var product_missing_symbol_table_available = $('#product_missing_symbol_table_available').DataTable({
            "dom": "<'row'<'col-6'fl><'col-6'p>>" +
                "<'row'<'col-12'tr>>",
            "processing": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "pageLength": 30,
            "autoWidth": false,
            "responsive": false,
            "serverSide": false,
            "scroller": true,

            "rowId": 'id',
            "ajax": {
                "processing": true,
               // "url": "/products/api/productsymbols-available/"+product_id+"?format=datatables",
                "url": "/products/api/"+product_id+"/available-symbols?format=datatables",

              },
            "deferRender": true,

            "search": {
                "regex": true
            },
            columns: [
                {data: "id"},
                    {data: "id",
                    render: function ( data, type, row ) {
                        let add_icon = '<a class="btn btn-success btn-tsg-row js-product-missing-symbol-edit" role="button" data-url="/products/api/product/<product_id>/addproductsymbol/' + row['id'] + '"><i class="fa-solid fa-plus"></i></a>';
                        return add_icon
                    },
                    },
                {data: "symbol_image_url", defaultContent: "no-image.png",
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



     product_no_symbol_table.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            let data = dt.row(indexes).id();
            //let variant_url = "/products/api/productsymbols-available/"+data+"?format=datatables";
            let variant_url = "/products/api/"+data+"/available-symbols?format=datatables"
            product_missing_symbol_table_available.ajax.url(variant_url).load()

            let active_url = "/products/api/productsymbols/"+data+"?format=datatables"
            product_missing_symbol_table_active.ajax.url(active_url).load()

            sessionStorage.setItem("product_missing_id", data);

        }
     });

      $(document).on("click", ".js-product-missing-symbol-edit", AddRemoveProductSymbol);
      sessionStorage.setItem("product_missing_id", 0);

      $(document).on("click", ".js-product-missing-symbol-edit", AddRemoveProductSymbol);

});


function updateSymbolTables()
    {
        var product_symbol_table_available = $('#product_missing_symbol_table_available').DataTable();
        product_symbol_table_available.ajax.reload();

        var product_symbol_table = $('#product_missing_symbol_table_active').DataTable();
        product_symbol_table.ajax.reload();

    }

    function AddRemoveProductSymbol() {
        var btn = $(this);  // <-- HERE
        tmp_url = btn.attr("data-url");
        rtn_url = tmp_url.replace("<product_id>", sessionStorage.getItem("product_missing_id"));
        $.ajax({
            url: rtn_url,  // <-- AND HERE
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

