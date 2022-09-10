/**
 * Created by sumit on 31/10/16.
 */
var udata, cust_email, appointmentID, deleteCardId, useWallet, walletBalance;

function rotateRight(n, x) {
    return ((x >>> n) | (x << (32 - n)));
}

function choice(x, y, z) {
    return ((x & y) ^ (~x & z));
}

function majority(x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
}

function sha256_Sigma0(x) {
    return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
}

function sha256_Sigma1(x) {
    return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
}

function sha256_sigma0(x) {
    return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
}

function sha256_sigma1(x) {
    return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
}

function sha256_expand(W, j) {
    return (W[j & 0x0f] += sha256_sigma1(W[(j + 14) & 0x0f]) + W[(j + 9) & 0x0f] +
        sha256_sigma0(W[(j + 1) & 0x0f]));
}

/* Hash constant words K: */
var K256 = new Array(
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
);

/* global arrays */
var ihash, count, buffer;
var sha256_hex_digits = "0123456789abcdef";

/* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters:
 overflow) */
function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
}

/* Initialise the SHA256 computation */
function sha256_init() {
    ihash = new Array(8);
    count = new Array(2);
    buffer = new Array(64);
    count[0] = count[1] = 0;
    ihash[0] = 0x6a09e667;
    ihash[1] = 0xbb67ae85;
    ihash[2] = 0x3c6ef372;
    ihash[3] = 0xa54ff53a;
    ihash[4] = 0x510e527f;
    ihash[5] = 0x9b05688c;
    ihash[6] = 0x1f83d9ab;
    ihash[7] = 0x5be0cd19;
}

/* Transform a 512-bit message block */
function sha256_transform() {
    var a, b, c, d, e, f, g, h, T1, T2;
    var W = new Array(16);

    /* Initialize registers with the previous intermediate value */
    a = ihash[0];
    b = ihash[1];
    c = ihash[2];
    d = ihash[3];
    e = ihash[4];
    f = ihash[5];
    g = ihash[6];
    h = ihash[7];

    /* make 32-bit words */
    for (var i = 0; i < 16; i++)
        W[i] = ((buffer[(i << 2) + 3]) | (buffer[(i << 2) + 2] << 8) | (buffer[(i << 2) + 1]
            << 16) | (buffer[i << 2] << 24));

    for (var j = 0; j < 64; j++) {
        T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
        if (j < 16) T1 += W[j];
        else T1 += sha256_expand(W, j);
        T2 = sha256_Sigma0(a) + majority(a, b, c);
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
    }

    /* Compute the current intermediate hash value */
    ihash[0] += a;
    ihash[1] += b;
    ihash[2] += c;
    ihash[3] += d;
    ihash[4] += e;
    ihash[5] += f;
    ihash[6] += g;
    ihash[7] += h;
}

/* Read the next chunk of data and update the SHA256 computation */
function sha256_update(data, inputLen) {
    var i, index, curpos = 0;
    /* Compute number of bytes mod 64 */
    if (count && count.length > 0) {
        index = ((count[0] >> 3) & 0x3f);
    }
    var remainder = (inputLen & 0x3f);

    /* Update number of bits */
    if (count && count.length > 0) {
        if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++;
        count[1] += (inputLen >> 29);
    }

    /* Transform as many times as possible */
    for (i = 0; i + 63 < inputLen; i += 64) {
        for (var j = index; j < 64; j++)
            buffer[j] = data.charCodeAt(curpos++);
        sha256_transform();
        index = 0;
    }

    /* Buffer remaining input */
    for (var j = 0; j < remainder; j++)
        buffer[j] = data.charCodeAt(curpos++);
}

