"use strict";
var charges = localStorage.getItem("addCard");
function payCharges(){
    console.log("INSIDE PAY CHARGES")
    localStorage.setItem("addCard", null);
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null') {
        var access_token, id, paramData;
        userData = JSON.parse(userData);
        udata = userData;
        access_token = udata.data.access_token;
        charges  = JSON.parse(charges);
        paramData = new FormData();
        //paramData.append("merchantId",id);
        localStorage.setItem('payment-appId',"addcard");
        paramData.Auth = udata.data.accessToken;
        paramData._method = "POST";
        paramData.append("cardHolderName",charges.cardHolder);
        paramData.append("cardNumber",charges.cardNumber);
        paramData.append("cardSecurityCode",charges.cvv);
        paramData.append("expiryDate",charges.expiry);
        paramData.append("remember_me", charges.remember_me);
        callApi.queryUrl(apiUrl + "/api/customer/addCard", paramData, function(err, response){
            if (!err && response) {
                response = JSON.parse(response);
                if(response.data && response.data.url) {
                    var url = response.data.url;
                    window.location.href = url;
                } else {
                    $('.showErrMsg').html('Url not found');
                    scrollWindow();
                    $('.msgmodal').removeClass('hidden');
                }
            } else if(!err) {
                payCharges();
            } else {
                $("#redirect").hide();
                $('.map-continue ').removeClass('hidden');
                callApi.error(err);
            }
        });



    }
}
// window.onbeforeunload = function() { return "You work will be lost."; };
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, null);
});

// hide error modal
$("#hideerrorbox").click(function(){
    $("#msgmodal").addClass("hidden");
});

$(document).ready(function(){
    var count = 0;
    count = count++;
    console.log("into paycharges",count);
    payCharges();
});
