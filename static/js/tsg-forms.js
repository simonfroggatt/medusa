

    var loadForm = function () {

        var btn = $(this);  // <-- HERE
        $.ajax({
            url: btn.attr("data-url"),  // <-- AND HERE
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $(dlg_div_id).modal("show");
            },

            success: function (data) {
                if (data.form_is_valid) {
                    $(dlg_div_id).modal("hide")
                } else {
                    // $("#modal-base .modal-title").html("Edit Address");
                    $(dlg_div_id + " .modal-content").html(data.html_form);
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
                    $("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }

    var updateAddressBook = function () {
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
