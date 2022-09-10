"use strict";
let userInfo, url, customerID, appointmentID;

function detectmob() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows\sPhone/i)) {
        return true;
    } else {
        return false;
    }
}

function getJobDetails() {
	let param = new FormData();
	param.append("customerId", customerID);
	param.append("appointmentId", appointmentID);
	param._method = "POST";
	param.contentType = undefined;
	callApi.queryUrl(apiUrl + "/api/customer/getJobDetailsForEmail", param, (err, res) => {
		if (!err && res) {
			(console.log("res",res))
			$("#reestimateOrClose").click();
		} else {
			alert(err);
		}
	});
}

function acceptEstimate() {
	let param = new FormData();
	param.append("customerId", customerID);
	param.append("jobId", appointmentID);
	param.append("status", "APPROVE");
	param._method = "PUT";
	callApi.putUrl(apiUrl + "/api/customer/approveOrRejectJobFromEmail/", param, (err, res) => {
		if (!err && res) {
			$(".geniesearch-container").removeClass("hidden");
			$(".section-intHeight").hide();
			console.log(res);
		} else {
			alert(err);
		}
	});
}

function advancePayment(url) {
	url = url.split("?")[1];
	userInfo = JSON.parse(localStorage.getItem("h_user"));
    url = url.split("&");
	console.log("user",userInfo)
	if (userInfo && userInfo !== "null" && userInfo !== null) {
    	let consumerID = url[1].split("=")[1];
		let customerID = userInfo.data.userDetails._id;
		if (consumerID == customerID) {
			//check for advance payment
			let param = new FormData();
			//param.append("customerId", customerID);
			param.append("appointmentId", url[0].split("=")[1]);
			param._method = "POST";
			param.Auth = userInfo.data.accessToken;
			callApi.queryUrl(apiUrl + "/api/customer/getJobDetails", param, (err, res) => {
				if (!err && res) {
					res = JSON.parse(res);
					res = res.data[0];
					if (res.status == "INSPECTION" && res.payment && res.payment.payment_type !== "CASH") {
						let paymentdata = {};
					    paymentdata.id = res._id;
					    paymentdata.a = res.charges.advanceCharges;
					    paymentdata = JSON.stringify(paymentdata);
					    localStorage.setItem("hg_p",paymentdata);
					    window.location.href = "/app/paymentmethod.html";
					} else if ((res.status === "CANCELLED" || res.status === "REJECTED" || res.status === "EXPIRED" || res.status === "PAYMENT_PENDING") && res.payment && res.payment.payment_type !== "CASH") {
						let paymentdata = {};
					    paymentdata.id = res._id;
					    paymentdata.a = res.charges.finalCharges;
					    paymentdata = JSON.stringify(paymentdata);
					    localStorage.setItem("hg_p",paymentdata);
					    window.location.href = "/app/paymentmethod.html";
					} else if(res && res.charges && (res.charges.unitCharges && !res.isInspectionRequired) && res.payment && res.payment.payment_type !== "CASH") {
						let paymentdata = {};
					    paymentdata.id = res._id;
					    paymentdata.a = res.charges.advanceCharges;
					    paymentdata = JSON.stringify(paymentdata);
					    localStorage.setItem("hg_p",paymentdata);
					    window.location.href = "/app/paymentmethod.html";
					} else {
						window.location.href = "/";
					}
					
				} else {
					//set local storage for 5-10 min;
					localStorage.setItem("h_user", null);
					let emailUrl = {
						url:(document.URL).split("?")[1],
						timeStamp: new Date().getTime()
					};
					localStorage.setItem("emailUrl",JSON.stringify(emailUrl));
					window.location.href = "/";
				}
			});
		} else {
			alert("You are not a valid user for this job. Kindly login to your account");
			window.location.href = "/";
		}
	} else {
		// set the url in the local storage and check at the time of login
		localStorage.setItem("h_user", null);
		let emailUrl = {
			url:(document.URL).split("?")[1],
			timeStamp: new Date().getTime()
		};
		console.log("else",userInfo)
		localStorage.setItem("emailUrl",JSON.stringify(emailUrl));
    	$("#loginModal").modal("show");
    }
}

function redirectToRatingPage () {
	userInfo = JSON.parse(localStorage.getItem("h_user"));
	if (userInfo && userInfo !== "null") {
		let docurl = document.URL;
		docurl = docurl.split("&");
		appointmentID = docurl[0].split("=")[1];
		let consumerID = docurl[1].split("=")[1];
		let customerID = userInfo.data.userDetails._id;
		if (consumerID == customerID) {
			window.location.href = "/app/rateGenie.html?genieid=" + appointmentID;
		} else {
			console.log("Not a valid user");
		}
	} else {
		console.log("not logged in");
		let emailUrl = {
			url:(document.URL).split("?")[1],
			timeStamp: new Date().getTime()
		};
		localStorage.setItem("emailUrl", JSON.stringify(emailUrl));
        $(".login").click();
	}
}
$("#doadvancePay").click(function(){
	advancePayment(url)
})

$(document).ready(function(){
	// $("#reestimateOrCloseModal").modal("show");
	url = document.URL;
	let tempUrl = url;
	tempUrl = tempUrl.split("?")[1];
	tempUrl = tempUrl.split("&");
	appointmentID = tempUrl[0].split("=")[1];
	customerID = tempUrl[1].split("=")[1];
	if (url.match(/genieid/gi)) {
		console.log("i am in if");
		if (detectmob()) {
			window.location.href = 'homegenie.com://' + (document.URL).split("?")[1];
			setTimeout(function(){
				redirectToRatingPage();
			},3000);
		} else {
			redirectToRatingPage();
		}
	} else if (url.indexOf("advance=true") !== -1) {
		let amount = tempUrl[2].split("=")[1]
		if (detectmob()) {
			console.log("in detect mob")
			window.location.href = 'homegenie.com://' + (document.URL).split("?")[1];
			setTimeout(function(){
				$("#advancePrice").text(amount)
			$("#advPay").modal("show");
			},3000);
		} else {
			console.log("here");
			$("#advancePrice").text(amount)
			$("#advPay").modal("show");
			//advancePayment(url);
		}

	}else if (url.indexOf("final=true") !== -1){
		let amount = tempUrl[2].split("=")[1]
		if (detectmob()) {
			console.log("in detect mob")
			window.location.href = 'homegenie.com://' + (document.URL).split("?")[1];
			setTimeout(function(){
				advancePayment(url);
			},3000);
		} else {
			advancePayment(url);
			//advancePayment(url);
		}

	} else {
		console.log("i am in else")
		// url = url.split("?")[1];
		// url = url.split("&");
		// appointmentID = url[0].split("=")[1];
		// customerID = url[1].split("=")[1];
		getJobDetails();
	}
	
});