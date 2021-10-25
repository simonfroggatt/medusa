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
      url: '/customer/2/addressbook',
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

})
