/**
 * Created by sumit on 5/11/16.
 */
var udata, genieData, jobID, count = 0, longerCount = 0, bookingId, requestedTime, driverId, appointmentID;
var isEmergency = false;
var apiCity;

function viewDeails() {
    location.href = '/app/html/jobDetails.html?id=' + appointmentID + '&status=ongoing';
}

function bookNew() {
    location.href = '/app/html/booking.html';
}


var bookcount = 0;

function getmybookings(jobid) {
    var userData = localStorage.getItem("h_user");
    if (userData && userData !== 'null' && userData !== 'undefined') {
        udata = JSON.parse(userData);
        updateUserInfo(udata);
    } else {
        // window.location.href = "/";
    }
    var params = {};
    params.Auth = udata.data.accessToken;
    callApi.getUrl(apiUrl + "/api/customer/getmybookings", params, function (err, result) {
        // console.log("2");
        if (!err && result) {
            // console.log("I am here");
            var bookingData = result.data.upcomingAppointment;
            for (var k in bookingData) {
                // console.log("3");
                if (bookingData[k]["uniqueCode"] == jobid) {
                    // console.log("4");
                    if (bookingData[k].category.name == "Membership") {
                        $('.member-one').html('membership');
                        $('.member-two').html('Request ');
                        $('.member-three').html('received');
                        $('.member-four').html('request');
                    }
                    var bookingservice = bookingData[k]["serviceType"];
                    bookingId = bookingData[k]["_id"];
                    requestedTime = new Date(bookingData[k]["utc_timing"]["requestedTime"]).getTime();
                    if (bookingData[k]["status"]) {
                        //window.location.href = "/genieFound.html?id=" + bookingData[k]["_id"];
                        var data = new FormData();
                        data.append("appointmentId", bookingData[k]["_id"]);
                        data.Auth = udata.data.accessToken;
                        data._method = "POST";
                        callApi.queryUrl(apiUrl + "/api/customer/getJobDetails", data, function (err, response) {
                            if (!err && response) {
                                var result;
                                result = (JSON.parse(response)).data[0];
                                appointmentID = result['_id'];
                                // console.log("5");
                                apiCity = result.address.city;
                                initializeServiceCategorizarion(localStorage.getItem("current_url"));
                                $(".category-icon").attr("src", result.categoryImage.original);
                                $(".selected-category-title").html(result.categoryName + "|");
                                $(".selected-subcategory-title").html(result.subCategory.subCategoryName);
                                if (result.serviceType === "SCHEDULED") {
                                    $(".booking-genie-info").html("<p class=\"mp-0\">Thank you! </p><p>Your booking has been confirmed.</p>");
                                    $(".modal-service-type").html("Schedule booking?");
                                    $(".service-type-text, .serviceType, .modal-service-type").addClass("yellowColor");
                                    $(".booking-genie-info").html("<p class=\"mp-0\">Thank you! </p><p>Your booking has been confirmed.</p>");
                                } else if (result.serviceType === "EMERGENCY") {
                                    isEmergency = true
                                    $(".booking-genie-info").html("<p class=\"mp-0\">Thank you! </p><p>Your booking has been received.</p>");
                                    $("#genie-wait").show();
                                    $("#booking-info").show();
                                    $(".booking-genie-info").html("<p class=\"mp-0\">Thank you! </p><p> Your booking has been received.</p>");
                                    $(".modal-service-type").html("Emergency booking?");
                                    $(".service-type-text, .serviceType, .modal-service-type").addClass("red");
                                } else if (result.serviceType === "SAMEDAY") {
                                    $(".booking-genie-info").html("<p class=\"mp-0\">Thank you! </p><p> Your booking has been received.</p>");
                                    $(".modal-service-type").html("Sameday booking?");
                                    $(".service-type-text, .serviceType, .modal-service-type").addClass("yellowColor");
                                    $(".booking-genie-info").html("<p class=\"mp-0\">Thank you! </p><p>Your booking has been received.</p>");
                                }
                                $(".uniqe-code").html(result.uniqueCode);

                                var slot, date, month, day, year;

                                result.slotStartTime = parseInt(result.startTime / 60 >= 12 ? (result.startTime / 60) % 12 == 0 ? 12 : (result.startTime / 60) % 12 : result.startTime / 60) + (result.startTime % 60 == 0 ? "" : ":" + result.startTime % 60) + (result.startTime / 60 >= 12 ? "PM" : "AM");
                                result.slotEndTime = parseInt(result.endTime / 60 >= 12 ? (result.endTime / 60) % 12 == 0 ? 12 : (result.endTime / 60) % 12 : result.endTime / 60) + (result.endTime % 60 == 0 ? "" : ":" + result.endTime % 60) + (result.endTime / 60 >= 12 ? "PM" : "AM");

                                monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                    dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                var bookingDate = result["utc_timing"].requestedTime;
                                // date = new Date(bookingdate);
                                // month = monthArray[date.getMonth()];
                                // day = dayArray[date.getDay()];
                                // year = date.getFullYear();
                                // date = date.getDate();
                                // var bookingDate =  date + " " + month + " " + year + "," + result.slotStartTime+" - "+result.slotEndTime;
                                $(".date-time-info").html(moment(bookingDate).format("DD MM YYYY, HH:mm"));


                                //status check
                                genieData = result.driverData;
                                if (genieData) {
                                    $(".cancel, .genie-wait, .cancel-booking-action , .wait-time-text").hide();
                                    $(".booking-genie-info").html("<p class=\"mp-0\">Hurray! We found a Genie </p><p> for you!</p>");
                                    $(".jobID.cancel, .service-professional, .genie-common-text, .okay-button").show();
                                    $(".genie-name").html(genieData.name);
                                    $(".genie-number").html(genieData.phoneNo);
                                    $(".genie-call-button").attr("href", href = "tel:" + genieData.phoneNo);
                                    $(".genie-rating").html("<div class='rating-star'><img class='img-responsive' src='/img/star-filled.png'></div>" + parseFloat(genieData.averageRating).toFixed(2) + "/ 5 rated");
                                    if (genieData.profilePicURL.original) {
                                        $(".genie-pic img").attr("src", genieData.profilePicURL.original);
                                    }
                                    $(".genie-modal-rating").html("<div class='modal-rating-star'></div> " + "<span class='ml-5'>" + parseFloat(genieData.averageRating).toFixed(2) + "/ 5</span>");
                                    var myStarRating = showStarRating(genieData.averageRating);
                                    var starRating = {
                                        "starRating": myStarRating
                                    }
                                    $(".modal-rating-star").html(Mustache.render(STAR_RATING_TEMPLATE, starRating));
                                    driverId = genieData._id;
                                    getDriverDetails(genieData._id);
                                } else {
                                    setTimeout(function () {
                                        // console.log("6");
                                        getmybookings(jobid);
                                    }, 10000);
                                }
                            } else if (!err) {
                                bookcount++;
                                if (bookcount < 4) {
                                    getmybookings(jobID[0]);
                                } else {
                                    setTimeout(function () {
                                        // console.log("6");
                                        getmybookings(jobID[0]);
                                    }, 10000);
                                }
                            }

                        });
                    } else if (((new Date().getTime()) - requestedTime) < 900000) {
                        //// console.log("count", count);
                        setTimeout(function () {
                            // console.log("timeout");
                            //// console.log("timeout", count);
                            count++;
                            longerCount++;
                            getmybookings(jobID[0]);
                        }, 10000);
                    } else {
                        // console.log(((new Date().getTime()) - requestedTime));
                        count = 0;
                        if (bookingservice == "EMERGENCY" || bookingservice == "SAMEDAY") {
                            // console.log("I AM HERE");
                            $("#difficultSearch").show();
                            $("#genieFound").hide();
                            $("#genieSearch").hide();
                            $("#genie-wait").removeClass("hidden");
                            if (longerCount >= 180) {
                                //// console.log("longer", count);
                                count = 0;
                                $("#difficultSearch").hide();
                                $("#genieFound").hide();
                                $("#genieSearch").hide();
                                $("#longerSearch").show();
                            }
                        }
                    }
                }
            }
        } else {
            $.LoadingOverlay("hide", true);
            if (!err) {
                bookcount++;
                if (bookcount < 4) {
                    getmybookings(jobID[0]);
                } else {
                    setTimeout(function () {
                        getmybookings(jobID[0]);
                    }, 10000);
                }
            } else {
                callApi.error(err);
            }

        }
    });
}


