$(function () {

     function SendEmail() {
        var form = $(this);
        $.ajax({
            url: form.attr("action"),
            data: form.serialize(),
            type: form.attr("method"),
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    add_toast_message('Email sent successfully','Email Sent', 'bg-success')
                    //$("#modal-base").modal("hide");  // <-- Close the modal
                } else {
                    $("#modal-base .modal-content").html(data.html_form);
                }
            }
        });
        return false;
    }


    $(document).on("submit", "#js-order-email-form", SendEmail);
});