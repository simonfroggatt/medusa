$(function(){

    let core_vars_tbl = $('#core_variants_table').DataTable({
         "processing" : true,
        "pageLength": 100,
        "paging":   false,
        "info":     false,
        "autoWidth": false,
        "searching" : false,
        "responsive": true,
        "select": true,
        "rowId" : 'prod_variant_core_id',
        "ajax": {
                 "processing": true,
                 "url": "/products/api/corevariants/"+js_product_id+"?format=datatables",
            },
        columns :[
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
              render: function (data, type, row, meta ) {
                    return '<img height="30px" class="rounded mx-auto d-block" src="'+data+'">';
                }},
             {data: "gtin"},
            {
                data: "prod_variant_core_id",
                sortable: false,
                render: function ( data, type, row ) {
                let edit_icon = '<a href="' + data + '"><i class="fas fa-edit table-button"></i></a>'
                return edit_icon;
                }
            },
            ]

         });



core_vars_tbl.on( 'select', function ( e, dt, type, indexes ) {
    if ( type === 'row' ) {
        var data = dt.row( indexes ).id();
        alert(data)
        // do something with the ID of the selected items
    }
} );
})