function initializeServiceCategorizarion(subCat) {
    const params = {};
    let city_language = getCityAndLanguage();
    callApi.getUrl(apiUrl + '/api/subcategory/getSubCategory?url=' + subCat + "&getContent=true&city=" + apiCity + "&language=" + LANGUAGE, params, function (err, res) {
        if (!err && res) {
            var data = res.data[0];
            if (data.relatedServices.length) {
                $("#related-wrapper").html(Mustache.render(RELATED_SERVICES, { "data": data }));
                $(".related-service-product").removeClass("hidden");
                var serviceSection = new Swiper('#service-section', {
                    // slidesPerView: 4,
                    spaceBetween: 0,
                    loop: false,
                    autoplay: {
                        delay: 3000,
                    },
                    speed: 1000,
                    navigation: {
                        nextEl: '#service-section-next',
                        prevEl: '#service-section-prev',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        992: {
                            slidesPerView: 3,
                        },
                        1200: {
                            slidesPerView: 4,
                        }
                    }
                });
            } else {
                $(".related-service-product .container").addClass("hidden");
            }
            $("#blog-section-check").html(data.content.content.blogSection.htmlContent);
            blogSwiper()

            if ($('#blog-section-check').get()[0].children.length == 0) {
                $('#blog-section').addClass("hidden");
            } else {
                $('#blog-section, .blog-section').removeClass("hidden");
            }


        } else {
            // // console.log("ERROR IS: ", err)
        }
    })
}

