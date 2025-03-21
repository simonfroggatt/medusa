

$(function(){
    $('.tsg_option_class').change(function () {
        let class_id = $(this).find(':selected').data('class')
        let value_id = $(this).val()
        ShowHideDynamics();
        let price_modifier = calcExtraPrice();
        let old_price = $('#base_unit_price').val()
        let new_price = parseFloat(price_modifier) + parseFloat(old_price);
       //SetSingleUnitPrice(new_price, 'form-stock', true);
       // $('#new_price').html(new_price);
    })

})




function ClassChange(){
    let class_id = $(this).find(':selected').data('class')
    let type_id = $(this).find(':selected').data('addontype')
    let form_id = '#' + $(this).parents("form").attr('id')
    form_id = '#form-stock'
        let value_id = $(this).val()
        ShowHideDynamics();
        let price_modifier = calcExtraPrice('', false, form_id);
        let old_price = $(form_id + ' #base_unit_price').val()
        let new_price = parseFloat(price_modifier) + parseFloat(old_price);
        ORDERSNAMESPACE.SetSingleUnitPrice(new_price.toFixed(2), '#form-stock', true);
        set_selected_option('#form_variant_options')
       // $('#new_price').html(new_price);
}

function ClassChangeStockEdit(){
   let option_extra_class_name = ""
     let form_id = '#' + $(this).parents("form").attr('id')

    let class_id = $(this).find(':selected').data('class')
        let value_id = $(this).val()
        ShowHideDynamics();
        let price_modifier = calcExtraPrice(option_extra_class_name, true, '#js-product-edit-submit');
        let old_price = $('#js-product-edit-submit' + ' #base_unit_price').val()
        let new_price = parseFloat(price_modifier) + parseFloat(old_price);

        ORDERSNAMESPACE.SetSingleUnitPrice(new_price.toFixed(2), '#js-product-edit-submit', true);
         set_selected_option('#js-product-edit-submit', '', false)
       // $('#new_price').html(new_price);
       // $('#new_price').html(new_price);
    return false;
}


function ClassChangeBespoke(){
    let option_extra_class_name = "_bespoke"
    let form_id = '#' + $(this).parents("form").attr('id')
    let class_id = $(this).find(':selected').data('class')
        let value_id = $(this).val()
        let price_modifier = calcExtraPrice(option_extra_class_name, true, form_id);
        let old_price = $(form_id + ' #base_unit_price').val()
        let new_price = parseFloat(price_modifier) + parseFloat(old_price);

        ORDERSNAMESPACE.SetSingleUnitPrice(new_price.toFixed(2), form_id, true);
        set_selected_option('#form-quick_manual', '_bespoke', true)
       // $('#new_price').html(new_price);
}


function ClassChangeBespokeEdit(){
    let option_extra_class_name = "_bespoke"
    let form_id = '#' + $(this).parents("form").attr('id')
    let class_id = $(this).find(':selected').data('class')
        let value_id = $(this).val()
        let price_modifier = calcExtraPrice(option_extra_class_name, true, form_id);
        let old_price = $(form_id + ' #base_unit_price').val()
        let new_price = parseFloat(price_modifier) + parseFloat(old_price);

        ORDERSNAMESPACE.SetSingleUnitPrice(new_price.toFixed(2), form_id, true);
        set_selected_option('#js-product-edit-submit', '_bespoke', true)
}

 $(document).on('change', '#js-product-edit-submit .tsg_option_class', ClassChangeStockEdit);
 $(document).on('change', '#form_variant_options .tsg_option_class', ClassChange);
 $(document).on('change', '#js-product-edit-submit .tsg_option_class_bespoke', ClassChangeBespokeEdit);
 $(document).on('change', '#form-quick_manual .tsg_option_class_bespoke', ClassChangeBespoke);



function getClassArray(class_id, bl_bespoke = false){
    //get the class info from the local var
    let rtn_array = [];
    let select_values_array =  [];
    if (bl_bespoke) {
        select_values_array = select_values_bespoke;
    }
    else {
        select_values_array = select_values;
    }
    $.each(select_values_array, function (key, value){
       if(value.id == class_id) {
           rtn_array = value
           return false;
       }
    })
    return rtn_array
}

function getOptionArray(class_id, value_id, bl_bespoke = false){
    //get the selection option info from the local var
    let rtn_array = [];
    let class_values = getClassArray(class_id, bl_bespoke);
    $.each(class_values.values, function (key, value){
       if(value.id == value_id) {
           rtn_array = value;
           return false;
       }
    })
    return rtn_array;
}


