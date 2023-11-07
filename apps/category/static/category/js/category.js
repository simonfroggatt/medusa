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
                 "url": "/category/api/tostores/"+current_cat_id+"?format=datatables"
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
                data: "category_store_id",
                sortable: false,
                className: 'text-md-end text-start',
                render: function ( data, type, row ) {
                let edit_icon = '<a class="btn btn-primary btn-sm" href="' +data  + '/storeeditpk'+'"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                let delete_icon = '<a  class="btn btn-danger btn-sm js-category-edit" role="button" data-url="api/storetextdelete/'+data+'" data-dlgsize="modal-sm"><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>';
                return  edit_icon + " " + delete_icon;

                }
            },
        ]
    } );

    $('#category_site_parent_table').DataTable( {
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
                 "url": "/category/api/sitepaths/"+current_cat_id+"?format=datatables"
             },
        "deferRender": true,
        "order": [[ 1, "desc" ]],
         "search": {
            "regex": true
        },
        columns :[
            {
                data: "category_store.store",
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
                 data: "category_store.name",
             },
            {data: "parent.category.name"},
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
            {data: "homepage",
                render: function (data, type, row) {
                    if (data == 1) {
                        return '<i class="fas fa-check flag-green"></i>'
                    } else {
                        return '<i class="fa-solid fa-xmark fa-xl  flag-red"></i>'
                    }

                }
                },
            {data: "top",
            render: function (data, type, row) {
                    if (data == 1) {
                        return '<i class="fas fa-check flag-green"></i>'
                    } else {
                        return '<i class="fa-solid fa-xmark fa-xl  flag-red"></i>'
                    }

                }
                },
            {
                data: "id",
                sortable: false,
                className: 'text-md-end text-start',
                render: function ( data, type, row ) {
                let edit_icon = '<a class="btn btn-primary btn-sm js-category-edit" role="button" data-url="'+data+'/storecatparentdlg"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                let delete_icon = '<a  class="btn btn-danger btn-sm js-category-edit" role="button" data-url="api/storeparentdelete/'+data+ '" data-dlgsize="modal-lg"><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>';
                return  edit_icon + " " + delete_icon;

                }
            },
        ]
    } );



    //
      $(document).on('click', '.js-category-edit', loadForm);


} );