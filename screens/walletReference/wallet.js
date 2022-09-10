"use strict";

function getWallet() {
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
            //console.log('getWallet',result);
            var walletDate  = new Date();
            var walletdatee = (walletDate.getDate() +'-0'+(walletDate.getMonth() +1) +'-'+walletDate.getFullYear())
            result.data[0].updatedAt = walletdatee
            var getWallet_data = Mustache.render(WALLETBALANCE_TEMPLATE, result);
            $(".wallet-price").html(getWallet_data);
        } else {
            callApi.error(err);
        }
    });
}

function getWalletTransaction() {
    var userInfo = JSON.parse(localStorage.getItem("h_user"));
    udata = userInfo.data;
    let params = {};
    params._method = "GET";
    params.Auth = udata.accessToken;
    callApi.getUrl(apiUrl + "/api/customer/getWalletTransaction", params, function (err, res) {
      if (!err && res) {
        // console.log(res.data)
        // res = JSON.parse(res);
        console.log("TRANSACTION RESPONSE : ", res);
        var debit = [], credit = [];
        if (res.data && res.data.length > 0) {
          for (var x in res.data) {
            if (res.data[x].transactionAction == "DEBIT") {
              debit.push(res.data[x]);
            } else if (res.data[x].transactionAction == "CREDIT") {
              credit.push(res.data[x]);
            }
            var newdate = new Date(res.data[x].createdAt);
            var day = newdate.getDate();
            var month = newdate.getMonth()+1;
            var year = newdate.getFullYear();
            res.data[x].createdAt = day+".0"+month+"."+year;
            res.data[x].amount = parseFloat(res.data[x].amount).toFixed(2); 
          }
        }
  
        // console.log("CREDIT_DATA : ", credit);
        // console.log("DEBIT_DATA : ", debit)
        if(debit[0]){
          $("#debit").html(Mustache.render(HISTORY_TEMPLATE, {data: debit}));
        }
        if(credit[0]){
          $("#credit").html(Mustache.render(HISTORY_TEMPLATE, {data: credit}));
        }
      }
      else {
        console.log(err);
      }
    });
  }

  $("#add-amount").click(function(){
    var voucher;
    var userInfo = JSON.parse(localStorage.getItem("h_user"));
    udata = userInfo.data;
    $(".login-message").html("");
    if($("#user-amount").val()){
      voucher = $("#user-amount").val();
      var paramData = new FormData;
      paramData._method = "POST";
      paramData.append("voucherCode", voucher);
      paramData.Auth = udata.accessToken;
      callApi.queryUrl(apiUrl + "/api/customer/applyVoucherCode", paramData, function(err, response){
        if(!err && response){
            $('#wallet-modal').modal('hide');
            response = JSON.parse(response);
            console.log(response.data);
            $(".price-credited").html(response.data);
            $("#wallet-modal-credit").modal("show");
        }else{
          err = JSON.parse(err);
          $(".login-message").html(err.message);
        }
      });
    }else{
      $(".login-message").html("Please Enter Voucher Code");
    }
  });


$(document).ready(function() {
    getWallet();
    getWalletTransaction();
});

var WALLETBALANCE_TEMPLATE = 
'{{#data}} <div class="col-xs-6">' +
'    <div class="title">Wallet Balance <span>as on {{updatedAt}}</span></div>' +
'</div>' +
'<div class="col-xs-6">' +
'    <div class="price text-right"><span>AED </span>{{totalAmount}}</div>' +
'</div>{{/data}} ';


var HISTORY_TEMPLATE = '{{#data}}<div class="col-xs-12 mt-5">\
                    <div class="row history-details-list">\
                    <div class="col-xs-8 mp-0 small-title">{{description}}<p class="mp-0 opacity-05 price-date">{{createdAt}}</p></div>\
                    <div class="col-xs-4 mp-0 text-right each-price">{{amount}}</div></div>\
                    </div>{{/data}}'