function blogSwiper() {
    var x = $("#blog-section-check div.box-margins").children();
    var y = $("#blog-section-check h3");
    $("#blog-title").html(y);
    var blogLength = x.length;
    $(".related-blogs .swiper-wrapper").html("");
    for (var i = 0; i < blogLength; i++) {
        x[i].querySelector('img').setAttribute("data-src", x[i].querySelector('img').getAttribute("data-src").replace("45.55.72.136.xip.io", "homegenie.com"));
        $(".related-blogs .swiper-wrapper").append("<div id='slide" + i + "' class='swiper-slide related-blogs-slide text-center'></div>").find("#slide" + i).append(x[i]);
        $("#slide" + i + ".related-blogs-slide img").attr("src", x[i].querySelector('img').getAttribute("data-src"));
    }

    var relatedBlogs = new Swiper('#related-blogs', {
        observer: true,
        observeParents: true,
        loop: true,
        navigation: {
            nextEl: '#related-blogs-next',
            prevEl: '#related-blogs-prev',
        },
        autoplay: {
            delay: 3000,
        },
        speed: 1000,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    });
}

function contactGenie() {
    $(".genie-btn").html("CONTACT GENIE ( <span class='hidden-sm hidden-md hidden-lg'><a href='tel:" + genieData.phoneNo + "'>0" + genieData.phoneNo + "</a></span><span class='hidden-xs'>" + genieData.phoneNo + "</span> )")
}

