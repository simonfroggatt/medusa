//helper function
$(function()
{

    let LoadCustomerNewOrder = function () {
        var btn = $(this);  // <-- HERE
        let dlg_size = btn.attr("data-dlgsize")

        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass(dlg_size)

                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
    }

    let SaveCustomerNewOrder = function () {
        var form = $(this);
        let url = form.attr("action");
        let data = form.serialize();
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide");  // <-- Close the modal
                    let new_order_id = data.order_id
                    window.location = '/orders/'+new_order_id
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }


     $(document).on('click', '.js-order-customer-create', LoadCustomerNewOrder);
     $(document).on("submit", "#js-order-customer-create-form", SaveCustomerNewOrder);

     $(document).on('click', '.js-quote-customer-create', loadForm);
     $(document).on("submit", "#js-quote-customer-create-form", SaveDialogFormRedirect);



     $(document).on("click", "#topmenu_quickquote", loadForm);

     new ClipboardJS('.btncopy');

     const myModalEl = document.getElementById('modal-base')

     myModalEl.addEventListener('hidden.bs.modal', function(event) {
         var onclose = $(this).attr('data-onclose')
         switch(onclose) {
             case "site_variant": UpdateSiteVarientTable(); break;
             default: console.log(onclose);
         }

    });


});

$(".two-decimals").change(function(){
         this.value = parseFloat(this.value).toFixed(2);
 });

$('#topmenu_quickcalc').on('click', function () {
    tax_rate = 0.20;
    $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
    $("#modal-base #modal-outer").addClass('modal-xl')
    //$("#modal-base .modal-content").html(data.html_form);
    $("#modal-base .modal-content").load('/pricing/quick/')
    $("#modal-base").modal("show");
})


function copy_price_to_clipboard(width, height, price, material = '', qty = 1) {
   let strToCopy = width + 'mm x ' + height + 'mm';
  if(material.length > 1){
      strToCopy += ' - ' + material
  }
  strToCopy += '@ £'+price+ ' each for qty '+qty + ' off'
 copyToClipboard(strToCopy)
}

var loadForm = function () {
        var btn = $(this);  // <-- HERE
        let dlg_size = btn.attr("data-dlgsize");
        let tmp_url = btn.attr("data-url");
        let onclose = ''
        if(btn.attr("data-onclose"))
            onclose = btn.attr("data-onclose");

        $("#modal-base .modal-content").html("<html><body></body></html>");
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass(dlg_size)
                $("#modal-base").attr("data-onclose", onclose)
                $("#modal-base").modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide")
                } else {
                    // $("#modal-base .modal-title").html("Edit Address");
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        })
    };

function SaveDialogFormRedirect() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    $("#modal-base").modal("hide");  // <-- Close the modal
                    if (Boolean(data.redirect_url)) {
                        window.location.href = data.redirect_url
                    }
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    };

function SaveDialogUpdateTable(table_name, form)
    {
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.form_is_valid) {
                    let dt = $('#'+table_name).DataTable();
                    dt.ajax.reload();
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

 function DocumentUpload(){
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
                if (data.success_post) {
                    reloadDocuments(data.document_ajax_url, data.divUpdate)
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    alert('error')
                }
            }
        });
        return false;
    };

     function reloadDocuments(ajax_url, divUpdate) {
        AjaxUpdate( ajax_url, [divUpdate]);
        return false;
    }

 function AjaxUpdate(url, updateIds)
    {
         $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                for ( var i = 0, l = updateIds.length; i < l; i++ ) {
                    let updateElement = updateIds[i][0];
                    let dataName = updateIds[i][1];
                    let new_html = '#'+updateElement;
                    console.log(new_html);
                    $('#'+updateElement).html(data[dataName])
                }
            }
        });
        return false;
    }

    /***   Modal close functions **/

function UpdateSiteVarientTable(){

     var product_symbol_table_available = $('#product_variants_site_table').DataTable();
     product_symbol_table_available.ajax.reload();
    };

function add_toast_message(message, header, type = 'success', autohide = true) {
    var uniqueIDNumber = 'toast_' + new Date().getTime();
    let new_toast = document.createElement('div')
    let toast_string = '<div class="toast text-' + type + '" role="alert" aria-live="assertive" data-bs-autohide="'+autohide+'" aria-atomic="true" id="' + uniqueIDNumber + '">';
    if (header.length > 1) {
        toast_string += '<div class="toast-header">';
        toast_string += '<strong class="me-auto">';
        toast_string += header;
        toast_string += '</strong>';
        toast_string += '<small class="text-body-secondary">just now</small>';
        toast_string += '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>';
        toast_string += '</div>';
    }
    toast_string += '<div class="toast-body">';
    toast_string += message;
    toast_string += '</div>';
    toast_string += '</div>';
    new_toast.innerHTML = [toast_string].join('')

    let toastStack = document.getElementById('toastStackDiv')
    toastStack.append(new_toast)
    let newtoast = document.getElementById(uniqueIDNumber)

    const myToast = bootstrap.Toast.getOrCreateInstance(newtoast)
    myToast.show()

}



var XeroApiCall = function (){
        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {

            },
            success: function (data) {
                if (data.status === 'OK') {
                    let api_call_type = data.xero_call_type
                    add_toast_message(api_call_type + ' was updated', 'XERO ' + api_call_type +' - API', 'bg-success')
                } else {
                     let api_call_type = data.xero_call_type
                    let error_obj = data.error
                    let error_details = error_obj['error_details']
                    let error_str = ''
                    error_details.forEach(function (item, index) {
                        error_str = error_str + item['Message'] + '<br>'
                        })

                    add_toast_message(error_str, 'XERO ' + api_call_type + ' - API', 'bg-error')
                }
            },
        });
    }


var XeroApiCallDlg = function(){
        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
                $("#modal-base #modal-outer").addClass('modal-lg')
                $("#modal-base").modal("show");
            },
            success: function (data) {
                if (data.xero_status === 'OK') {
                    $("#modal-base").modal("hide")
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        });
    }

var ORDERSNAMESPACE = {}
ORDERSNAMESPACE.SetSingleUnitPrice = function (new_price, form_id, bl_update_pricing = false) {
        $(form_id + ' #single_unit_price').val(new_price);
        if (bl_update_pricing) {
            SetPrice(true, form_id)
        }
    }