/**
 * Created by sumit on 22/10/16.
 */
var url = localStorage.getItem("hg_sc");
var savedCard;
url = JSON.parse(url);
if (url && url.payId) {
    savedCard = url;
    url = url.appointmentID;
    $("#expiry-date").parent().addClass("hidden");
    $("#card-holder").parent().addClass("hidden");
    $("#save-card").parent().addClass("hidden");
    $("#cardnumber").val(savedCard.card);
    $("#cvv-label").addClass("cvv-saved-card");
    $("#payment").addClass("saved-card-payment");
    $("#cardnumber").attr("disabled", "disabled");
}


function getJobDetails() {
    var udata, rememberCard;
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null') {
        udata = JSON.parse(userData);
    }
    var data = new FormData();
    data.Auth = udata.data.accessToken;
    data._method = "POST";
    data.append("appointmentId", url.appointmentID);
    callApi.queryUrl(apiUrl + "/api/customer/getJobDetails", data, function (err, results) {
        if (!err && results) {
            results = JSON.parse(results);
            results = results.data[0];
            if (results.charges && results.charges.advanceCharges && (results.status == "ASSIGNED" || results.status == "INSPECTION")) {
                if (results.charges.estimateCharges == results.charges.advanceCharges) {
                    if (results.walletDeductAmount) {
                        $("#payment-aed").html("AED " + (results.charges.vatFinalCharges - results.walletDeductAmount).toFixed(2));
                    } else {
                        $("#payment-aed").html("AED " + results.charges.vatFinalCharges.toFixed(2));
                    }

                } else {
                    if (results.walletDeductAmount) {
                        $("#payment-aed").html("AED " + (results.charges.advanceCharges - results.walletDeductAmount).toFixed(2));
                    } else {
                        $("#payment-aed").html("AED " + results.charges.advanceCharges.toFixed(2));
                    }
                }
            } else if (results.status == "PAYMENT_PENDING" || results.status == "REJECTED" || results.status == "CANCELLED" || results.status == "EXPIRED") {
                if (results.walletDeductAmount) {
                    $("#payment-aed").html("AED " + (results.charges.finalCharges - results.walletDeductAmount).toFixed(2));
                } else {
                    $("#payment-aed").html("AED " + results.charges.finalCharges.toFixed(2));
                }
            }
            validateCard();
            $.LoadingOverlay("hide", true);
        }
    });
}

function validateCard() {

    var cardData = {};
    var $cardinput = $('#cardnumber');

    $('#cardnumber').validateCreditCard(function (result) {
        if (result.card_type != null) {
            switch (result.card_type.name) {
                case "visa":
                    $(".cardicon").html("<i class='fa fa-2x fa-cc-visa'></i>");
                    break;

                case "visa_electron":
                    $(".cardicon").html("<i class='fa fa-2x fa-cc-visa'></i>");
                    break;

                case "mastercard":
                    $(".cardicon").html("<i class='fa fa-2x fa-cc-mastercard'></i>");
                    break;

                case "maestro":
                    $(".cardicon").html("<i class='fa fa-2x fa-cc-maestro'></i>");
                    break;

                case "discover":
                    $(".cardicon").html("<i class='fa fa-2x fa-cc-discove'></i>");
                    break;

                case "amex":
                    $(".cardicon").html("<i class='fa fa-2x fa-cc-amex'></i>");
                    break;

                default:
                    $(".cardicon").html("<i class='fa fa-2x fa-credit-card'></i>");
                    break;
            }
        } else {
            $(".cardicon").html("<i class='fa fa-2x fa-credit-card'></i>");
        }
    });

}
// restrict user not to enter more than 16 digits in card number
function checkCardNumberLength(elem) {
    if (elem.value.length > 16) {
        elem.value = elem.value.slice(0, 16);
    }
}
// restrict user not to enter more than 4 digits in Cvv number
function checkCvvNumberLength(elem) {
    if (elem.value.length > 4) {
        elem.value = elem.value.slice(0, 4);
    }
}

function setMonthAndYear() {
    var monthString = '';
    var yearString = '';
    var Month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var Year = [];
    for (var i = 0; i < Month.length; i++) {
        monthString += ("<option value='" + Month[i] + "'>" + Month[i] + "</option>");
    }
    $("#selectMonth").append(monthString);
    var initialYear = new Date().getFullYear();
    var finalYear = initialYear + 35;
    for (var i = initialYear; i < finalYear; i++) {
        Year.push(i);
    }
    for (var i = 0; i < Year.length; i++) {
        yearString += ("<option value='" + Year[i] + "'>" + Year[i] + "</option>");
    }
    $("#selectYear").append(yearString);
}

function scrollWindow() {
    $("body").addClass("body-flow");
}

var checked;
$("#save-card").click(function () {
    if (checked) {
        $(this).prop('checked', false);
        checked = false;
    } else {
        $(this).prop('checked', true);
        checked = true;
    }
});

