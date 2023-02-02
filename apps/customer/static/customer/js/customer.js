// href="{% url 'customeraddressedit' customer_obj.customer_id address.pk %}"
$(function()
{

  var saveForm = function () {
    var form = $(this);
    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: form.attr("method"),
      dataType: 'json',
      success: function (data) {
        if (data.form_is_valid) {
          updateAddressBook()
          $("#modal-base").modal("hide");  // <-- Close the modal
        } else {
          $("#modal-base .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  }

  var SavePasswordForm = function() {
        var form = $(this);
        let url = form.attr("action");
        let data = form.serialize();
        let after = form.attr("after")
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
  }

  var updateAddressBook = function() {
    $.ajax({
      url: '/customer/'+customer_id+'/addressbook',
      type: 'get',
      dataType: 'json',
      success: function (data) {
          $('#tab-address .panel-body').html(data.html_grid)
          $('#customer-address-details').html(data.html_address)

         reinstateFunction();
      }
    });
    return false;
  }


  var reinstateFunction = function(){
    $(".js-address-edit").click(loadForm);
    $(".js-address-create").click(loadForm);
    $(".js-address-delete").click(loadForm);
    $(".js-customer-edit").click(loadForm);
    $(".js-contact-edit").click(loadForm);


  }

  reinstateFunction()

   $("#modal-base").on("submit", ".js-address-submit", saveForm);
   $("#modal-base").on("submit", ".js-customer-details-submit", saveForm);
  $(document).on("submit", "#form-customer-password", SavePasswordForm);


  let previous_order_table = $('#previous_order_table').DataTable( {
        "dom": "<'row'<'col-6'f><'col-6'lT>>" +
         "<'row'<'col-12'tr>>" +
         "<'row'<'col-6'i><'col-6'p>>",
        "processing" : true,
        "lengthMenu" : [[10,25,50,100,-1], [10,25,50,100,"All"]],
        "pageLength": 25,
        "autoWidth": true,
        "responsive": true,
        "serverSide": false,
        "rowId" : 'order_id',
        "ajax": {
                 "processing": true,
                 //"url": "/orders/api/orders?format=datatables",
                "url": '/orders/api/customer/'+customer_id+'?format=datatables',
                "type" : "GET",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", "{{ csrf_token|escapejs }}");
            }
            },
        "deferRender": false,
        "order": [[ 2, "desc" ]],

        columns :[

            {
                data: "store",
                sortable: false,
                searchable: false,
                name: "store.name",
                render: function ( data, type, row ) {
                    let image_src =  static_const + '/images/stores/' + data.thumb;
                    return '<img height="15px" src="' + image_src + '">'
                 }
            },
            {
                data: "order_id",
                 render: function ( data, type, row ) {
                    let url = '/orders/' + data;
                    return '<a href="' + url + '">'+ data + '</a>';
                 }

            },
            {
                data: "customer_order_ref"
            },
            {
                data: "date_added",
            },

            {
                data: "dow",
                 render: function ( data, type, row ) {
                    let text = data + ' (' + row.days_since_order + ')'
                     return text
                 },
                searchable: false

            },
            {
                data: "payment_status.name",
            },
            {
                data: "order_status.name",
            },
            {
                data: "total",
                class: "text-end",
                render: function ( data, type, row ) {
                    return parseFloat(data).toFixed(2);
                 }
            },
            {
                data: "order_id",
                sortable: false,
                className: 'text-end',
                render: function (data, type, row) {

                    //let edit_icon = '<a class="btn btn-primary btn-sm" role="button" href="' + data + '"><i class="fas fa-edit fa-sm"></i></a>';
                    // let delete_icon = '<a class="btn btn-danger btn-sm" role="button" href="' + data +'/delete/"><i class="fas fa-trash fa-sm"></i></a>'
                    let shipping_colour = 'btn-grey'
                    if (row['shipping_flag'] != null) {
                        shipping_colour = 'btn-' + row['shipping_flag']['shipping_status__status_colour']
                    }
                    // let shipping_icon = '<i class="fas fa-shipping-fast ' + shipping_colour + ' "></i>'

                    let printed_colour = 'btn-grey'
                    if (row['printed'] == 1) {
                        printed_colour = 'btn-green'
                    }
                    // let printed_icon = '<i class="fas fa-print ' + printed_colour + ' "></i>'


                    //return printed_icon + " " + shipping_icon + /* " " + delete_icon + "  " +*/ edit_icon;
                    let btn_grp = '<div class="btn-group" role="group" aria-label="Order status">'
                    let printed_icon = '<button type="button" class="btn btn-sm disabled ' + printed_colour + '"><i class="fas fa-print  "></i></button>'
                    let shipping_icon = '<button type="button" class="btn btn-sm disabled ' + shipping_colour + '"><i class="fas fa-shipping-fast "></i></button>'
                    let edit_icon = '<a class="btn btn-primary btn-sm" role="button" href="/orders/' + data + '"><i class="fas fa-edit "></i></a>'
                    return btn_grp + shipping_icon + printed_icon + edit_icon + '</div>'
                }
            },
           {data: "days_since_order", "visible": false, searchable: false },
            {data: "store.store_id", "visible": false },
            {data: "printed", "visible": false, searchable: false},
            {data: "shipping_flag", "visible": false, searchable: false},
             {data: "product_flags", "visible": false, searchable: false },
           {data: "highlight_code", "visible": false, searchable: false },
        ],
        "createdRow": function( row, data, dataIndex ) {
           /* if ( data.order_status.order_status_id != 15 ) {
                $(row).addClass( 'failed-order' );
            } */
            if(data.shipping_flag == null) {
                if (data.highlight_code == 1) {
                    $(row).addClass('live-order');
                }
                if (data.highlight_code == 2) {
                    $(row).addClass('pending-order');
                }
                if (data.highlight_code == 3) {
                    $(row).addClass('failed-order');
                }
            }

         },
    } );









})
