"use strict";

var charges = localStorage.getItem("hg_cp");

function payCharges() {
    localStorage.setItem("hg_cp", null);
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null') {
        var access_token, id, paramData;
        userData = JSON.parse(userData);
        udata = userData;
        access_token = udata.data.access_token;
        console.log(charges)
        charges = JSON.parse(charges);
        id = (document.URL).split("=")[1];
        paramData = new FormData();
        paramData.append("merchantId", id);
        localStorage.setItem('payment-appId', id);
        paramData.Auth = udata.data.accessToken;
        paramData._method = "POST";
        if (charges.payId) {
            paramData.append("tokenName", charges.payId);
            paramData.append("id", charges.cvv);
            if (charges && charges.isWallet) {
                data.append(isWallet, true);
            }
            // $.getJSON('https://api.ipify.org?format=json', function (data) {
            //     paramData.append("ip", data.ip);
            callApi.queryUrl(apiUrl + "/api/customer/pay", paramData, function (err, response) {
                if (!err && response) {
                    response = JSON.parse(response);
                    if (response.data && response.data.url) {
                        var url = response.data.url;
                        //window.location.href = url;
                    } else {
                    }
                } else if (!err) {
                    var isInternetExist = checkInternet();
                    if (isInternetExist) {
                        payCharges();
                    } else {
                        $('#showErrMsg').html('Sorry,no Internet connectivity detected.Please reconnect and try again.');
                        scrollWindow();
                        $('#msgmodal').removeClass('hidden');
                        $("body").addClass("body-flow");
                        $('#msgmodal').modal("show");
                        window.location.href = "/"
                    }

                } else {
                    err = JSON.parse(err);
                    $("#redirect").hide();
                    $('.map-continue').removeClass('hidden');
                    $('#msgmodal').removeClass('hidden');
                    $('#showErrMsg').html(err.message);
                    $("body").addClass("body-flow");
                    $('#msgmodal').modal("show");
                    window.location.href = "/"
                }
            })

        } else if (localStorage.getItem("isMembershipPayment") === "true") {
            var data = new FormData();
            data.append("cardHolderName", charges.cardHolder);
            data.append("cardNumber", charges.cardNumber);
            data.append("cardSecurityCode", charges.cvv);
            data.append("expiryDate", charges.expiry);
            data.append("remember_me", charges.remember_me);
            if (userData && userData !== "null") {
                data.Auth = udata.data.accessToken;
            }
            data._method = "POST";
            data.append("price", parseInt(localStorage.getItem("planCharge")));
            callApi.queryUrl(apiUrl + "/api/customer/buyMembership", data, function (err, response) {
                if (!err && response) {
                    console.log("err", err, "res", response);
                    if (!err && response) {
                        response = JSON.parse(response);
                        if (response.data && response.data.url) {
                            var url = response.data.url;
                            window.location.href = url;
                        }
                    } else if (!err) {
                        var isInternetExist = checkInternet();
                        if (isInternetExist) {
                            payCharges();
                        } else {
                            $('#showErrMsg').html('Sorry,no Internet connectivity detected.Please reconnect and try again.');
                            scrollWindow();
                            $('#msgmodal').removeClass('hidden');
                            $("#msgmodal").modal("show");
                            $("body").addClass("body-flow");
                            localStorage.setItem("isMembershipPayment", null);
                            if (localStorage.getItem("memberUrl") === "booking") {
                                $(".card-payment-footer").attr("onclick", "window.location.href='/app/booking.html?service=" + localStorage.getItem("categoryName") + "|" + localStorage.getItem("subCategoryName") + "'");
                            } else {
                                $(".card-payment-footer").attr("onclick", "window.location.href='/'");
                            }
                        }
                    } else {
                        err = JSON.parse(err);
                        $("#redirect").hide();
                        $('.map-continue').removeClass('hidden');
                        $('#msgmodal').removeClass('hidden');
                        $('#showErrMsg').html(err.message);
                        $("#msgmodal").modal("show");
                        $("body").addClass("body-flow");
                        localStorage.setItem("isMembershipPayment", null);
                        if (localStorage.getItem("memberUrl") === "booking") {
                            $(".card-payment-footer").attr("onclick", "window.location.href='/app/booking.html?service=" + localStorage.getItem("categoryName") + "|" + localStorage.getItem("subCategoryName") + "'");
                        } else {
                            $(".card-payment-footer").attr("onclick", "window.location.href='/'");
                        }
                    }
                } else {
                    err = JSON.parse(err);
                    $('#showErrMsg').html(err.message);
                    $('#msgmodal').removeClass('hidden');

                    // let y =  "location.href=" +   `/en/${localStorage.getItem("current_City")}`;

                    $('#msgmodal').modal("show");
                    $("#hideerrorbox").attr("onclick", location.href = `/en/${localStorage.getItem("current_City")}`);
                }

            });
        } else {
            paramData.append("cardHolderName", charges.cardHolder);
            paramData.append("cardNumber", charges.cardNumber);
            paramData.append("cardSecurityCode", charges.cvv);
            paramData.append("expiryDate", charges.expiry);
            paramData.append("remember_me", charges.remember_me);
            if (charges && charges.isWallet) {
                paramData.append("isWallet", true);
            }
            // $.getJSON('https://api.ipify.org?format=json', function (data) {
            //     paramData.append("ip", data.ip);
            callApi.queryUrl(apiUrl + "/api/customer/paymentDetails", paramData, function (err, response) {
                if (!err && response) {
                    response = JSON.parse(response);
                    if (response.data && response.data.url) {
                        var url = response.data.url;
                        window.location.href = url;
                    } else {
                        $('#showErrMsg').html('Url not found');
                        scrollWindow();
                        $('.map-continue').removeClass('hidden');
                        $('#msgmodal').removeClass('hidden');
                        $('#msgmodal').modal("show");
                        $("body").addClass("body-flow");
                        window.location.href = "/"
                    }
                } else if (!err) {
                    payCharges();
                } else {
                    err = JSON.parse(err);
                    $("#redirect").hide();
                    $('#showErrMsg').html(err.message);
                    $('.map-continue').removeClass('hidden');
                    $('#msgmodal').removeClass('hidden');
                    $('#msgmodal').modal("show");
                    $("body").addClass("body-flow");
                    //callApi.error(err);
                    window.location.href = "/"
                }
            });
            //});

        }
    }
}

// window.onbeforeunload = function() { return "You work will be lost."; };
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, null);
});

// hide error modal
$("#hideerrorbox").click(function () {
    $("#msgmodal").addClass("hidden");
});

$(document).ready(function () {
    var count = 0;
    count = count++;
    payCharges();
});
