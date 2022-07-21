//helper function

$(".two-decimals").change(function(){
         this.value = parseFloat(this.value).toFixed(2);
 });

$('#topmenu_quickcalc').on('click', function () {
    $("#modal-base #modal-outer").removeClass('modal-sm model-lg modal-xl')
    $("#modal-base #modal-outer").addClass('modal-lg')
    //$("#modal-base .modal-content").html(data.html_form);
    $("#modal-base .modal-content").load('/pricing/quick/')
    $("#modal-base").modal("show");
})