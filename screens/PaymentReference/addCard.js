/**
 * Created by sumit on 22/10/16.
 */
var url = localStorage.getItem("hg_sc");
var savedCard;

function validateCard() {

    var cardData = {};
    var $cardinput = $('#cardnumber');

    $('#cardnumber').validateCreditCard(function(result) {
        if (result && result.card_type != null) {
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
function checkCardNumberLength(elem){
    if (elem && elem.value && elem.value.length > 16) {
        elem.value = elem.value.slice(0,16);
    }
}
// restrict user not to enter more than 4 digits in Cvv number
function checkCvvNumberLength(elem){
    if (elem && elem.value && elem.value.length > 4) {
        elem.value = elem.value.slice(0,4);
    }
}
function setMonthAndYear () {
    var monthString = '';
    var yearString = '';
    var Month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var Year = [];
    for (var i=0;i<Month.length;i++) {
        monthString += ("<option value='" + Month[i] + "'>" + Month[i] + "</option>");
    }
    $("#selectMonth").append(monthString);
    var initialYear = new Date().getFullYear();
    var finalYear = initialYear + 35;
    for(var i=initialYear;i<finalYear;i++){
        Year.push(i);
    }
    for (var i=0;i<Year.length;i++) {
        yearString += ("<option value='" + Year[i] + "'>" + Year[i] + "</option>");
    }
    $("#selectYear").append(yearString);
}


function scrollWindow() {
    $("body").addClass("body-flow");
}

$("#save-card").prop('checked',true);

$("#pay").click(function(){
    var data = {};
    data.cardNumber = $("#cardnumber").val();
    data.cvv = $("#cvv").val();
    data.cardHolder = $("#card-holder").val();
    data.remember_me = "YES";

    // validation
    if(!savedCard) {
        if(!$("#cardnumber").val()){
            $("#showErrMsg").html("Card number should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if ($("#cardnumber").val() && ($("#cardnumber").val()).length < 16) {
            $("#showErrMsg").html("Card number should not be less than 16 digits.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        if($("#selectMonth").val() == ''){
            $("#showErrMsg").html("Month should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if (($("#selectMonth").val() && $("#selectMonth").val().length != 2) || isNaN($("#selectMonth").val())){
            $("#showErrMsg").html("Enter a valid Month.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        if($("#selectYear").val() == ''){
            $("#showErrMsg").html("Year should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if(($("#selectYear").val() && $("#selectYear").val().length != 2) || isNaN($("#selectYear").val())){
            $("#showErrMsg").html("Enter a valid Year.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }

        if(!$("#cvv").val()){
            $("#showErrMsg").html("Cvv should not be empty.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        } else if ($("#cvv").val() && ($("#cvv").val()).length < 3) {
            $("#showErrMsg").html("Cvv number should not be less than 3 digits.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        if(!$("#card-holder").val()){
            $("#showErrMsg").html("Please enter cardholder name.");
            scrollWindow();
            $("#msgmodal").removeClass("hidden");
            $("body").addClass("body-flow");
            return;
        }
        data.expiry = data.expiry = $("#selectMonth").val() + '/' + ($("#selectYear").val()).substr(-2);
        if (data && data.cardNumber && data.expiry && data.cvv && data.cardHolder) {
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
                localStorage.setItem("addCard", newData);
                window.location.href = "/app/addCardCheckOut.html";
            }
        }
    }
});
// hide error modal
$("#hideerrorbox").click(function(){
    $("body").removeClass("body-flow");
    $("#msgmodal").addClass("hidden");
});


$(document).ready(function(){
    setMonthAndYear();
    validateCard();
});