function cancelSearchRequest() {
    $.LoadingOverlay("show");
    var params = new FormData();
    params.append("jobId", bookingId);
    params.Auth = udata.data.accessToken;
    params._method = "PUT";
    callApi.queryUrl(apiUrl + "/api/customer/cancelBookingInRequestState", params, function (err, result) {
        if (!err) {
            $("#cancelModal").click();
            $.LoadingOverlay("hide", true);
            window.onbeforeunload = '';
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });

}


function cancelAppointment() {
    $.LoadingOverlay("show");

    var data = {};
    data.Auth = udata.data.accessToken;
    callApi.getUrl(apiUrl + "/api/customer/JobCancelChargeCalculation?jobId=" + bookingId, data, function (err, results) {
        if (!err) {
            // $("#cancelCharge").html(results.data.cancelCharge);
            // $("#cancel").click();
            $.LoadingOverlay("hide", true);
            window.location.href = "/";
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });
    $.LoadingOverlay("show");
    var params = new FormData();
    params._method = "PUT";
    params.Auth = udata.data.accessToken;
    params.append("jobId", bookingId);
    callApi.queryUrl(apiUrl + "/api/customer/JobCancelCharge", params, function (err, results) {
        if (!err) {
            // $("#cancelConfirm").modal("hide");
            // $("body").removeClass("modalOpen");
            // $("#popupmodal").modal("hide");
            showMessageToUser("You have successfully cancel the appointment");
            $.LoadingOverlay("hide", true);
            setTimeout(function () {
                window.location.href = "/";
            }, 1000);
        } else {
            $.LoadingOverlay("hide", true);
            callApi.error(err);
        }
    });
}

$("#difficultSearch .continue-search").click(function () {
    $("#difficultSearch .spinner").attr("src", "/app/images/spinner.gif");
});
$("#longerSearch .continue-search").click(function () {
    $("#longerSearch .spinner").attr("src", "/app/images/spinner.gif");
});
$("#sameday").click(function () {
    var time = new Date().getHours();
    if (time > 7 && time < 16) {
        window.location.href = "/app/booking.html?service=" + servicetype;
    } else {
        //  $.growl.error({message : "Same day bookings are only available from 8 AM to 2 PM from Sat to Thu."});
        //$("#messageerror").click();
    }
});


// window.onbeforeunload = function() { return "You work will be lost."; };
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});

//wait genie
function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
        minutes,
        seconds
    };
}

function initializeClock(cls, endtime) {

    function updateClock() {
        const t = getTimeRemaining(endtime);
        if (t.minutes < 1 && t.seconds < 1 && !driverId && isEmergency) {
            $(".genie-wait").addClass("hide-div");
            $(".cancel").addClass("hide-div");
            var uniqueCode = $(".uniqe-code").html();
            $(".sorry-data").html(SORRY_TEMPLATE);
            $(".uniqe-code").html(uniqueCode);
            $(".booking-info").hide();
            $(".booking-genie-info").hide();
            $(".booking-genie-info-sorry").show();
        }
        $(cls).html("00:" + ('0' + t.minutes).slice(-2) + ":" + ('0' + t.seconds).slice(-2));

        if (t.total <= 0 || driverId) {
            clearInterval(timeinterval);
        }
    }
    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
}

$(document).ready(function () {

    var id = localStorage.getItem("current_id");
    // if(id == localStorage.getItem("old_id")){
    //     location.href='/'
    // }
    // ga('send', 'event','AddToCart','Click', 'Confirmation',id);
    gtag('event', 'conversion', { 'send_to': 'AW-939546141/lLooCJC55fsBEJ2sgcAD' });

    // fbq('track', 'Confirmation');

    $("#genieFound").hide();
    $("#difficultSearch").hide();
    $("#longerSearch").hide();
    //  $("#genie-search").modal('show');
    $('.progressbar-dots').removeClass('active');
    $('.progressbar-dots:nth-child(1)').addClass('tick');
    $('.progressbar-dots:nth-child(2)').addClass('tick');
    $('.progressbar-dots:nth-child(3)').addClass('tick');
    $('.progressbar-dots:nth-child(4)').addClass('tick');
    $(".afterConfirmBooking, .service-section, #footer").removeClass('hidden');

    $("#header").css("height", "auto");
    // $('.booking-container').css('paddingTop','90px');
    // if (window.innerWidth < 768) {
    //     $('.booking-container').css('paddingTop','120px');
    // }

    getmybookings(id)

    // fbq('track', 'Purchase');
    //  googleTrackAndAds(document.URL);
    //  var docUrl = document.URL;
    //  docUrl = docUrl.split("/");
    //  var adurl = docUrl[4].split("?")[1];
    //  adurl = (adurl.split("&")[0]).split("=")[1];
    //  gtag('event', 'conversion', {
    //      'send_to': 'AW-939546141/JrztCLL0tIwBEJ2sgcAD',
    //      'transaction_id': adurl //add uniqueCode
    //  });

    $(".cancel-booking-action").click(function () {
        $("#cancel-booking").modal('show');
    });
    $(".sure-button").click(function () {
        $("#cancel-reason").modal('show');
        $("#cancel-booking").modal('hide');
    });

    $(".down-arrow").click(function () {
        $(this).nextAll().toggle();
    });
    const deadline = new Date(Date.parse(new Date()) + 15 * 60 * 1000);
    initializeClock('.wait-time', deadline);

    $(".view-profile").click(function () {
        $("#driver-modal").modal('show');
    });

    //  localStorage.setItem("old_id",id);

});