/* Finish the computation by operations such as padding */
function sha256_final() {
    var index = ((count[0] >> 3) & 0x3f);
    buffer[index++] = 0x80;
    if (index <= 56) {
        for (var i = index; i < 56; i++)
            buffer[i] = 0;
    } else {
        for (var i = index; i < 64; i++)
            buffer[i] = 0;
        sha256_transform();
        for (var i = 0; i < 56; i++)
            buffer[i] = 0;
    }
    buffer[56] = (count[1] >>> 24) & 0xff;
    buffer[57] = (count[1] >>> 16) & 0xff;
    buffer[58] = (count[1] >>> 8) & 0xff;
    buffer[59] = count[1] & 0xff;
    buffer[60] = (count[0] >>> 24) & 0xff;
    buffer[61] = (count[0] >>> 16) & 0xff;
    buffer[62] = (count[0] >>> 8) & 0xff;
    buffer[63] = count[0] & 0xff;
    sha256_transform();
}

/* Split the internal hash values into an array of bytes */
function sha256_encode_bytes() {
    var j = 0;
    var output = new Array(32);
    for (var i = 0; i < 8; i++) {
        output[j++] = ((ihash[i] >>> 24) & 0xff);
        output[j++] = ((ihash[i] >>> 16) & 0xff);
        output[j++] = ((ihash[i] >>> 8) & 0xff);
        output[j++] = (ihash[i] & 0xff);
    }
    return output;
}

/* Get the internal hash as a hex string */
function sha256_encode_hex() {
    var output = new String();
    for (var i = 0; i < 8; i++) {
        for (var j = 28; j >= 0; j -= 4)
            output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f);
    }
    return output;
}

/* Main function: returns a hex string representing the SHA256 value of the
 given data */
function sha256_digest(data) {
    // console.log("Digesting string: ", data)
    sha256_init();
    sha256_update(data, data.length);
    sha256_final();
    return sha256_encode_hex();
}

/* test if the JS-interpreter is working properly */
function sha256_self_test() {
    return sha256_digest("message digest") ==
        "f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650";
}

function getSignature(amount, id, email, transactionType) {
    var data1 = {
        "access_code": "aOQViQd95mbFAaateOWN",
        "amount": ((amount) * 100).toString(),
        "command": "PURCHASE",// should be PURCHASE or RECURRING, in case of advancePayment it should be RECURRING.
        "currency": "AED",
        "customer_email": email,
        "language": "en",
        "merchant_identifier": "aiFqcPKP",
        "merchant_reference": id + transactionType,
        "order_description": id + "Item" + transactionType
    };
    // console.log(transactionType)
    if (transactionType) {
        $('input[name="order_description"]').val(id + "Item" + "adv");
        $('input[name="merchant_reference"]').val(id + "adv");
    } else {
        $('input[name="order_description"]').val(id + "Item");
    }
    var dataobj = Object.keys(data1);
    // dataobj.sort();
    // console.log(dataobj);
    var string = "PASS";
    for (var k in dataobj) {
        string += dataobj[k] + "=" + data1[dataobj[k]];
    }
    string += "PASS";
    // console.log("String:", string);
    sha256sig = sha256_digest(string);
    // console.log(sha256sig);
    $('input[name="signature"]').val(sha256sig);
}


