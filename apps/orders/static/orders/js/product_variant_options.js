$(function(){
    $('.tsg_option_class').change(function () {
        let class_id = $(this).find(':selected').data('class')
        let value_id = $(this).val()
        ShowHideDynamics();
        let price_modifier = calcExtraPrice();
        let old_price = $('#base_price').val()
        let new_price = parseFloat(price_modifier) + parseFloat(old_price);
        $('#new_price').html(new_price);
    })
})

function getClassArray(class_id){
    //get the class info from the local var
    let rtn_array = [];
    $.each(select_values, function (key, value){
       if(value.id == class_id) {
           rtn_array = value
           return false;
       }
    })
    return rtn_array
}

function getOptionArray(class_id, value_id){
    //get the selection option info from the local var
    let rtn_array = [];
    let class_values = getClassArray(class_id);
    $.each(class_values.values, function (key, value){
       if(value.id == value_id) {
           rtn_array = value;
           return false;
       }
    })
    return rtn_array;
}


function ShowHideDynamics(){
    let all_selects = $(document).find('.tsg_option_class')
    let class_id = 0;
    let dynamics_used = [];
    let new_dynamics_used = [];
    $.each(all_selects, function(key, value){
        class_id = $(value).data('selectclass');
        new_dynamics_used = getSelectDynamicsUsed(class_id);
        $.merge(dynamics_used, new_dynamics_used);
    })
    // console.log('dynamics used: '+ dynamics_used);

    //now step through the dnyamic selected and show/hide as required
    let all_dynamics = $(document).find('.dynamic_select') //all the dynamic ones
    let is_need = -1;
    // console.log('all_dynamics: '+all_dynamics);
    let dynamic_obj = null;
    for(i = 0; i <= all_dynamics.length; i++){
        dynamic_obj = all_dynamics[i];
        class_id = $(dynamic_obj).data('selectclass');
        hideDynamics(class_id, dynamics_used)
    }
    $.each(all_dynamics, function(key, value){
        //see if it's on the list, otherwise reset to 0 and hide
        class_id = $(value).data('selectclass');

        hideDynamics(class_id, dynamics_used)

    })
}

function hideDynamics(class_id, dynamics_used){
    let is_need = -1;
    let child_used = []
    // console.log('hideDynamics - class_id: '+ class_id);
    is_need = dynamics_used.indexOf(class_id);
    if (is_need >= 0) {
        $('#div_select_' + class_id).show();
    } else {
        child_used = getSelectDynamicsUsed(class_id);
        // console.log('hideDynamics - child_used: '+ child_used);
        $('#option_class_' + class_id).val(0);
        $('#div_select_' + class_id).hide();

        if (child_used.length > 0) {
            $.each(child_used, function(key, value){
                dynamics_used.splice($.inArray(value, dynamics_used), 1);
                hideDynamics(value, dynamics_used)
            })
        }
    }
}


function getSelectDynamicsUsed(class_id){
    let selected_data = [];
    let dynamics_used = [];
    let select_object_id = '#option_class_'+class_id;
    let select_object = $(select_object_id);
    let select_value_id = $(select_object).val();
    // console.log('getSelectDynamicsUsed - class_id: ' + class_id);
    if (select_value_id > 0) {  //only look up if it's not default
        selected_data = getOptionArray(class_id, select_value_id);
        let dynamic_options = selected_data['dynamic_id'] //these are the options that appear dynamically
        let select_class_value_id = 0;
        if (dynamic_options.length > 0) {
            // console.log('getSelectDynamicsUsed - dynamic_options');
            $.each(dynamic_options, function (key, value) {
                //add to the dynamics_used array that this option value uses
                select_class_value_id = value['child_value_id'];
                // console.log('getSelectDynamicsUsed - select_class_value_id: ' + select_class_value_id);
                if (dynamics_used.indexOf(select_class_value_id) < 0)
                    dynamics_used.push(select_class_value_id);
            })

        }
    }
    return dynamics_used;
}

function ShowDynamicSelect(select_class_id)
{
    //show the dynamic class on the selected option value
    $('#div_select_'+select_class_id).show();
    alert('show select' + select_class_id);
}

function calcExtraPrice() {
    let all_selects = $(document).find('.tsg_option_class')
    let addon_price = 0.00;
    let new_addon_price = 0.00;
    let select_value_id = 0;
    let class_id = 0;
    $.each(all_selects, function(key, value){
        select_value_id = $(value).val();
        if(select_value_id > 0) {  //this option is selected, so get the price
            class_id = $(value).data('selectclass');
            new_addon_price = getPriceModifier(class_id, select_value_id);
            addon_price = addon_price + new_addon_price;
            console.log(addon_price);
        }
    })

    return addon_price.toFixed(2);

}



function getPriceModifier(class_opt_id, selected_value_id)
{
    let price_mod = 0.00;
    class_opt_vals = getOptionArray(class_opt_id, selected_value_id)
  try{
    if (class_opt_vals === undefined) {
      price_mod = 0.00;
    }
    else
    {
      price_mod = 0.00;
      let mod_type = 0;
      mod_type = parseInt(class_opt_vals['option_type']);
      switch (mod_type) {
        case 1: price_mod = class_opt_vals['price_modifier'];   //FIXED  - e.g. Drill holes
          break;
        case 2:  //PERC  - e.g. Laminate
          //var base_prod_var = prod_variants[prod_var_options[0][0]][prod_var_options[0][1]];
          var prod_width = parseFloat(variant_info['size_width'])/1000;
          var prod_height = parseFloat(variant_info['size_height'])/1000;
          price_mod =    parseFloat(class_opt_vals['price_modifier']) * prod_width * prod_height;//size_width, size_height
          break;
        case 3:  //width - e.g. Channel
          //var base_prod_var = prod_variants[prod_var_options[0][0]][prod_var_options[0][1]];
          var prod_width = parseFloat(variant_info['size_width'])/1000;
          price_mod =    parseFloat(class_opt_vals['price_modifier']) * prod_width;
          break;
        case 4:
            price_mod = parseFloat(class_opt_vals['price_modifier']*class_opt_vals['price']);//Product - e.g. Clips
          break;
        case 5: //single fixed product, so no need to show drop down of product, but do need the underyling price
            price_mod = parseFloat(class_opt_vals['price_modifier']*class_opt_vals['price']);//variant - e.g. 600mm Stands
            break;
          break;
      }
      //whilst here update classtype hidden value to the type

      //var hiddenclassid = 'classtype' + selected_class_id;
      //$("input[id="+hiddenclassid+"]").val(mod_type)
     // $("input[id=classtype4"]").val(mod_type)

      return parseFloat(price_mod.toFixed(2));

    }
  }
  catch(error)
  {}



}