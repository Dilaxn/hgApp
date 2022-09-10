/**
 * Created by sumit on 28/10/16.
 */
var udata;
var savedcards = {
    "statusCode":200,
    "message":"Success",
    "data":{
        "cards":[
            {
                "payfortId" : "bhe3452ws",
                "Digit" : "443913******0991",
                "_id":"789joijoil8485"
            },
            {
                "payfortId" : "bhe3452ws",
                "Digit" : "548913******0991",
                "_id":"789joijoil8485"
            },
            {
                "payfortId" : "bhe3452ws",
                "Digit" : "346913******0991",
                "_id":"789joijoil8485"
            }
        ]
    }
};
var cardIdd;

function getCardDetails(){
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
    callApi.getUrl(apiUrl + "/api/customer/getAllMyCard", params, function(err,results){
        if(!err){
            var data = savedcards, html, cardArray = [];
            var cardNo = results.data.cards;
            if (cardNo.length > 0) {
                data.cards = results.data.cards;
                for (var k in data.cards) {
                    var cardData = {};
                    cardData["_id"] = data.cards[k]["_id"];
                    cardData["payfortId"] = data.cards[k]["payfortId"];
                    cardData["Digit"] = data.cards[k]["Digit"];
                    $('#checkout_card_number').val(cardData["Digit"]);
                    var $cardinput = $('#checkout_card_number');

                    $('#checkout_card_number').validateCreditCard(function(result) {
                        //console.log(result);
                        if (result.card_type != null)
                        {
                            switch (result.card_type.name)
                            {
                                case "visa":
                                    cardData["icon"] = "fa fa-cc-visa";
                                    break;

                                case "visa_electron":
                                    cardData["icon"] = "fa fa-cc-visa";
                                    break;

                                case "mastercard":
                                    cardData["icon"] = "fa fa-cc-mastercard";
                                    break;

                                case "maestro":
                                    cardData["icon"] = "fa fa-cc-maestro";
                                    break;

                                case "discover":
                                    cardData["icon"] = "fa fa-cc-discover";
                                    break;

                                case "amex":
                                    cardData["icon"] = "fa fa-cc-amex";
                                    break;

                                default:
                                    $cardinput.css('background-position', '3px 3px');
                                    break;
                            }
                        } else {
                            $cardinput.css('background-position', '3px 3px');
                        }
                    });
                    cardArray.push(cardData);
                }
                console.log(cardArray);
                data.cards = cardArray;
                html = Mustache.render(savedCard_template, data);
                $("#savedcards").html(html);
                $.LoadingOverlay("hide", true);
            } else {
               // $("#savedcards").html("<p class='text-center' style='font-size:20px;color:#a2a2a2;'>You don't have any card saved.</p>");
                $.LoadingOverlay("hide", true);
            }
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });
}

function deleteSavedCards() {
    console.log("into delete saved cards",cardIdd);
    var data = new FormData();
    data.append("cardId",cardIdd);
    data.Auth = udata.data.accessToken;
    data._method = "PUT";
    $.LoadingOverlay("show");
    callApi.queryUrl(apiUrl + "/api/customer/deleteCards", data,function(err, results){
        if (!err) {
            location.reload();
            getCardDetails();
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });
}

function updateDefaultCard(id) {
    var data = new FormData();
    data.append("cardId", id);
    data._method = "PUT";
    $.LoadingOverlay("show");
    callApi.queryUrl(apiUrl + "/api/customer/setDefaultCard", data, function(err, results){
        if (!err) {
            $.LoadingOverlay("hide", true);
            $.growl.notice({message : "You have set your default card"});
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });
}
function scrollWindow() {
    $("body").addClass("body-flow");
}
// confirm to add saved card
function confirmAddCard() {
    $('#confirmAddCard').modal('show');
}
// on clicking delete card shows confiramtion popup
function deleteCard(id) {
    console.log("into delete saved cards",id);
   deleteCardId = id;
   cardIdd = id;
   $("#reviewCard").click();
}
$(document).ready(function(){
    getCardDetails();
    $("#updateDefaultcard").click(function(){
        var cardid = $(this).attr("data-id");
        updateDefaultCard(cardid);
    });
});

var savedCard_template1 =
    '{{#cards}}<div class="col-xs-12 col-sm-12 col-md-12 column saved-cards-div">\
        <p>\
            <span>\
                <input type="radio" name="saved-card" value="saved-card" data-id="{{payfortId}}" data-card="{{_id}}">\
                <span class="card-number">{{Digit}}</span>\
            </span>\
            <span class="pull-right">\
                <span class="{{icon}} fa-2x card-icon"></span>\
                <button class="saved-card-delete" data-id="{{_id}}" onclick="deleteCard(\'{{_id}}\')">DELETE</button>\
            </span>\
        </p>\
    </div>{{/cards}}';


    var savedCard_template =
    '<div class="body-bh-card">\
        <div class="modal-list-arcard">\
            <p class="modal-head-arcard">ADD / REMOVE YOUR CARDS</p>\
            <hr>\
            <div class="modal-div-arcard">\
                <p class="modal-blue-arcard ">Select card to pay with</p>{{#cards}}\
                <hr class="hr-arcard">\
                <div style="position:relative;">\
                    <label class="radiobutton-container modal-before-sel-button-arcard modal-cursor"><span class="modal-blue-para-arcard">{{Digit}}</span><br>\
                        <input type="radio"  class="modal-targer-ag hidden"  name="saved-card" value="saved-card" data-id="{{payfortId}}" data-card="{{_id}}">\
                        <span class="checkmark-arcard"></span>\
                        <span class="checkmark33-arcard"></span>\
                        <span class="span1-float">\
                            <div class="edit-btn hidden" style="display: inline;">\
                                <i class="fa fa-edit fa-2x active-color"></i>\
                            </div>\
                            <span class="{{icon}} fa-2x card-icon"></span><div class="delete-btn" data-id="{{_id}}" onclick="deleteCard(\'{{_id}}\')" style="display: inline;">\
                                <i class="fa fa-trash-o fa-2x active-color" style="margin-left: 4px;"></i>\
                            </div>\
                        </span>\
                    </label>\
                </div>{{/cards}}\
            </div>\
        </div>\
        <p class="body-ac-c1"  data-toggle="modal" data-target="#addcard_modal">+ ADD NEW CARD</p>\
    </div>';