function getAllSavedCards() {
    var params = {};
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null') {
        udata = JSON.parse(userData);
        cust_email = udata.data.userDetails.email;
        updateUserInfo(udata);
        var paymentData = JSON.parse(localStorage.getItem("hg_p"));
        appointmentID = paymentData.id;
        var paramData = new FormData();
        paramData.append("appointmentId", paymentData.id);
        paramData.Auth = udata.data.accessToken;
        paramData._method = "POST";
        $.LoadingOverlay("show");
        callApi.queryUrl(apiUrl + "/api/customer/getJobDetails", paramData, function (err, response) {
            if (!err) {
                var transactionType = "";
                // console.log(response.advance_payment);
                var data = JSON.parse(response);
                data = data.data[0];
                console.log(data);
                if (data.status = "PAYMENT_PENDING" && data["advance_payment"] && data["advance_payment"]["payment_type"] == "CARD") {
                    transactionType = "adv";
                    console.log("here");
                } else if ((data.status = "ASSIGNED" || data.status == "INSPECTION") && data.advancePayment) {
                    // transactionType = "adv";
                    console.log("here 2");
                }

                if (paymentData) {
                    $('input[name="amount"]').val(((paymentData.a) * 100).toString());
                    $('input[name="merchant_reference"]').val(paymentData.id);
                    $('input[name="customer_email"]').val(cust_email);
                    getSignature(paymentData.a, paymentData.id, cust_email, transactionType);
                } else {
                    // window.location.href = "/";
                }
            }
        });
        // console.log(paymentData);


        // console.log(udata);
    } else {
        createCookie("reset", "pwd", 1);
        window.location.href = "/";
    }
    params.Auth = udata.data.accessToken;
    $.LoadingOverlay("show");
    callApi.getUrl(apiUrl + "/api/customer/getAllMyCard", params, function (err, results) {
        if (!err && results) {
            var data = {}, html, cardArray = [];
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

                    $('#checkout_card_number').validateCreditCard(function (result) {
                        //console.log(result);
                        if (result.card_type != null) {
                            switch (result.card_type.name) {
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
                data.cards = cardArray;
                console.log('cardData', data.cards);
                html = Mustache.render(savedCard_template, data);
                //console.log('cardDataHtml',html);
                $("#savedcards").html(html);
                $('input[type="radio"]').click(function () {
                    var name = $(this).attr("value");
                    console.log(name)
                    if (name == "anothercard" || name == "saved-card") {
                        $("#payment").hide();
                        $("#paymentform").removeClass("hidden");

                    } else {
                        $("#payment").show();
                        $("#paymentform").addClass("hidden");
                    }
                });

                $.LoadingOverlay("hide", true);
            } else {
                $("#savedcards").html("<p class='text-center' style='font-size:20px;color:#7cf2b1;'>You have not added any cards.</p>");
                $.LoadingOverlay("hide", true);
            }
        }
    });
}

function deleteSavedCards(id) {
    var data = new FormData();
    if (deleteCardId) {
        data.append("cardId", deleteCardId);
        data.Auth = udata.data.accessToken;
        data._method = "PUT";
        $.LoadingOverlay("show");
        callApi.queryUrl(apiUrl + "/api/customer/deleteCards", data, function (err, results) {
            if (!err) {
                getAllSavedCards();
            }
        });
    } else {
        alert("Kindly select a card to delete");
    }
}

function deleteCard(id) {
    deleteCardId = id;
    $("#reviewCard").click();
}

$(".reviewDone").click(function () {
    deleteSavedCards();
});

function payUsingSavedCard() {
    /*var */
    /*var paymentData = JSON.parse(localStorage.getItem("hg_p"));
    localStorage.getItem("hg_p",null,1);
    var data = new FormData();
    data.append("merchantId",paymentData.id);
    data.Auth = udata.data.accessToken;
    data._method = "POST";
    callApi.queryUrl(apiUrl + "/api/customer/pay", data, function(err, response){
        if (!err && response) {
            response = JSON.parse(response);
            if(response.data && response.data.url) {
                var url = response.data.url;
                console.log(url);
                window.location.href = url;
       } else {
                $('.showErrMsg').html('Url not found');
                scrollWindow();
                $('.msgmodal').removeClass('hidden');
       }
        } else if(!err) {
            payUsingSavedCards();
   } else {
            $("#redirect").hide();
            $('.map-continue ').removeClass('hidden');
            $('#success').removeClass('hidden');
            callApi.error(err);
   }
    });*/
}

$('input[type="radio"]').click(function () {
    var name = $(this).attr("value");
    console.log(name)
    if (name == "anothercard" || name == "saved-card") {
        $("#payment").hide();
        $("#paymentform").removeClass("hidden");
        $(".checkbox-div").removeClass("hidden");

    } else {
        $("#payment").show();
        $("#paymentform").addClass("hidden");
        $(".checkbox-div").addClass("hidden");
    }
});


$("#payment").click(function () {
    $('input[type="radio"]').each(function () {
        if ($(this).is(":checked")) {
            var paymentType = $(this).attr("value");
            switch (paymentType) {
                case "cod":
                    var paymentData = JSON.parse(localStorage.getItem("hg_p"));
                    //localStorage.getItem("hg_p",null,1);
                    var params = {};
                    params.Auth = udata.data.accessToken;
                    $.LoadingOverlay("show");
                    callApi.getUrl(apiUrl + "/api/customer/cashPayment?appointmentID=" + paymentData.id + "&amount=" + paymentData.a, params, function (err, response) {
                        if (!err) {
                            //console.log(response);
                            $.LoadingOverlay("hide");
                            $.growl.notice({ message: "Please pay AED " + paymentData.a + " in cash to the worker." });
                            setTimeout(function () {
                                window.location.href = "/";
                            }, 1000);
                        } else {
                            $.LoadingOverlay("hide");
                            callApi.error(err);
                        }
                    });
                    break;
                case "anothercard":
                    $("#payment").hide();
                    $("#paymentform").removeClass("hidden");
                    break;
                case "saved-card":
                    $("#payment").hide();
                    $("#paymentform").removeClass("hidden");
                    /*var paymentData = JSON.parse(localStorage.getItem("hg_p"));
                    var savedCard = {};
                    savedCard.payId = $(this).data("id");
                    savedCard.card = $(this).data("card");
                    savedCard.appointmentID = paymentData.id;
                    localStorage.setItem("hg_sc", JSON.stringify(savedCard));
                    var params = new FormData();
                    params.append("emailId", udata.data.userDetails.email);
                    // params.append("device_id", "00000000-3f17-17c7-ffff-ffff8e25e1e7");
                    params._method = "POST";
                    params.Auth = udata.data.accessToken;
                    callApi.queryUrl(apiUrl + "/api/payment/genrateSdkToken", params, function (err, response) {
                        if (!err) {
                            createCookie("hg_p", null, 1);
                            createCookie("hggt", JSON.stringify(response), 1);
                            window.location.href = "/paymentgateway.html";
                        } else {
                            callApi.error(err);
                        }
                    });
                    break;*/
                    var params = new FormData();
                    params.append("emailId", udata.data.userDetails.email);
                    params.append("id", udata.data.userDetails.id);
                    //params.append("device_id","00000000-3f17-17c7-ffff-ffff8e25e1e7");
                    var paymentData = JSON.parse(localStorage.hg_p);
                    params._method = "POST";
                    params.Auth = udata.data.accessToken;
                    callApi.queryUrl(apiUrl + "/api/payment/genrateSdkToken", params, function (err, response) {
                        if (!err) {
                            createCookie("hg_p", null, 1);
                            createCookie("hggt", JSON.stringify(response), 1);
                            if (useWallet) {
                                var amount = $("#amount-input").val();
                                // alert("1")
                                checkFinalPayment(appointmentID, amount, function (err, res) {
                                    if (!err && res) {
                                        console.log("I am here cb: ", res);
                                        if (res.dueAmount) {
                                            window.location.href = "../html/paymentgateway.html?id=" + appointmentID;
                                        } else {
                                            // alert("You payment has been completed");
                                            var message = { "msg": "AED" + paymentData.a + " has been successfully applied." }
                                            $('.msg-display').html(Mustache.render(MsgDisplayTemp, message));
                                            $('.msg-modal').modal('show');
                                            $(".re-direct-home").click(function () {
                                                window.location.href = "../html/home.html";
                                            });
                                        }
                                    } else {
                                        console.log("I am here cb: ", err);
                                    }
                                });
                            } else {
                                window.location.href = "../html/paymentgateway.html?id=" + appointmentID;
                            }
                        } else {
                            //callApi.error(err);
                            var err = JSON.parse(err);
                            var message = { "msg": err.message };
                            $('.msg-display').html(Mustache.render(MsgDisplayTemp, message));
                            $('.msg-modal').modal('show');
                        }
                    });
                    break;
            }
        }
    });
});

function savedCards(payfortId, digit, icon) {
    // $('#paymentform').addClass('hidden');
    // $('#payment').addClass('hidden');
    // $("#saveCard").removeClass('hidden');
    var payfortData = {};
    payfortData.payfortid = payfortId;
    payfortData.digit = digit;
    payfortData.icon = icon;
    payfortData.appointmentID = appointmentID;
    localStorage.setItem('payfortData', JSON.stringify(payfortData));
    $(".checkbox-div").removeClass("hidden");
}

function updateUseWallet() {
    if (useWallet) {
        useWallet = false;
    } else {
        useWallet = true;
    }
    // console.log(useWallet);
}

$("#paymentform").click(function () {
    var paymentData = JSON.parse(localStorage.getItem("hg_p"));
    var savedCard = {};
    $('input[type="radio"]').each(function () {
        if ($(this).is(":checked")) {
            var paymentType = $(this).attr("value");
            if (paymentType == "saved-card") {
                savedCard.payId = $(this).data("id");
                savedCard.card = $(this).data("card");
                savedCard.appointmentID = paymentData.id;
                localStorage.setItem("isSavedCard", "true");
                localStorage.setItem("hg_sc", JSON.stringify(savedCard));
                // fbq('track', 'AddPaymentInfo');
                // window.location.href = "/app/paymentgateway.html";
            } else if (paymentType == "anothercard") {
                savedCard.card = $(this).data("card");
                savedCard.appointmentID = paymentData.id;
                localStorage.setItem("isSavedCard", "false");
                localStorage.setItem("hg_sc", JSON.stringify(savedCard));
                // fbq('track', 'AddPaymentInfo');
                // window.location.href = "/app/paymentgateway.html";
            }
        }
    });
    /*var paymentData = JSON.parse(localStorage.getItem("hg_p"));
    var savedCard = {};
    savedCard.payId = $(this).data("id");
    savedCard.card = $(this).data("card");
    savedCard.appointmentID = paymentData.id;
    localStorage.setItem("hg_sc", JSON.stringify(savedCard));
    window.location.href = "/app/paymentgateway.html";*/
    if (useWallet) {
        localStorage.setItem('isWalletAmount', true);
        if (walletBalance) {
            if ($("#amount-input").val()) {
                // console.log(parseInt($("#amount-input").val()), walletBalance)
                if (parseInt($("#amount-input").val()) > walletBalance) {
                    $(".login-message").html("Amount can not be greater than total amount!");
                    return;
                } else {
                    var amount = $("#amount-input").val();
                    var paymentData = JSON.parse(localStorage.hg_p);
                    // alert("2")
                    checkFinalPayment(appointmentID, amount, function (err, res) {
                        if (!err && res) {
                            // console.log("I am here cb: ", res);
                            if (res.dueAmount) {
                                window.location.href = "/app/paymentgateway.html?id=" + appointmentID;
                            } else {
                                var message = { "msg": "AED " + paymentData.a + " has been successfully applied." }
                                $('.msg-display').html(Mustache.render(MsgDisplayTemp, message));
                                $('.msg-modal').modal('show');
                                $(".re-direct-home").click(function () {
                                    window.location.href = "/";
                                });
                            }
                        } else {
                            // console.log("I am here cb: ", err);
                        }
                    });
                }
            }
            else {
                $(".login-message").html("Please Enter amount!");
                return;
            }
        } else {
            $(".login-message").html("You don't have wallet balance!");
            return;
        }
    } else {
        window.location.href = "/app/paymentgateway.html?id=" + appointmentID;
    }
});

$("#saveCard").click(function () {
    if (useWallet) {
        localStorage.setItem('isWalletAmount', true);
    }
    var amount = $("#amount-input").val();
    var paymentData = JSON.parse(localStorage.hg_p);
    // alert("3")
    checkFinalPayment(appointmentID, amount, function (err, res) {
        if (!err && res) {
            // console.log("I am here cb: ", res);
            if (res.dueAmount) {
                window.location.href = "/app/paymentgateway.html?id=" + appointmentID;
            } else {
                var message = { "msg": "AED " + paymentData.a + " has been successfully applied." }
                $('.msg-display').html(Mustache.render(MsgDisplayTemp, message));
                $('.msg-modal').modal('show');
                $(".re-direct-home").click(function () {
                    window.location.href = "/";
                });
            }
        } else {
            // console.log("I am here cb: ", err);
        }
    });
    // console.log("CHECK_FINAL_AMOUNT : ", checkFinalAmount);
    /*if (checkFinalAmount) {
      return;
      //window.location.href = "../html/paymentgateway.html?id=" + appointmentID + "?amount=" + amount;
    }*/
    //window.location.href = "../html/paymentgateway.html";
});

function getWallet() {
    var data = JSON.parse(localStorage.getItem("h_user")).data;
    let params = {};
    params._method = "GET";
    params.Auth = data.accessToken;
    callApi.getUrl(apiUrl + "/api/customer/getWallet", params, function (err, res) {
        if (!err && res) {
            if (res.data && res.data[0]) {
                res = res.data[0];
                if (res.totalAmount) {
                    $(".total-balance").html(res.totalAmount.toFixed(2));
                    walletBalance = res.totalAmount.toFixed(2);
                }
            }
        } else {
            // console.log(err);
        }
    });
}

function checkFinalPayment(appointmentId, amount, cb) {
    var udata, rememberCard;
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null') {
        udata = JSON.parse(userData);
    }
    var data = new FormData();
    data.Auth = udata.data.accessToken;
    data._method = "POST";
    if (appointmentId) {
        data.append("appointmentId", appointmentId);
    }
    if (amount) {
        data.append("amount", amount);
    }
    // console.log(amount);
    callApi.queryUrl(apiUrl + "/api/customer/payWithWallet", data, function (err, results) {
        if (!err && results) {
            localStorage.setItem('isWalletAmount', null);
            // console.log("results", results);
            results = JSON.parse(results);
            if (results.data && results.data.dueAmount) {
                $("#payment-aed").html("AED " + results.data.dueAmount.toFixed(2));
            }
            $.LoadingOverlay("hide", true);
            return cb(null, results.data);
        } else {
            // console.log(err);
        }
    });
}

$(document).ready(function () {
    getAllSavedCards();
    getWallet();
});

var savedCard_template1 =
    '{{#cards}}<div class="col-xs-12 col-sm-12 col-md-12 column saved-cards-div">\
        <p>\
            <span>\
                <input type="radio" name="saved-card" value="saved-card" data-id="{{payfortId}}" data-card="{{Digit}}">\
                <span class="card-number">{{Digit}}</span>\
            </span>\
            <span class="pull-right">\
                <span class="{{icon}} fa-2x card-icon"></span>\
                <button class="saved-card-delete" data-id="{{_id}}" onclick="deleteCard(\'{{_id}}\')">DELETE</button>\
            </span>\
        </p>\
    </div>{{/cards}}';

var savedCard_template =
    '{{#cards}}\
                <hr class="hr-arcard">\
                <div class="pay-method-pm" style="position:relative;">\
                    <label class="radiobutton-container modal-before-sel-button-arcard modal-cursor"><span class="modal-blue-para-arcard">{{Digit}}</span><br>\
                         <input type="radio"  class="modal-targer-ag hidden"  onclick="savedCards(\'{{payfortId}}\',\'{{Digit}}\',\'{{icon}}\')" name="saved-card" value="saved-card" data-id="{{payfortId}}" data-card="{{Digit}}">\
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
                </div>{{/cards}}';

var MsgDisplayTemp = '<div class="modal fade msg-modal" role="dialog" data-backdrop="static" data-keyboard="false" id="close_pending_rating" style="z-index: 100000;">\
<div class="modal-dialog box-shadow">\
    <div class="modal-content cancel-booking">\
        <div class="modal-body">\
            <div class="row">\
                <div class="col-md-12 col-sm-12 col-xs-12 text-center column">\
                    <p id="message" class="title">{{&msg}}</p>\
                    <!--<div class="flex-box">-->\
                    <button class="msg-color-btn modal-button" data-dismiss="modal" onclick="location.href=\'../html/mybookings.html\'">Continue</button>\
                    <!--<button class="msg-color-btn modal-button sure-button" data-dismiss="modal">No, change payment method.</button></div>-->\
                </div>\
            </div>\
        </div>\
    </div>\
</div>\
</div>'