$("#pay").click(function () {
    var data = {};
    data.cardNumber = $("#cardnumber").val();
    data.cvv = $("#cvv").val();
    data.cardHolder = $("#card-holder").val();
    if (checked) {
        data.remember_me = "YES";
    } else {
        data.remember_me = "NO";
    }
    // validation
    if (!savedCard) {
        if (!$("#cardnumber").val()) {
            $("#showErrMsg").html("Card number should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if (($("#cardnumber").val()).length != 16) {
            $("#showErrMsg").html("Card number should be equal to 16 digits.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        if ($("#selectMonth").val() == '') {
            $("#showErrMsg").html("Month should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if ($("#selectMonth").val().length != 2 || isNaN($("#selectMonth").val())) {
            $("#showErrMsg").html("Enter a valid Month.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        if ($("#selectYear").val() == '') {
            $("#showErrMsg").html("Year should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if ($("#selectYear").val().length != 2 || isNaN($("#selectYear").val())) {
            $("#showErrMsg").html("Enter a valid Year.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }

        if (!$("#cvv").val()) {
            $("#showErrMsg").html("Cvv should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if (($("#cvv").val()).length < 3) {
            $("#showErrMsg").html("Cvv number should not be less than 3 digits.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        if (!$("#card-holder").val()) {
            $("#showErrMsg").html("Please enter cardholder name.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        data.expiry = data.expiry = $("#selectMonth").val() + '/' + ($("#selectYear").val()).substr(-2);
        if (data.cardNumber && data.expiry && data.cvv && data.cardHolder) {
            if (data.expiry) {
                var exp = data.expiry;
                var temp;
                exp = data.expiry.split('/');
                temp = exp[0];
                exp[0] = exp[1];
                exp[1] = temp;
                exp = exp[0] + '/' + exp[1];
                data.expiry = exp.split("/").join("");
                var newData = JSON.stringify(data);
                localStorage.setItem("hg_cp", newData);
                if (localStorage.getItem("isMembershipPayment") === "true") {
                    window.location.href = "/app/userCheckOut.html"
                } else {
                    window.location.href = "/app/userCheckOut.html?id=" + url.appointmentID;
                }
            }
        }
    } else {
        if (!$("#cvv").val()) {
            $("#showErrMsg").html("Cvv should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if (($("#cvv").val()).length < 3) {
            $("#showErrMsg").html("Cvv number should not be less than 3 digits.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        if (data && data.cardNumber && data.cvv) {
            data.payId = savedCard.payId;
            var newData = JSON.stringify(data);
            localStorage.setItem("hg_cp", newData);
            window.location.href = "/app/userCheckOut.html?id=" + url;
        }
    }
});

// hide error modal
$("#hideerrorbox").click(function () {
    $("body").removeClass("body-flow");
    $("#msgmodal").addClass("hidden");
});


$(document).ready(function () {
    $.LoadingOverlay("show");
    setMonthAndYear();

    cardDetails = JSON.parse(localStorage.getItem('hg_sc'));
    let isSavedCard = localStorage.getItem("isSavedCard");
    $('#showExpiry').removeClass('hidden');
    if (isSavedCard && isSavedCard === 'true' && cardDetails && cardDetails !== 'null') {
        $('#showExpiry').addClass('hidden');
        $("#showExpiry").remove();
        $(".modal-cvv-apcard").addClass("savedCardCss");
        $("#pay").addClass("savedCardCssPay");
        // if(cardDetails.card){
        //     $(".modal-form-group-head-box1[name='cardNumber']").attr("placeholder",cardDetails.card);
        // }
        // console.log("CARDDETAILS : ", cardDetails);
        if (cardDetails.digit) {
            $('#saveCardNum').val(cardDetails.digit);
        }
        // validateCard();
        if (cardDetails.icon) {
            $('.cardicon i').addClass(cardDetails.icon);
        }
    } else {
        $('#showExpiry').removeClass('hidden');
    }
    localStorage.setItem('payfortData', null);

    var payment;
    if (localStorage.hg_p) {
        payment = JSON.parse(localStorage.hg_p);
    }

    if (localStorage.getItem("isMembershipPayment") == "true") {
        if (localStorage.getItem("planCharge") && localStorage.getItem("planCharge") != "null") {
            $("#showAmount, #showAmountSaveCard, #payment-aed").html('AED ' + localStorage.getItem("planCharge"));
        } else {
            getMembershipDetails();
        }
    } else {
        getJobDetails();
        $("#showAmount").html('AED ' + payment.a);
        $("#payment-aed").html('AED ' + payment.a);
    }
});


function getMembershipDetails() {
    callApi.getUrl(apiUrl + '/api/webapi/getMembershipDetail', {}, function (err, result) {
        if (!err && result) {
            if (result.data && result.data[0] && result.data[0].membership && result.data[0].membership.price) {
                membershipDetails = result.data[0].membership;
                $(".membership-price").html(result.data[0].membership.price);
                localStorage.setItem("planCharge", result.data[0].membership.price);
                $("#showAmount, #showAmountSaveCard, #payment-aed").html('AED ' + result.data[0].membership.price);
            } else {
                showMessageToUser("Sorry, We are not able to get the membership data right now, please try again late!")
            }
        } else {
            var err = JSON.parse(err)
            showMessageToUser(err.message)
        }
    });
}