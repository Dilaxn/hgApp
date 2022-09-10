/**
 * Created by harish on 19/1/17.
 */
var statusCode = {
    "00":"Invalid Request.",
    "01":"Order Stored.",
    "02":"Authorization Success.",
    "03":"Authorization Failed.",
    "04":"Capture Success.",
    "05":"Capture Failed.",
    "06":"Refund Success.",
    "07":"Refund Failed.",
    "08":"Authorization Voided Successfully.",
    "09":"Authorization Void Failed.",
    "10":"Incomplete.",
    "11":"Check status failed.",
    "12":"Check Status success.",
    "13":"Purchase failure.",
    "14":"Your transaction has been successfully placed.",
    "15":"Uncertain transaction.",
    "17":"Tokenization failed.",
    "18":"Tokenization success.",
    "19":"Transaction pending.",
    "20":"On Hold.",
    "21":"SDK Token creation failure.",
    "22":"SDK Token creation success.",
    "23":"Failed to process Digital Wallet service",
    "24":"Digital wallet order processed successfully",
    "27":"Check card balance failed",
    "28":"Check card balance success",
    "29":"Redemption failed",
    "30":"Redemption success",
    "31":"Reverse Redemption transaction failed",
    "32":"Reverse Redemption transaction success",
    "40":"Transaction In review",
    "42":"currency conversion success",
    "43":"currency conversion failed",
    "46":"Bill creation success",
    "47":"Bill creation failed"
};
var udata;

function getPaymentStatus() {
    var data = decodeURI(document.URL);
    data = data.split("?")[1];
    data = data.split("&");
    var responseCode = data[data.length-1];
    responseCode = responseCode.split("=")[1];
    var appointmentId = (data[17]).split("=")[1];
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null') {
        udata = JSON.parse(userData);
        updateUserInfo(udata);
        if (responseCode) {
            $(".transaction-status").html(statusCode[responseCode]);
            // (x.split("?")[1]).split("&")[17]
            updatePaymentStatusAndJobStatus(appointmentId, "PAID", "RATING");
        } else {
            updatePaymentStatusAndJobStatus(appointmentId, "PENDING");
            $(".transaction-status").html("Something went wrong. Please try again.");
        }
    } else {
        window.location.href = "/";
    }
}

callApi.putUrls = function (url, body, resultCallback) {
    body = body || {};
    // body._method = body._method || 'GET';
    $.ajax({
        "async": true,
        "crossDomain": true,
        type: 'PUT',
        url: url,
        data: JSON.stringify(body),
        contentType: 'application/json',
        beforeSend : function( xhr ) {
            if (body) {
                xhr.setRequestHeader( "authorization", "Bearer " + udata.data.accessToken);
            }
        },
        success: function (data) {
            resultCallback(null, data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var err = jqXHR.responseText;
            resultCallback(err);
        }
    });
};

function updatePaymentStatusAndJobStatus(appointmentid, paymentstatus, jobstatus) {
    var data = new FormData();
    data.Auth = udata.data.accessToken;
    data._method = "POST";
    data.append("appointmentId", appointmentid);
    callApi.queryUrl(apiUrl + "/api/customer/getJobDetails", data, function(err, results){
        if (!err) {
            var jobstatus = "", params = {};
            var results = JSON.parse(results);
            results = results.data[0];
            if (results.charges.unitCharges == 0 && results.status == "INSPECTION" || results.status == "REESTIMATE" ) {
                params.paymentPlan = "ADVANCE";
                jobstatus = "IN_SERVICE";
            } else if (results.status == "ASSIGNED" && results.charges.unitCharges > 0) {
                params.paymentPlan = "ADVANCE";
                jobstatus = "ASSIGNED";
            } else if (results.status == "PAYMENT_PENDING") {
                jobstatus = "RATING";
            }
            
            params.appointmentId = appointmentid;
            params.paymentStatus = paymentstatus;
            if (jobstatus) {
                params.jobType = jobstatus;
            }
            console.log(params);
            callApi.putUrls(apiUrl + "/api/customer/changePaymentStatus/", params, function(err, results){
                if (!err) {
                    console.log(results);
                }
            });
        }
    });
    
}

$(document).ready(function(){
   getPaymentStatus();
});
