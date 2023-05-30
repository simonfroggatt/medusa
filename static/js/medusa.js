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
});

$(".two-decimals").change(function(){
         this.value = parseFloat(this.value).toFixed(2);
 });

$('#topmenu_quickcalc').on('click', function () {
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
        $("#modal-base .modal-content").html("<html><body></body></html>");
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
                    // $("#modal-base .modal-title").html("Edit Address");
                    $("#modal-base .modal-content").html(data.html_form);
                }
            },
        })
    };

function SaveDialogFormRedirect() {
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
                    if (Boolean(data.redirect_url)) {
                        window.location.href = data.redirect_url
                    }
                    if (after) {
                        eval(after + "()")
                    }
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }


