$(function () {

    $(document).on('click', '#js-quote-edit', loadForm);
    $(document).on('submit', '#js-quote-details-edit-submit', SaveDialogFormRedirect);

    $(document).on('click', '#js-quote-product-edit', loadForm);


})