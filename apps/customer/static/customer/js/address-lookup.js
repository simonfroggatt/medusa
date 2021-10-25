$(function() {

    var lookupFn = function() {
        //$("#addressLookup").keyup(function () {
            let inputVal = this.value;
            if (inputVal.length > 3) {
                lookUPAddress(inputVal);

                //  findAddress();
                // getAddress("asdasd");
                // retrieveAddress("GE22-EN14-WD26-TD79","GB|RM|A|5046469")
            }

       // });
    }

    function lookUPAddress(inputVal) {
        var Key = "GE22-EN14-WD26-TD79",
            IsMiddleware = false,
            Origin = "",
            Countries = "GBR",
            Limit = "10",
            Language = "en-gb",
            url = 'https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.10/json3.ws';
        //url = 'https://api.addressy.com/Capture/Interactive/Find/v1.1/'
        var Container = "";

        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {
                Key: encodeURIComponent(Key),
                Text: encodeURIComponent(inputVal),
                IsMiddleware: encodeURIComponent(IsMiddleware),
                Countries: encodeURIComponent(Countries),
                Limit: encodeURIComponent(Limit),
                Container: encodeURIComponent(Container),
                Origin: encodeURIComponent(Origin),
                Language: encodeURIComponent(Language)
            },

            success: function (response, statusText, resObject) {

                let addressLists = response['Items'];
                if (addressLists.length > 0) {
                     $("#addressList").empty();
                     var list = document.getElementById('addressLookup');
                     //list.options.length = 0;
                    $.each(addressLists, function (key, value) {
                        var option = document.createElement("option");
                        option.setAttribute("data-value", value.Id)
                        option.setAttribute("value", value.Text + " " + value.Description)
                        option.text = value.Text + " " + value.Description;
                        list.appendChild(option);
                        console.log(value);
                    });
                }
            }
        });


        console.log(inputVal);
    }

     $("#addressLookup").keyup(lookupFn);

})