function ShowHideDynamics(){
    let tmp = 'asa';
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

function calcExtraPrice(option_extra_class_name = '', bl_bespoke = false, form_name = ''){
    let all_selects = $(document).find('.tsg_option_class' + option_extra_class_name)
    let addon_price = 0.00;
    let new_addon_price = 0.00;
    let select_value_id = 0;
    let class_id = 0;
    $.each(all_selects, function(key, value){
        select_value_id = $(value).val();
        if(select_value_id > 0) {  //this option is selected, so get the price
            class_id = $(value).data('selectclass');
            new_addon_price = getPriceModifier(class_id, select_value_id, bl_bespoke, form_name);
            addon_price = addon_price + new_addon_price;
            console.log(addon_price);
        }
    })

    return addon_price.toFixed(2);

}


function getPriceModifier(class_opt_id, selected_value_id, bl_bespoke = false, form_name = '')
{
    let price_mod = 0.00;
    class_opt_vals = getOptionArray(class_opt_id, selected_value_id, bl_bespoke)
  try{
    if (class_opt_vals === undefined) {
      price_mod = 0.00;
    }
    else
    {
      price_mod = 0.00;
      let mod_type = 0;
      mod_type = parseInt(class_opt_vals['option_type']);
      var prod_width = 0;
      var prod_height = 0;
      switch (mod_type) {
          case 1:
              price_mod = class_opt_vals['price_modifier'];   //FIXED  - e.g. Drill holes
              break;
          case 2:  //PERC  - e.g. Laminate
              //var base_prod_var = prod_variants[prod_var_options[0][0]][prod_var_options[0][1]];

              if (bl_bespoke) {
                  prod_width = $(form_name + ' #manualCalcWidth').val() / 1000;
                  prod_height = $(form_name + ' #manualCalcHeight').val() / 1000;
              } else {
                  prod_width = parseFloat(variant_info['size_width']) / 1000;
                  prod_height = parseFloat(variant_info['size_height']) / 1000;
              }
              price_mod = parseFloat(class_opt_vals['price_modifier']) * prod_width * prod_height;//size_width, size_height
              break;
          case 3:  //width - e.g. Channel
              //var base_prod_var = prod_variants[prod_var_options[0][0]][prod_var_options[0][1]];
              if (bl_bespoke) {
                  prod_width = $(form_name + ' #manualCalcWidth').val() / 1000;
              } else {
                  prod_width = parseFloat(variant_info['size_width']) / 1000;
              }
              price_mod = parseFloat(class_opt_vals['price_modifier']) * prod_width;
              break;
          case 4:
              price_mod = parseFloat(class_opt_vals['price_modifier'] * class_opt_vals['price']);//Product - e.g. Clips
              break;
          case 5: //single fixed product, so no need to show drop down of product, but do need the underyling price
              price_mod = parseFloat(class_opt_vals['price_modifier'] * class_opt_vals['price']);//variant - e.g. 600mm Stands
              break;
          case 6: //single fixed product, so no need to show drop down of product, but do need the underyling price
              price_mod = parseFloat(class_opt_vals['price_modifier'] * class_opt_vals['price']);//variant - e.g. 600mm Stands
              break;
      }
      //whilst here update classtype hidden value to the type

      //var hiddenclassid = 'classtype' + selected_class_id;
      //$("input[id="+hiddenclassid+"]").val(mod_type)
     // $("input[id=classtype4"]").val(mod_type)
      return parseFloat(Math.round(price_mod * 100) / 100);

    }
  }
  catch(error)
  {}



}

function preset_orderline_addons(form_name, selected_options){
    alert('Im here');
}

function set_selected_option(form_name = '', option_extra_class_name = '', bl_bespoke = false){
    let all_selects = $(document).find('.tsg_option_class' + option_extra_class_name)
    let class_id = 0;

    let selected_option_values = [];
    let selected_value = 0;
    $.each(all_selects, function(key, value){
        class_id = $(value).data('selectclass');
        selected_value = $(value).val();
        if (selected_value > 0) {
            let new_select_used = {};
            let sel_str = '#option_select_' + selected_value
            let selected = $(sel_str)
            let class_data = getClassArray(class_id, bl_bespoke);
            let select_data = getOptionArray(class_id, selected_value, bl_bespoke);
            new_select_used['class_id'] = class_id;
            new_select_used['class_label'] = class_data['label'];
            new_select_used['value_id'] = selected_value;
            new_select_used['value_label'] = select_data['drop_down'];
            new_select_used['is_dynamic'] = select_data['is_dynamic'];
            new_select_used['addontype'] = selected.data('addontype');
            selected_option_values.push(new_select_used);
        }
    })

    $(form_name + ' #selected_option_values_frm').val(JSON.stringify(selected_option_values))
     console.log($(form_name + ' #selected_option_values_frm').val())
}



