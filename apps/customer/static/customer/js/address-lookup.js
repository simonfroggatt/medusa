

let TSGAddressLookup = function (inputFieldName, outputSelectName, fieldsToMatch, hiddenSection) {

    let TSGlookup = this;
    let inputField = [];
    let outputSelect = '';
    let minChars = 3;
    let fieldsMatch = {};

    let currentSelectID = '';


    this.constructor = function (inputField, outputSelect, fieldsMatch, hiddenDiv = '') {
        TSGlookup.inputField = inputField
        TSGlookup.outputSelect = outputSelect
        TSGlookup.minChars = 3;
        TSGlookup.fieldsMatch = fieldsMatch;
        TSGlookup.hiddenDiv = hiddenDiv;
        let blOutputSet = TSGlookup.outputSelect.length > 0  //check if an output ID was passed in. If not use the input fields and attach
        initUI(blOutputSet)
    };

    var newLookup = function(){
        return 'fred'
    }

    let initUI = function (blOutputSet) {
        let minChars = TSGlookup.minChars
        $.each(TSGlookup.inputField, function (key, value) {
            $(value).on('keyup', function () {
                let inputVal = this.value;
                if (inputVal.length >= TSGlookup.minChars) {

                    if (blOutputSet) {
                        setupSelectClick();
                    } else {
                        setupSelector(this.id);
                    }
                    findAddress(inputVal, '');
                }
            })
        })


    };

    let setupSelector = function (selectorID) {
        $.each(TSGlookup.inputField, function (key, value) {
            if (selectorID != value.substring(1)) {

                let oldselector = '#addresslist-' + value.substring(1) + '-results'
                if ($(oldselector).length) {
                    $(oldselector).remove()
                }
            }
        })
        let newselector = '#addresslist-' + selectorID + '-results'
        let blSelectExists = $(newselector).length;
        if (!$(newselector).length) {
            createSelect(selectorID);
        }

    }

    let createSelect = function (selectorID) {
        let currentSelectID = 'addresslist-' + selectorID + '-results';
        let selectMarkup = '<select id="' + currentSelectID + '" size="5" class="col-12" ></select>'
        TSGlookup.outputSelect = '#' + currentSelectID;
        $(selectMarkup).insertAfter('#' + selectorID);
        setupSelectClick()

    }

    let setupSelectClick = function () {
        $(TSGlookup.outputSelect).on('change', function () {
            let address_id = $(this).children(":selected").attr("data-value");
            let address_type = $(this).children(":selected").attr("data-type");
            let search_text = $(this).children(":selected").attr("data-text");
            switch (address_type) {
                case 'Address' :
                    $(TSGlookup.outputSelect).addClass('d-none');
                    getAddress(address_id);
                    break;
                default:
                    findAddress(search_text, address_id);
                    break;

            }

        });
    }

    let findAddress = function (inputVal, container = '') {
        let Key = "HB52-EE72-DF77-GG96",
            IsMiddleware = true,
            Countries = "GB, IE",
            Limit = "10",
            Language = "en-gb",
            url = 'https://api.addressy.com/Capture/Interactive/Find/v1.1/json3.ws';

        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {
                Key: Key,
                Text: inputVal,
                IsMiddleware: IsMiddleware,
                Countries: Countries,
                Limit: Limit,
                Container: container,
                Language: Language
            },

            success: function (response, statusText, resObject) {

                let addressLists = response['Items'];
                if (addressLists.length == 1) {  //this might be a postcode
                    let single_address = addressLists[0];
                    if (single_address.Type == 'Postcode') {
                        //re-call and get the list of address for this postcode
                        findAddress(single_address.Text, single_address.Id)
                    } else if (single_address.Type == 'Address') {  //might be a single address
                        createAddressList(addressLists);
                    }
                } else if (addressLists.length > 0) {
                    createAddressList(addressLists)
                }
                ;
            }
        });
        console.log(inputVal);
    }

    let createAddressList = function (addressList) {
        let address_list = "";

        //let list = document.getElementById(TSGlookup.outputSelect);
        $(TSGlookup.outputSelect).empty();
        $.each(addressList, function (key, value) {

            var option = document.createElement("option");
            option.setAttribute("data-value", value.Id)
            option.setAttribute("data-type", value.Type)   //BuildingName, Postcode, Address
            option.setAttribute("data-text", value.Text)   //BuildingName, Postcode, Address
            option.setAttribute("value", value.Text + " " + value.Description)
            option.text = value.Text + " " + value.Description;
            $(TSGlookup.outputSelect).append(option);

        });
        $(TSGlookup.outputSelect).removeClass('d-none');
    };

    let getAddress = function (addressID) {
        let Key = "HB52-EE72-DF77-GG96",
            url = 'https://api.addressy.com/Capture/Interactive/Retrieve/v1.2/json3.ws';

        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {
                Key: Key,
                Id: addressID
            },

            success: function (response, statusText, resObject) {
                let addressDetailsItems = response['Items'];
                if (addressDetailsItems.length == 1) {
                    let addressDetails = addressDetailsItems[0];
                    //reset all the fields
                    $.each(TSGlookup.fieldsMatch, function (key, value) {
                        let fieldID = '#' + value;
                        $(fieldID).val('');
                    })

                    $.each(TSGlookup.fieldsMatch, function (key, value) {
                        let fieldID = '#' + value;
                        let fieldObj = $(fieldID);

                        let addressDetailsValue = addressDetails[key];

                        if(addressDetailsValue.length > 0) {
                            if(fieldObj.is("input") || fieldObj.is("textarea")) {
                                let currentVal = $(fieldID).val()
                                if (currentVal.length > 0) {
                                    currentVal += '\r';
                                }

                                if(addressDetailsValue.length > 0){
                                    currentVal += addressDetailsValue;
                                    fieldObj.val(currentVal);
                                }
                                //check if area is empty


                            }
                            if(fieldObj.is("select")) {
                                if(addressDetailsValue.length > 0){
                                    let currentVal = parseInt(addressDetailsValue);
                                    fieldObj.val(addressDetailsValue);
                                }

                            }
                        }
                    })
                    if(addressDetails['ProvinceName'].length <= 0){
                        let area_fld_id = TSGlookup.fieldsMatch['ProvinceName'];
                        let fieldObj = $('#'+area_fld_id);
                        let city_text = addressDetails['City']
                        fieldObj.val(city_text);
                    }
                }

            //now show the hidden
                $(TSGlookup.hiddenDiv).removeClass('d-none');
                $.each(TSGlookup.inputField, function (key, value) {
                    $(value).attr('required', false);
                });
            },
        });
    };

    this.constructor(inputFieldName, outputSelectName, fieldsToMatch, hiddenSection)

};
