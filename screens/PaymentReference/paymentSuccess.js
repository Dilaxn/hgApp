function getJobDetails () {
    var appointmentid = localStorage.getItem('payment-appId');
    //localStorage.setItem('payment-appId',null);
    // appointmentid = "addcard";
    if (appointmentid == "addcard") {
        $('.payment-success-txt').html("Your card payment of AED 1 has been successfully completed");
    } else {
        var data = new FormData();
        // udata = userData;
        data.Auth = udata.data.accessToken;
        data._method = "POST";
        data.append("appointmentId", appointmentid);
        callApi.queryUrl(apiUrl + "/api/customer/getJobDetails", data, function(err, results) {
            if (!err && results) {
                localStorage.setItem('payment-appId',null);
                var jobstatus = "",
                    params = {};
                var results = JSON.parse(results);
                if (results.data && results.data[0]) {
                    results = results.data[0];
                    if (results.status && (results.status == 'RATING' || results.status == 'ASSIGNED' || results.status == 'IN_SERVICE')) {
                        if ((results.status == 'RATING' && results.payment.payment_type == 'CARD') || ((results.status == 'ASSIGNED' || results.status == 'IN_SERVICE') && results.advance_payment.payment_type == 'CARD')) {
                            if (results.status == 'RATING') {
                                $('#show-amount').html((results.charges.finalCharges));
                            } else {
                                $('#show-amount').html((results.charges.advanceCharges));
                            }
                        }
                    }
                } else {
                    var err = JSON.parse(err);
                    callApi.error(err);
                }
            }
        });
    }


}
// window.onbeforeunload = function() { return "You work will be lost."; };
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});
$("document").ready(function(){
    if(localStorage.getItem("isMembershipPayment") !== "null" && localStorage.getItem("isMembershipPayment") === "true"){
        getMembershipDetails()
        localStorage.setItem("membershipSucess",true);
        localStorage.setItem("isMembershipPayment",null);
        if(localStorage.getItem("memberUrl") ==="booking"){
            $(".card-payment-footer").attr("onclick","window.location.href='/app/booking.html?service="+localStorage.getItem("categoryName")+"|"+localStorage.getItem("subCategoryName")+"'");
        }else{
            $(".card-payment-footer").attr("onclick","window.location.href='/'");
        }
    }else{
        getUserInfo();
        getJobDetails();
    }
});

function getMembershipDetails(){
    callApi.getUrl(apiUrl +'/api/webapi/getMembershipDetail',{}, function(err, result){
        if(!err && result){
            $("#show-amount").html(result.data[0].membership.price);
        }else{
            var err = JSON.parse(ercategories[k].whiteImage.originalr)
            showMessageToUser(err.message)
        }
    });
}