var genieStarTemplate = '{{#genieStar}}' +
    '<img src="/app/images/{{genieStar.0}}.png" style="max-width:15px;">' +
    '<img src="/app/images/{{genieStar.1}}.png" style="max-width:15px;">' +
    '<img src="/app/images/{{genieStar.2}}.png" style="max-width:15px;">' +
    '<img src="/app/images/{{genieStar.3}}.png" style="max-width:15px;">' +
    '<img src="/app/images/{{genieStar.4}}.png" style="max-width:15px;">' +
    '<span style="position:relative;left:5px;">({{noOfStar}}/5)</span>{{/genieStar}}';

var STAR_RATING_TEMPLATE = '{{#starRating}}\n' +
    '                    <span>\n' +
    '                        <div class="img-class5"><img src="{{star}}" data-src="{{star}}" class="img-responsive"></div>\n' +
    '                    </span>\n' +
    '                    {{/starRating}}';

var SORRY_TEMPLATE = '<div class="expression-icon cancel search-icon">\
                       <img class="img-responsive" src="/img/cancel-sad-emoji.svg">\
                     </div>\
                     <P class="cancel mp-0">Apologies, we are</P>\
                     <P class="cancel mp-0">unable to assign a</P>\
                     <P class="cancel mp-0">Genie to your</P>\
                     <P class="cancel">booking at this moment.</P>\
                     <P class="jobID blue cancel mb-30">JOB ID:<span class="uniqe-code"></span></P>'

var RELATED_SERVICES = '{{#data}}{{#relatedServices}}\
<div class="swiper-slide service-section-slide text-center">\
<div class="related-service-img-box" {{#relatedServices.image}} style="background-image: url(\'{{relatedServices.image}}\')" {{/relatedServices.image}} {{^relatedServices.image}} style="background-image: url(\'{{subCategoryId.image}}\')" {{/relatedServices.image}}></div>\
    <p class="service-font">{{categoryId.name}}{{subCategoryId.subCategoryName}}</p>\
    <p class="service-info">{{text}}</p>\
    {{#categoryId}}\
    <a onclick="goToURL(\'/{{language}}/{{city}}/{{url}}\')" class="service-link" title="detail-page"><img src="/img/three-dot.png" class="img-responsive right-black-arrow" alt="Right Arrow"></a>\
    <a href="/app/booking.html?service={{name}}" title="booking-page">\
        <button class="sub-service-button">BOOK NOW</button>\
    </a>\
    {{/categoryId}}\
    {{^categoryId}}\
    <a onclick="goToURL(\'/{{language}}/{{city}}/{{subCategoryId.url}}\')" class="service-link" title="detail-page"><img src="/img/three-dot.png" class="img-responsive right-black-arrow" alt="Right Arrow"></a>\
    <a href="/app/booking.html?service={{categoryName}}|{{subCategoryId.subCategoryName}}" title="booking-page">\
            <button class="sub-service-button">BOOK {{bookType}}</button>\
    </a>\
    {{#callOutCharges}} <p class="price-value">Starting @ <span> AED {{callOutCharges}} </span></p>{{/callOutCharges}} \
    {{^callOutCharges}} <p class="price-value">Starting @ <span> AED 0.00 </span></p>{{/callOutCharges}} \
    {{/categoryId}}\
</div>\
{{/relatedServices}}{{/data}}';



