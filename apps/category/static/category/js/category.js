 $(function () {
    //    $("#js-customer-create").click(loadForm);

    $('#category_description_table').DataTable( {
        "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        "processing" : true,
        "lengthMenu" : [[10,25,50,100,-1], [10,25,50,100,"All"]],
        "pageLength": 25,
        "autoWidth": false,
        "responsive": true,
        "ajax": {
                 "processing": true,
                 "url": "/category/api/descriptions?format=datatables"
             },
        "deferRender": true,
        "order": [[ 1, "desc" ]],
         "search": {
            "regex": true
        },
        columns :[
            {
                data: "store",
                sortable: false,
                searchable: false,
                name: "store.name",
                render: function ( data, type, row ) {
                    let store_static_url = $('#static_store_url').val()
                    let image_src =  store_static_url + data.thumb;
                    return '<img height="15px" src="' + image_src + '">'
                 }
            },
             {
                 data: "category_image_url",
                sortable: false,
                searchable: false,
                name: "store.name",
                render: function ( data, type, row ) {
                    return '<img height="50px" src="' + data + '">'
                 }
             },
            {data: "name"},
            {data: "description"},
            {
                data: "category_id",
                sortable: false,
                className: 'text-md-end text-start',
                render: function ( data, type, row ) {
                let edit_icon = '<a class="btn btn-primary btn-sm" href="' +data  + '/storeedit"><i class="fas fa-edit fa-sm"></i></a>';
                let delete_icon = '<a  class="btn btn-danger btn-sm js-info-delete" role="button" data-url="' + data + '/deletedlg"><i class="fas fa-trash fa-sm"></i></a>';
                return  edit_icon + " " + delete_icon;

                }
            },
        ]
    } );


} );