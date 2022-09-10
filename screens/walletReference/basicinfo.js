/**
 * Created by sumit on 13/10/16.
 */
var params = {}, date, newNumber = "", existingNumber = "", newSecondaryPhoneNumber = "",
    existingSecondaryPhoneNumber = "";


function updateProfile() {
    var data = new FormData();

    params.name = $("#name").val();
    params.countryCode = "+971";
    params.phoneNo = $("#phoneNo").val();
    newNumber = params.phoneNo;

    params.secondaryPhoneNumber = $("#secondaryPhoneNumber").val();
    newSecondaryPhoneNumber = params.secondaryPhoneNumber;

    params.language = $("#language").val();
    var dob = $("#dob").val();
    dob = dob.split("/");
    dob[3] = dob[2];
    dob[2] = dob[0];
    dob[0] = dob[3];
    dob.pop();
    dob = dob.join("/");
    params.dob = new Date(dob);

    params.nationality = $("#nationality").val();
    params.otp = $("#enterphoneOTP").val();
    params.secondaryOTP = $("#enterSecondaryPhoneOTP").val();

    if (!params.name) {
        $.growl.error({message : "Please enter your name"});
        return;
    }

    if (!params.language) {
        $.growl.error({message : "Language cannot be empty"});
        return;
    }
    if (!params.dob) {
        $.growl.error({message : "Please enter your DOB"});
        return;
    }
    if (!params.nationality) {
        $.growl.error({message : "Please enter your nationality"});
        return;
    }
    if (existingNumber !== newNumber && !params.otp) {
        $.growl.error({message: "Please enter OTP to update phoneNo"});
        return;
    }

    if (existingSecondaryPhoneNumber !== newSecondaryPhoneNumber && !params.secondaryOTP) {
        $.growl.error({message: "please enter OTP to update secondary phone number"});
        return;
    }
    if ($("#file-input").prop("files") && $("#file-input").prop("files")[0]) {
        data.append("profilePic", $("#file-input").prop("files")[0]);
        $("#user-img").html($("#file-input").prop("files")[0]);
    }
    $.LoadingOverlay("show");
    data.append("name",params.name);
    data.append("countryCode",params.countryCode);
    if (existingNumber !== newNumber && params.otp) {
        data.append("phoneNo", params.phoneNo);
        data.append("otp", params.otp)
    }

    if (existingSecondaryPhoneNumber !== newSecondaryPhoneNumber && params.secondaryOTP) {
        data.append("secondaryPhoneNumber", params.secondaryPhoneNumber);
        data.append("otp", params.secondaryOTP)
    }

    data.append("language",params.language);
    data.append("dob",params.dob);
    data.append("nationality", params.nationality);
    data._method = "PUT";
    data.Auth = udata.data.accessToken;
    callApi.queryUrl(apiUrl + "/api/customer/updateProfile", data, function(err, response){
        if (!err && response){
            $.growl.notice({message : msg.MESSAGE_PROFILE_UPDATE});
            localStorage.setItem("h_user",response);
            var data  = JSON.parse(response);
            $("#otpdiv").addClass("hidden");
            $("#secotpdiv").addClass("hidden");
            $("#secondaryPhoneNumber").prop("disabled", false);
            $("#phoneNo").prop("disabled", false);
            updateUserDetails();
            goToURL('/app/basicinfo.html');
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });
    
}

function updateUserDetails() {
    var userinfo = localStorage.getItem("h_user");
    // console.log(userinfo)
    if (userinfo && userinfo !== "null") {
        userinfo = JSON.parse(userinfo);
        userinfo = userinfo.data.userDetails;
        $.LoadingOverlay("show");
        if (userinfo.profilePicURL && userinfo.profilePicURL.thumbnail) {
            $("#user-img").attr("src",userinfo.profilePicURL.thumbnail);
        } else {
            $("#user-img").attr("src","../app/images/genieicon.png");
        }
        date = new Date(userinfo.dob).toISOString();
        date = date.split("T")[0].split('-').reverse().join('-');
        var prevdate = date.split("T")[0].split('-').join('/');
        $("#name").val(userinfo.name);
        $("#countryCode").val(userinfo.countryCode);
        $("#phoneNo").val(userinfo.phoneNo);
        existingNumber = userinfo.phoneNo;

        $("#secondaryPhoneNumber").val(userinfo.secondaryPhoneNumber);
        existingSecondaryPhoneNumber = userinfo.secondaryPhoneNumber;


        $("#language").val(userinfo.language);
        $("#dob").val(prevdate);
        $("#nationality").val(userinfo.nationality);
        $("#email").val(userinfo.email);
        $.LoadingOverlay("hide", true);
        $( "#dob" ).datepicker({
            maxDate:1,
            minDate:new Date(1900, 1 - 1, 1),
            changeMonth: true,
            changeYear: true,
            yearRange:"-100:+0",
            onSelect:function(){
                var dob = ($("#dob").datepicker("getDate"));
                date = new Date(dob).toISOString();
                dob = (new Date(dob).toLocaleString()).split(",")[0];
                dob = dob.split("/").join("-");
                dob[4] = dob[1];
                dob[1] = dob[2];
                dob[2] = dob[4];

                console.log(dob)
                dob = dob.split("-").join("/");
                $("#dob").val(dob);
            }
        }); 
    } else {
        window.location.href = "/";
    }
}

$("#phoneNo").on("keyup", function (){
    let phoneNo = $("#phoneNo").val();
    $("#secondaryPhoneNumber").prop("disabled", true);
    if (phoneNo.length === 9) {
        $("#otpdiv").removeClass("hidden");
        $("#secotpdiv").addClass("hidden");
    }
});

$("#secondaryPhoneNumber").on("keyup", function () {
    let phoneNo = $("#secondaryPhoneNumber").val();
    $("#phoneNo").prop("disabled", true);
    if (phoneNo.length === 9) {
        $("#secotpdiv").removeClass("hidden");
        $("#otpdiv").addClass("hidden");
    } else { //for the first empty entry - enter 9 digits - remove a digit - result: 8 digits, this should hide the below block
        $("#secotpdiv").addClass("hidden");
    }
});

function verifyOTP() {
    $.LoadingOverlay("show");
    var data = new FormData();
    data.append("OTP",$("#otpphone").val());
    data._method = "PUT";
    data.Auth = udata.data.accessToken;
    callApi.queryUrl(apiUrl + "/api/customer/OTPUpdatePhoneNo", data, function(err, response){
        if (!err && response) {
            var updatephone = JSON.parse(localStorage.getItem("h_user"));
            updatephone.data.userDetails.phoneNo = (JSON.parse(response)).data.phoneNo;
            localStorage.setItem("h_user",JSON.stringify(updatephone));
            $.LoadingOverlay("hide", true);
            updateUserDetails();
            $("#otp-verification").modal('hide');
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });
}

function resendOTP(phoneType) {
    var data = new FormData();
    data.Auth = udata.data.accessToken;
    data._method = "PUT";

    if (phoneType === 'primaryPhone') {
    data.append ("phoneNo", $("#phoneNo").val());
    } else if (phoneType === 'secondaryPhone') {
        data.append("secondaryPhoneNumber", $("#secondaryPhoneNumber").val());
    }

    data.append ("countryCode", "+971");
    callApi.queryUrl(apiUrl + "/api/customer/resendOTPToNewNumber",data, function(err, results){
        if (!err) {
            $.growl.notice({message : "OTP sent"});
        } else {
            $.growl.error({message: "Failed to send OTP"});
        }
    });
}

$('#file-input').change( function(event) {
    $("#user-img").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
});
function getWallet() {
    // var apiUrl = 'https://dev.api.homegenie.com'
    var params = {};
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null') {
        udata = JSON.parse(userData);
        updateUserInfo(udata);
    } else {
        window.location.href = "/";
    }
    params.Auth = udata.data.accessToken;
    $.LoadingOverlay("show");
    params.Auth = udata.data.accessToken;
    callApi.getUrl(apiUrl + "/api/customer/getWallet", params, function(err, result){
        if (!err && result) {
            console.log('azar getWallet',result);
        } else {
            callApi.error(err);
        }
    });
}

$(document).ready(function(){
    $("#update-profile").click(function(){
        updateProfile();
    });
    updateUserDetails();
    getWallet();
});