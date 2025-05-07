 $(function () {
    //    $("#js-customer-create").click(loadForm);

    $('#category_site_parent_table').DataTable( {
        "dom": "<'row'<'col-sm-6'f><'col-sm-6'lT>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        "processing" : true,
        "lengthMenu" : [[10,25,50,100,-1], [10,25,50,100,"All"]],
        "pageLength": 25,
        "autoWidth": false,
        "responsive": true,
        "serverSide": true,
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
            {data: "parent.name"},
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
                        return '<i class="fa-solid fa-check flag-green"></i>'
                    } else {
                        return '<i class="fa-solid fa-xmark fa-xl  flag-red"></i>'
                    }

                }
                },
            {data: "top",
            render: function (data, type, row) {
                    if (data == 1) {
                        return '<i class="fa-solid fa-check flag-green"></i>'
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
                let edit_icon = '<a class="btn '+ button_context['BUTTON_EDIT'] +' btn-tsg-row js-category-edit" role="button" data-url="'+data+'/storecatparentdlg"><i class="'+ icons_context['ICON_EDIT'] +' fa-sm"></i></a>';
                let delete_icon = '<a  class="btn '+ button_context['BUTTON_DELETE'] +' btn-tsg-row js-category-edit" role="button" data-url="api/storeparentdelete/'+data+ '" data-dlgsize="modal-lg"><i class="'+ icons_context['ICON_DELETE'] +' fa-sm"></i></a>';
                return  edit_icon + " " + delete_icon;

                }
            },
        ]
    } );



    //
      $(document).on('click', '.js-category-edit', loadForm);


} );