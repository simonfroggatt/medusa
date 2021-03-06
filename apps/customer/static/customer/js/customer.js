// href="{% url 'customeraddressedit' customer_obj.customer_id address.pk %}"
$(function()
{

  var loadForm = function() {

    var btn = $(this);  // <-- HERE
    $.ajax({
      url: btn.attr("data-url"),  // <-- AND HERE
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal-address").modal("show");
      },

      success: function (data) {
        if (data.form_is_valid) {
          $("#modal-address").modal("hide")
        }
        else {
          // $("#modal-address .modal-title").html("Edit Address");
          $("#modal-address .modal-content").html(data.html_form);
        }
      },
    });
}

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
          $("#modal-address").modal("hide");  // <-- Close the modal
        } else {
          $("#modal-address .modal-content").html(data.html_form);
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

  }

  reinstateFunction()

   $("#modal-address").on("submit", ".js-address-submit", saveForm);


  let previous_order_table = $('#previous_order_table').DataTable( {
        "dom": "<'row'<'col-6'f><'col-6'lT>>" +
         "<'row'<'col-12'tr>>" +
         "<'row'<'col-6'i><'col-6'p>>",
        "processing" : true,
        "lengthMenu" : [[10,25,50,100,-1], [10,25,50,100,"All"]],
        "pageLength": 25,
        "autoWidth": true,
        "responsive": true,
        "serverSide": true,
        "rowId" : 'order_id',
        "ajax": {
                 "processing": true,
                 "url": "/orders/api/orders-list?format=datatables&customer_id="+customer_id,
                "type" : "POST",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", "{{ csrf_token|escapejs }}");
            }
            },
        "deferRender": false,
        "order": [[ 1, "desc" ]],

        columns :[

            {
                data: "store",
                sortable: false,
                searchable: false,
                name: "store.name",
                render: function ( data, type, row ) {
                    let image_src = '{% static "images/stores/" %}' + data.thumb;
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
                render: function ( data, type, row ) {

                     let edit_icon = '<a class="btn btn-primary btn-sm" role="button" href="/orders/' + data + '"><i class="fas fa-edit fa-sm"></i></a>';


                    return edit_icon;
                }
            },
           {data: "days_since_order", "visible": false, searchable: false },
        ],
        "createdRow": function( row, data, dataIndex ) {
            if ( data.order_status.order_status_id != 15 ) {
                $(row).addClass( 'failed-order' );
            }
         },
    } );


})
