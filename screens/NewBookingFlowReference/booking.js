"use strict";

var allAddress, addressType, booleanAns, genieSelected, favGenie, favgenie, serviceBasedType;
var scheduleddate, editlat, editlong, updateAddress, categoryList, whole_data, boolean_data;
var answerIDS = [], promo = 0, addressId, stime, minSelectDate = 0, globalServiceType;
var promoData, globalCategory, globalSubCategoryName, booleanYesNo, subcatUrl, pricingNote, city;
var baseCharge = 0, promoBaseCharge = 0, baseChargeWithoutDiscount = 0, memberPromoFirst, cust_date_to_init;
var QUES = {};
var holidaysList = [];
var bookingData = {};
var WHOLE_COUNT = 0;
var wholeAdditionalCharge, whole;
var slider;
var goToNumber;
var changeCategory = false;
var categoryURL, prevCategory, myCategoryData;
var subCategoryURl, prevSubCategoryURl, subTtypeOfService, subServiceCat, subDataCategory;
var swiperdate, swiperSlot;
var subCatData, subTypeOfService, subServiceCat, subCategory;
var peakCharges, offPeakCharges, emrgencyUnit, peakUnit, isPeakHourAllowed;
var isMandatoryAttachmentText = "", workingday = "", isMandatoryAttachment, problemImgdata = [], totalFileSize = 0;
var isAddOn = false;
var fromModal = false;
var addOnCheck = false;
var isMandatoryCheck = false;
var stepOneCheck = false;
var addOnsList, myAddOnList;
var addOnsFinalList = [];
var getLastBookingdata = false;
var check_boooking_data;
var MSG = {};
MSG.SAMEDAY = "sameday";
MSG.EMERGENCY = "emergency";
MSG.SCHEDULED = "scheduled";
MSG.FIXED = "fp";
MSG.INSPECTION = "ip";
MSG.SURVEY = "surveyBased";
MSG.BOOLEAN = "BOOLEAN";
MSG.INSPECTION_SERVICE = "Inspection based service";
MSG.FIXED_SERVICE = "Fixed price service";
MSG.SURVEY_SERVICE = "Survey based service";
MSG.FRIDAY = "FRIDAY";
MSG.LABOR_TEXT = "Labor (survey charges)";
MSG.LABOR_TEXT_INSPECTION = "Labor (including inspection)";
MSG.EMERGENCY_CHARGE = "An additional Emergency charge is applicable to the booking.";
MSG.FRIDAY_CHARGE = "An additional Friday charge is applicable to the booking.";
MSG.EMERGENCY_ERR = "Emergency booking is not available for this service.";
MSG.SELECT_ALL_INFO = "Provide all information requested for the  booking?";
MSG.WHOLE_MSG = "";
MSG.VILLA_MSG = "Additional Villa charge is ";
MSG.VILLA = "VILLA";
MSG.PEAK = 'peak';
MSG.OFF_PEAK = 'offPeak';
var defaultAdrees = "TRUE", addressType = "VILLA";
var bool_charges = "false";
var apiCity = 'Dubai';
const day = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
citys;
var cities;
var membershipDetails = "";
var total_charges = 0;

apiCity = document.URL.split("/")[4];
if (apiCity === "dubai") {
    apiCity = 'Dubai';
} else if (apiCity === "abu-dhabi") {
    apiCity = "Abu Dhabi";
} else {
    apiCity = localStorage.getItem('current_City');
    apiCity = uppercase(apiCity)
}




function myDefalutAddress(el) {
    defaultAdrees = el.value;
    $(".default-address-button").css("background", "rgb(239, 239, 239)");
    $(".default-address-button").css("color", "rgb(122, 122, 122)");
    $(el).css("background", "#2EB0E4");
    $(el).css("color", "white");
}

function myAdressType(value) {
    addressType = value;
}

var fridayAndHolidaysDisabled = function (date) {
    return disableDays(date);
};

var myAdditionalCharge = 0;

function disableDays(date) {
    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
    // if ($('#autoWidth li.selected-category').data('fridayallowed')) {
    //     return [holidaysList.indexOf(string) == -1 && (date.getDay() == 0 || date.getDay() == 1 || date.getDay() == 2 || date.getDay() == 3 || date.getDay() == 4 || date.getDay() == 5 || date.getDay() == 6)];
    // } else{
    var holidayCheck = new Date(date);
    for (var x in holidaysList) {
        if (moment(holidaysList[x]).format("MMM Do YY") == moment(holidayCheck).format("MMM Do YY")) {
            return [false];
        }
    }
    return [true];
    //return [holidaysList.indexOf(string) == -1 && (date.getDay() == 0 || date.getDay() == 1 || date.getDay() == 2 || date.getDay() == 3 || date.getDay() == 4 || date.getDay() == 6)];
    // }
}

var checkFriday = fridayAndHolidaysDisabled;

let getExpiryDate = (date) => {
    let duration;
    let subcatName = $(".servicetype-select option:selected").val();
    if (subcatName && subcatName.indexOf('3') !== -1) {
        duration = 3;
    } else if (subcatName && subcatName.indexOf('6') !== -1) {
        duration = 6;
    } else if (subcatName && subcatName.indexOf('12') !== -1) {
        duration = 12;
    }
    if (date) {
        date = date
    } else {
        date = $(".datepickers").text();
    }
    let expiryDate = new Date(date);
    expiryDate.setMonth(expiryDate.getMonth() + duration);
    expiryDate.setDate(expiryDate.getDate() - 1);
    return expiryDate.toDateString();
}

// disable holidays for emergency and SAMEDAY
function disableHolidaysForServices() {
    var date = $('.datepickers').text();
    if (holidaysList && holidaysList.length > 0) {
        for (var i = 0; i < holidaysList.length; i++) {
            if ((new Date(date).toDateString()) === (new Date(holidaysList[i]).toDateString())) {
                var selectedDate = formatDateList(date);
                var message = "We are closed on the " + selectedDate + " due to it being public holiday";
                showMessageToUser(message);
            }
        }
    }
}

function goToHomepage(url, btnName) {
    url = `/en/${localStorage.getItem("current_City").toLowerCase()}`
    if (url.indexOf('/dubai/pcr-test-at-home') > -1) {
        fbq('track', 'viewContent');
    }
    if (btnName == "No") {
        ga("send", "event", btnName, "Click", "Cancel", "0");
    } else {
        ga("send", "event", btnName, "Click", "Cancel", "0");
        window.location.href = url;
        event.stopPropagation();
    }

}

function getAllCategories(catSubCatUrl) {

    if (categoryList != undefined) {
        processAllcategories(categoryList, catSubCatUrl);
    } else {
        var params = {};

        callApi.getUrl(apiUrl + "/api/category/getAllCategories", params, function (err, res) {
            if (!err && res) {
                categoryList = res;
                processAllcategories(res, catSubCatUrl)
            } else {

                err = JSON.parse(err);
                showMessageToUser(err.message)
            }
        });
    }
}

function processAllcategories(res, catSubCatUrl) {
    var categoryTemplate, categories, categoriesArray = [], checkCatArray = [], categoryData = {};
    categoryTemplate = '{{#category}}<option value="{{name}}" data-id="{{id}}">{{name}}</option>{{/category}}';
    categories = res.data;
    for (var k in categories) {
        var data = {};
        checkCatArray.push(categories[k].name);
        data.name = categories[k].name;
        data.id = categories[k]._id;
        data.isPopular = categories[k].isPopular;
        categoriesArray.push(data);
    }
    categoryData.category = categoriesArray;
    $(".select-maincategory").html(Mustache.render(categoryTemplate, categoryData));
    var catUrl;
    if (!catSubCatUrl) {
        catUrl = (document.URL).split("?")[1];
        whole_data = (document.URL).split("|")[2];
        boolean_data = (document.URL).split("|")[3];
        if (catUrl) {
            catUrl = decodeURIComponent(catUrl.split("=")[1]);
        }
        if (whole_data) {
            whole_data = decodeURIComponent(whole_data.split("=")[1]);
        }
        if (boolean_data) {
            boolean_data = decodeURIComponent(boolean_data.split("=")[1]);
        }
    } else {
        catUrl = decodeURIComponent(catSubCatUrl);
    }
    if (catUrl && catUrl.match(/\|/)) {
        catUrl = catUrl.split("|");
        if (catUrl && catUrl.length > 0 && catUrl[1].match(/promo/gi)) {
            setTimeout(function () {
                $(".enterPromo").val(((document.URL).split("|")[1]).split("=")[1]);
            }, 300)
        } else {
            subcatUrl = catUrl[1];
        }
        catUrl = catUrl[0];
        prevCategory = catUrl;
    }

    // show subcategoryList for selected categories
    if (catUrl != MSG.EMERGENCY && catUrl != MSG.SAMEDAY && catUrl != MSG.SCHEDULED && checkCatArray.indexOf(catUrl) != -1) {
        showSubCategoryList(catUrl, categories);
    }

    //changing main category
    if (!prevCategory) {
        prevCategory = $(".select-maincategory").val();
    } else {
        $(".select-maincategory").val(prevCategory);
    }

    $(".select-maincategory").change(function () {
        changeCategory = true;
        $("#cancel-current-booking-data").modal("show");
        categoryURL = $(this);
        myCategoryData = categories;
        subcatUrl = false;
    });

    if (catUrl === 'Membership') {
        changeMembershiUi();
    }

    $.LoadingOverlay("hide", true);
}

// });
// }

function showSubCategoryList(serviceCat, categories) {
    var slider_Template, select_Template, category = {}, serviceType, service = {}, serviceTypeArray = [],
        typeOfService = {};
    select_Template = '<select class="servicetype-select" style="max-height: 65px;" label=""><option value="">Choose need or issue</option>{{#serviceType}}<option value="{{subCategoryName}}" data-id="{{_id}}" data-emergency="{{emergencyCharge}}" data-emergencyAllowed="{{emergencyAllowed}}" data-emergencyInPercent="{{emergencyChargesInPercent}}" data-emergencyInAmount="{{emergencyChargesInAmount}}" data-fridayAllowed="{{fridayAllowed}}" data-friday="{{fridayCharges}}" data-fridayInAmount="{{fridayChargesInAmount}}" data-fridayChargesInPercent="{{fridayChargesInPercent}}" data-discountFactor="{{discountFactor}}" data-discountFactorInAmount="{{discountInAmount}}" data-discountFactorInPercent="{{discountFactorInPercent}}" data-advanceCharges="{{advanceCharges}}" data-advanceChargesInAmount="{{advanceChargesInAmount}}" data-advanceChargesInPercent="{{advanceChargesInPercent}}" data-callOutCharges="{{callOutCharges}}" data-firstUnitCharges="{{firstUnitCharges}}" data-restUnitCharges="{{restUnitCharges}}" data-villaCharges="{{villaCharges}}">{{subCategoryName}}</option>{{/serviceType}}</select>';
    slider_Template = '{{#serviceType}}<li class="item-a" data-image="{{image}}" data-id="{{_id}}" data-emergency="{{emergencyCharge}}" ' +
        'data-emergencyAllowed="{{emergencyAllowed}}" data-emergencyInPercent="{{emergencyChargesInPercent}}" data-emergencyInAmount="{{emergencyChargesInAmount}}" ' +
        'data-fridayAllowed="{{fridayAllowed}}" data-friday="{{fridayCharges}}" data-fridayInAmount="{{fridayChargesInAmount}}" ' +
        'data-fridayChargesInPercent="{{fridayChargesInPercent}}" data-discountFactor="{{discountFactor}}" data-discountFactorInAmount="{{discountInAmount}}" ' +
        'data-discountFactorInPercent="{{discountFactorInPercent}}" data-advanceCharges="{{advanceCharges}}" data-advanceChargesInAmount="{{advanceChargesInAmount}}" ' +
        'data-advanceChargesInPercent="{{advanceChargesInPercent}}" data-callOutCharges="{{callOutCharges}}" data-firstUnitCharges="{{firstUnitCharges}}" ' +
        'data-restUnitCharges="{{restUnitCharges}}" data-villaCharges="{{villaCharges}}" data-url="{{url}}" data-index="{{index}}"' +
        'data-isPeakHourAllowed="{{isPeakHourAllowed}}" data-peakCharges="{{peakCharges}}" data-offPeakCharges="{{offPeakCharges}}" data-peakHourChargesInAmount="{{peakHourChargesInAmount}}" data-peakHourChargesInPercent="{{peakHourChargesInPercent}}" data-minimumAddOnCharge={{minimumAddOnCharge}}>' +
        '<span>{{subCategoryName}}</span><img class="img-responsive" src="/app/images/selected.png" style="display: none; margin-left:5px; height: 15px;"></li>{{/serviceType}}';


    $(".issue-booking").html(serviceCat);
    $(".selected-category-title").html(serviceCat + " | ");
    for (var k in categories) {
        if (categories[k].name == serviceCat) {
            category[categories[k].name] = categories[k];
            $(".category-icon").attr("src", categories[k].imageURL.original);
            localStorage.setItem("categoryWhiteImage", categories[k].whiteImage.original);
            // if (localStorage.getItem("isMember") === "true") {
            //     $(".category-subcategory-section .category-icon").attr("src", categories[k].whiteImage.original);
            // }
            $(".air-conditioning").html('<img src="' + categories[k].imageURL.original + '" class="ac-img">' + serviceCat);
        }
    }


    serviceType = category[serviceCat].subcategories;
    localStorage.setItem("categoryName", category[serviceCat].name);
    for (var k in serviceType) {
        var quesdata = {};
        quesdata.subCategoryName = serviceType[k].subCategoryName;
        quesdata.emergencyCharge = serviceType[k].emergencyCharges;
        quesdata.emergencyAllowed = (serviceType[k].emergencyBookingAllowed).toString();
        quesdata._id = serviceType[k]._id;
        quesdata.emergencyChargesInPercent = serviceType[k].emergencyChargesInPercent;
        quesdata.emergencyChargesInAmount = serviceType[k].emergencyChargesInAmount;
        quesdata.fridayAllowed = serviceType[k].fridayBookingsAllowed;
        quesdata.fridayChargesInPercent = serviceType[k].fridayChargesInPercent;
        quesdata.fridayChargesInAmount = serviceType[k].fridayChargesInAmount;
        quesdata.fridayCharges = serviceType[k].fridayCharges;
        quesdata.discountFactor = serviceType[k].discountFactor;
        quesdata.discountFactorInPercent = serviceType[k].discountFactorInPercent;
        quesdata.discountFactorInAmount = serviceType[k].discountFactorInAmount;
        quesdata.advanceCharges = serviceType[k].advanceCharges;
        quesdata.advanceChargesInPercent = serviceType[k].advanceChargesInPercent;
        quesdata.advanceChargesInAmount = serviceType[k].advanceChargesInAmount;
        quesdata.callOutCharges = serviceType[k].callOutCharges;
        quesdata.villaCharges = serviceType[k].villaCharges.inAmount;
        quesdata.image = serviceType[k].image;
        quesdata.url = serviceType[k].url;
        quesdata.index = k;
        quesdata.minimumAddOnCharge = serviceType[k].minimumAddOnCharge;
        if (serviceType[k].unitCharges && serviceType[k].unitCharges.firstUnitCharges) {
            quesdata.firstUnitCharges = serviceType[k].unitCharges.firstUnitCharges;
            quesdata.restUnitCharges = serviceType[k].unitCharges.restUnitCharges;
        }
        if (serviceType[k].isPeakHourAllowed) {
            quesdata.peakCharges = serviceType[k].peakHourCharges;
            quesdata.offPeakCharges = serviceType[k].offPeakHourCharges;
            quesdata.isPeakHourAllowed = serviceType[k].isPeakHourAllowed;
            quesdata.peakHourChargesInPercent = serviceType[k].peakHourChargesInPercent;
            quesdata.peakHourChargesInAmount = serviceType[k].peakHourChargesInAmount;
        }

        serviceTypeArray.push(quesdata);
        if (serviceType[k]["unitCharges"]["firstUnitCharges"]) {
            typeOfService[serviceType[k]["subCategoryName"]] = MSG.FIXED;
        } else if (serviceType[k]["callOutCharges"]) {
            typeOfService[serviceType[k]["subCategoryName"]] = MSG.INSPECTION;
        } else if (serviceType[k]["callOutCharges"] == 0) {
            typeOfService[serviceType[k]["subCategoryName"]] = MSG.SURVEY;
        }
    }

    service.serviceType = serviceTypeArray;
    $("#add-subcat").html(Mustache.render(select_Template, service));
    $("#autoWidth").html(Mustache.render(slider_Template, service));
    customSelect();
    initializeSubCategoryList(null, typeOfService, serviceCat, category);

    if (subcatUrl == false) {
        subcatUrl = serviceType[0].subCategoryName;
    }

    if (subcatUrl) {
        $(".servicetype-select").val(subcatUrl);
        $(".ans-yes-add, .ans-no-add").show();
        $(".book-continue-btn").hide();

        setTimeout(function () {
            $("#autoWidth li").each(function (index) {
                if ($(this).text() === subcatUrl) {
                    $(this).addClass("selected-category");
                    prevSubCategoryURl = $(this);
                    $("#autoWidth li.selected-category img").show();
                    var bgImage = $("#autoWidth li.selected-category").data("image");

                    goToNumber = parseInt($("#autoWidth li.selected-category").data("index"));
                    slider.goToSlide(goToNumber);

                    // $(".category-image").attr("src",bgImage);
                    $(".category-image").css("background-image", "url(" + bgImage + ")");
                    $(".selected-subcategory-title").html($("#autoWidth li.selected-category span").text());
                    $(".cat-selected").removeClass('hidden');
                    initializeServiceCategorizarion($("#autoWidth li.selected-category").data("url"));
                    if ($("#autoWidth li.selected-category").data("emergencyallowed") == true) {
                        $(".scope-icons-emergency .avail-img img").attr("src", "/app/images/emergency-2x.png");
                    } else {
                        $(".scope-icons-emergency .avail-img img").attr("src", "/app/images/emergency-2x-gray.png");
                    }
                    if ($("#autoWidth li.selected-category").data("fridayallowed") == true) {
                        $(".scope-icons-friday .avail-img img").attr("src", "/app/images/friday-2x.png");
                    } else {
                        $(".scope-icons-friday .avail-img img").attr("src", "/app/images/friday-2x-gray.png");
                    }
                } else {
                    $(this).removeClass("selected-category");
                }
            });
            $(".select-selected").html(subcatUrl);
            selectSubCategory(typeOfService, serviceCat, category);
            listClicked();
            // $(".cat-selected").removeClass('hidden');
        }, 300)
    }

    $(".servicetype-select, .select-items div").on('click', function () {
        var selected_sub = $(this).text();
        $(".ans-yes-add, .ans-no-add").show();
        $(".book-continue-btn").hide();
        $("#autoWidth li").each(function (index) {
            if ($(this).text() === selected_sub) {
                subCatData = $(this);
                subTypeOfService = typeOfService;
                subServiceCat = serviceCat;
                subCategory = category;
                $("#cancel-current-booking-data-mobile").modal("show");

            } else {
                $(this).removeClass("selected-category");
            }
        });
    });
}

function changeMySubCat() {
    subCatData.addClass("selected-category");
    prevSubCategoryURl = subCatData;
    $("#autoWidth li img").hide();
    $("#autoWidth li.selected-category img").show();
    var bgImage = $("#autoWidth li.selected-category").data("image");

    // $(".category-image").attr("src",bgImage);
    $(".category-image").css("background-image", "url(" + bgImage + ")");
    $(".selected-subcategory-title").html($(".subcategory-ul li.selected-category").text());
    initializeServiceCategorizarion($("#autoWidth li.selected-category").data("url"));
    /*update service details image*/
    if ($("#autoWidth li.selected-category").data("emergencyallowed") == true) {
        $(".scope-icons-emergency .avail-img img").attr("src", "/app/images/emergency-2x.png");
    } else {
        $(".scope-icons-emergency .avail-img img").attr("src", "/app/images/emergency-2x-gray.png");
    }
    if ($("#autoWidth li.selected-category").data("fridayallowed") == true) {
        $(".scope-icons-friday .avail-img img").attr("src", "/app/images/friday-2x.png");
    } else {
        $(".scope-icons-friday .avail-img img").attr("src", "/app/images/friday-2x-gray.png");
    }
    $(".date-picker").attr("id", "datepicker");
    promoData = {};
    bookingData = {};
    WHOLE_COUNT = 0;
    selectSubCategory(subTypeOfService, subServiceCat, subCategory);
    listClicked();
    $(".cat-selected").removeClass('hidden');
}

function prevSubCatValue() {
    $(".select-selected").html(prevSubCategoryURl.text());
}

function selectSubCategory(typeOfService, serviceCat, category) {
    var subcategory = $("#autoWidth li.selected-category").text();
    var subCategoryName = $("#autoWidth li.selected-category").text();
    $(".issue-booking").attr("data-id", $(".servicetype-select option:selected").data("id"));
    $(".issue-booking").html(serviceCat + " | " + subCategoryName);
    switch (typeOfService[subcategory]) {
        case MSG.INSPECTION:
            $(".subcategoryType").html(MSG.INSPECTION_SERVICE);
            $(".service-check-charge").html("Labor (including inspection)");
            globalServiceType = MSG.INSPECTION;
            $(".baseService").html((MSG.INSPECTION_SERVICE).toUpperCase());
            $(".book-box>p").html("BOOK INSPECTION");
            $(".fixed-price-cancellation-note").addClass('hidden');
            break;
        case MSG.FIXED:
            $(".subcategoryType").html(MSG.FIXED_SERVICE);
            $(".service-check-charge").html("Service charges");
            globalServiceType = MSG.FIXED;
            $(".baseService").html((MSG.FIXED_SERVICE).toUpperCase());
            $(".book-box>p").html(serviceCat == "Membership" ? "BECOME A MEMBER NOW" : "BOOK SERVICE")
            $(".fixed-price-cancellation-note").removeClass('hidden');
            break;
        case MSG.SURVEY:
            $(".subcategoryType").html(MSG.SURVEY_SERVICE);
            $(".service-check-charge").html("Survey charges");
            globalServiceType = MSG.SURVEY;
            $(".baseService").html((MSG.SURVEY_SERVICE).toUpperCase());
            $(".book-box>p").html("BOOK FREE SURVEY");
            $(".fixed-price-cancellation-note").addClass('hidden');
            break;
    }

    globalCategory = category;
    globalSubCategoryName = subCategoryName;
    getBookingInfo(globalCategory, globalSubCategoryName);
}

var unit;


function getBookingInfo(category, subCategoryName) {
    var categoryName = (Object.keys(category))[0];
    var subcategories = category[categoryName].subcategories;
    if (localStorage.getItem("subCategoryName")) {
        localStorage.setItem("oldSubCategoryName", localStorage.getItem("subCategoryName"));
    }
    localStorage.setItem("subCategoryName", subCategoryName);
    for (var k in subcategories) {
        if (subcategories[k].subCategoryName == subCategoryName) {
            isMandatoryAttachment = subcategories[k].isMandatoryAttachment;
            isMandatoryAttachmentText = subcategories[k].mandatoryInstruction;
            var note = [];
            if (subcategories && subcategories[k].serviceNotes) {
                note[0] = subcategories[k].serviceNotes;
                $("#service-included").html(note[0]);
            }
            if (subcategories && subcategories[k].customerNotes) {
                note[1] = subcategories[k].customerNotes;
                $("#serviceDetails-note").html(note[1]);
            }
            if (subcategories && subcategories[k].warranty && subcategories[k].warranty.length > 0) {
                $("#warranty").html(subcategories[k].warranty[0].warrantyText)
            } else {
                $("#warranty").html("As provided in the bill estimate.")
            }
            pricingNote = subcategories[k].pricingUnitNote;
            var data = {};
            var questions = subcategories[k].questions;

            //enable/disable datepicker for friday
            if (subcategories[k].fridayBookingsAllowed) {
                checkFriday = fridayAndHolidaysDisabled;
            } else {
                checkFriday = fridayAndHolidaysDisabled;
            }
            for (var idx in questions) {
                questions[idx][questions[idx]["type"]] = true;
                if (questions[idx]["type"] == MSG.BOOLEAN) {
                    var answers = questions[idx].answers;
                    for (var key in answers) {
                        if (answers[key].answer == "YES") {
                            booleanAns = answers[key]._id;
                        }
                    }
                }
            }

            data.ques = questions;
            addOnsList = []
            for (let k in data.ques) {
                if (data.ques[k].type === "WHOLE") {
                    QUES.WHOLE = data.ques[k];
                    $(".whole-ques").html(data.ques[k].question);
                    MSG.WHOLE_MSG = data.ques[k].question + " can't be less than";
                    let unit_bool = data.ques[k].question.trim().split(" ");
                    if (unit_bool.length > 2) {
                        if (unit_bool[2].trim()) {
                            $(".unit-bool").html(unit_bool[2])
                            unit = unit_bool[2];
                        } else {
                            $(".unit-bool").html(unit_bool[3])
                            unit = unit_bool[3];
                        }
                    }
                    for (let answer in data.ques[k].answers) {
                        $(".input-num").html(data.ques[k].answers[0].answer)
                    }
                    if (data.ques[k].additionalCharges) {
                        if (!unit) {
                            unit = 'unit'
                        }
                        $(".whole_add_charge").html(data.ques[k].additionalCharges + "/" + unit);
                        $(".whole_additional_charge").removeClass("hidden");
                        $(".p-not-add").show();
                    }

                } else if (data.ques[k].type === "BOOLEAN") {
                    QUES.BOOLEAN = data.ques[k];
                    $(".boolean-ques").html(data.ques[k].question);
                    for (let answer in data.ques[k].answers) {
                        data.ques[k].answers[answer].cssname = data.ques[k].answers[answer].answer.toLowerCase();
                        if (data.ques[k].answers[answer].answer === "YES") {

                            if (data.ques[k].additionalCharges) {
                                bool_charges = data.ques[k].additionalCharges;
                                myAdditionalCharge = data.ques[k].additionalCharges;
                                if (!unit) {
                                    unit = 'unit'
                                }
                                $(".aed-price-note").html(myAdditionalCharge);
                                $(".p-not-add").show();
                            } else {
                                $(".p-not-add").hide();
                                bool_charges = 0;
                                myAdditionalCharge = 0;
                            }


                        } else if (data.ques[k].answers[answer].answer === "NO") {

                        }
                    }
                } else if (data.ques[k].type === "DESCRIPTIVE") {
                    data.ques[k].status = false;
                    if (data.ques[k].answers.length) {
                        $(".descriptive-ques1").html(data.ques[k].question);
                        data.ques[k].status = true;
                    }
                } else if (data.ques[k].type === "ADD_ONS") {
                    addOnsList.push([data.ques[k]])
                }
            }

            var html = "";
            for (var x in data.ques) {
                if (data.ques[x].type == "BOOLEAN") {
                    var tempAns = data.ques[x].answers[0];
                    if (data.ques[x].answers[0].answer == "NO") {
                        data.ques[x].answers[0] = data.ques[x].answers[1];
                        data.ques[x].answers[1] = tempAns;
                    }
                }
            }
            html += Mustache.render(quesTemplate, data);
            let booleanQuesAnsTemplate = Mustache.render(quesTemplate3, data);
            $(".booleanQuesAns").html(booleanQuesAnsTemplate)
            $("#add-info").html(html);


            if (myAdditionalCharge) {
                $(".add_charge").html(myAdditionalCharge + "/" + unit);
                $(".additional_charge").removeClass("hidden");
            }

            var coc = subcategories[k].callOutCharges;
            $("#callOutCharges").html(coc + " AED");
            $(".cat-img").attr("src", category[categoryName].imageURL.original);
            $(".air-conditioning").html('<img src="' + category[categoryName].imageURL.original + '" class="ac-img">' + categoryName + " | " + subCategoryName);

            $(".yes-button, .no-button").click(function () {
                $(".alert-message").html("");
                $(".booleanQuesAns button").removeClass("blue-button");
                $(this).addClass("blue-button");
                booleanYesNo = $(this).data("answer");
                $(".boolean-yes-noBox").removeClass("hidden");
                $(".boolean-yes-no").html(booleanYesNo);
                bookingData.booleanYesNo = booleanYesNo;
                calculateCharges();
            });


            $(".select-descriptive").on("change", function () {
                $(this).addClass(' option-selected ');
                $(".descriptive-answer").html($(".select-descriptive option:selected").text().slice(2,));
                $(".desc-selected").removeClass("hidden");
                $(".alert-message").html("");
                bookingData.descriptiveIndex = $(".select-descriptive option:selected").index();
            });
        }
    }
}

/* TODO: enable or disable service priority based on the selected subcategory*/
function daysInMonth(date) {
    var date = date.split("-");
    var currentDate = new Date().getDate();
    var dateDiff = date[2] - parseInt(currentDate);
    var noOfdays = new Date(date[0], date[1], 0).getDate();
    if (parseInt(date[2]) > parseInt(noOfdays)) {
        date[2] = getTwoDigit(dateDiff.toString());
        var now = new Date();
        date[1] = new Date(now.getFullYear(), now.getMonth() + 1, 1).getMonth() + 1;
        date[1] = getTwoDigit(date[1].toString());
        if (new Date().getMonth() == 11) {
            date[0] = new Date().getFullYear() + 1;
        }
        date = date.join("-");
        return date;
    } else {
        return date.join("-");
    }

}

function setDate() {
    var d = new Date();
    var date = new Date(d.getTime()).toString();
    date = d.getFullYear() + "-" + ((d.getMonth() + 1) < 10 ? ("0" + (d.getMonth() + 1)) : ((d.getMonth() + 1))) + "-" + ((d.getDate()).toString().length > 1 ? (d.getDate() + 1) : (d.getDate() + 1).toString().length > 1 ? (d.getDate() + 1) : "0" + (d.getDate() + 1));
    date = daysInMonth(date);
    createCustomDate(date);
}

function updateDateToCalendar(date) {
    workingday = day[new Date(date).getDay()];
    $(".datepickers").html(new Date(date).toDateString());
    $("#selectedMonth").html(MONTH[new Date(date).getMonth()]);
    $("#selectedYear").html(new Date(date).getFullYear());
    var dayName = new Date(date);
    var dayName = dayName.toString().split(' ')[0];
    $("#dayName").html(dayName);
    $("#selectedDate").html(new Date(date).getDate());
    $(".date-time, .date-times").html($(".select-time li.selected-slots").text());
    $(".time-slot").html($(".select-time li.selected-slots").text());
    $(".expiry-date-time").html(getExpiryDate(new Date(date)) + " | " + "8AM - 10AM");
    scheduleddate = date + "T06:30:00.000Z";
    if (workingday == MSG.FRIDAY) {
        showFridayMessage();
        calculateCharges();
    }
    calculateCharges();
}


function initializeSubCategoryList(selectedSubCategory, typeOfService, serviceCat, category) {
    slider = $('#autoWidth').lightSlider({
        autoWidth: true,
        items: 3,
        slideMove: 1,
        loop: false,
        controls: false,
        pager: false,
        enableDrag: false,
        onSliderLoad: function (el) {
            $("#goToPrevSlide, #goToNextSlide").removeClass("hidden");
        }
    });
    $('#goToPrevSlide').on('click', function () {
        slider.goToPrevSlide();
    });
    $('#goToNextSlide').on('click', function () {
        slider.goToNextSlide();
    });

    $(".subcategory-ul li").click(function () {
        changeCategory = false;
        subCategoryURl = $(this);
        if (prevSubCategoryURl.text() == subCategoryURl.text()) {
            return;
        }
        $("#cancel-current-booking-data").modal("show");
        subCategoryURl = $(this);
        subTtypeOfService = typeOfService;
        subServiceCat = serviceCat;
        subDataCategory = category;
    });
}

var slotDetails = {};


function updateTimeSlot(dateToSet) {
    if (slotDetails == {}) {
        getSlots()
    }

    var selectedDate = new Date(dateToSet);
    var slotForTheDay = slotDetails.slots[selectedDate.getDay()].slots;
    var duration = 0;

    $(".alert-message").html("");

    var today = new Date();
    var time = today.getHours();
    var peakCharges = $("#autoWidth li.selected-category").data("peakcharges");
    var offPeakCharges = $("#autoWidth li.selected-category").data("offpeakcharges")
    var isPeakHourAllowed = $("#autoWidth li.selected-category").data("ispeakhourallowed");
    var peakHourChargesInPercent = $("#autoWidth li.selected-category").data("peakhourchargesinpercent");
    var peakHourChargesInAmount = $("#autoWidth li.selected-category").data("peakhourchargesinamount");
    var emergencyInPercent = $("#autoWidth li.selected-category").data("emergencyinpercent");
    var emergencyInAmount = $("#autoWidth li.selected-category").data("emergencyinamount");
    var emergencyCharges = $("#autoWidth li.selected-category").data("emergency");
    var isEmergencyAllowed = $("#autoWidth li.selected-category").data("emergencyallowed");
    emergencyCharges = emergencyCharges ? parseFloat(emergencyCharges) : 0;

    if (peakHourChargesInPercent) {
        peakUnit = "%"
    } else if (peakHourChargesInAmount) {
        peakUnit = "AED"
    } else {
        peakUnit = ""
    }

    if (emergencyInPercent) {
        emrgencyUnit = "%"
    } else if (emergencyInAmount) {
        emrgencyUnit = "AED"
    } else {
        emrgencyUnit = ""
    }

    if (isEmergencyAllowed) {
        duration = slotDetails.slots[selectedDate.getDay()].duration / 60;
    } else {
        duration = 0;
    }

    if (selectedDate.getDate() == today.getDate() && selectedDate.getMonth() == today.getMonth()) {
        var option = "";
        var temp = 0;
        if (isEmergencyAllowed) {
            changeMypriority("EMERGENCY");
            if (time == 24) {
                time = 0;
            }
            //use moment
            for (var x in slotForTheDay) {
                if ((slotForTheDay[x].startTime / 60) > time) {
                    slotForTheDay[x].slotStartTime = parseInt(slotForTheDay[x].startTime / 60 >= 12 ? (slotForTheDay[x].startTime / 60) % 12 == 0 ? 12 : (slotForTheDay[x].startTime / 60) % 12 : slotForTheDay[x].startTime / 60) + (slotForTheDay[x].startTime % 60 == 0 ? "" : ":" + slotForTheDay[x].startTime % 60) + (slotForTheDay[x].startTime / 60 >= 12 ? "PM" : "AM");
                    slotForTheDay[x].slotEndTime = parseInt(slotForTheDay[x].endTime / 60 >= 12 ? (slotForTheDay[x].endTime / 60) % 12 == 0 ? 12 : (slotForTheDay[x].endTime / 60) % 12 : slotForTheDay[x].endTime / 60) + (slotForTheDay[x].endTime % 60 == 0 ? "" : ":" + slotForTheDay[x].endTime % 60) + (slotForTheDay[x].endTime / 60 >= 12 ? "PM" : "AM");
                    if (slotForTheDay[x].isDisabled) {
                        option = "<li value='" + temp + "' disabled class='opacity_05 swiper-slide'><div class='slot-list ' ><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + "</span><span class='normal'>(Not available)</span></div></li>";
                        temp += 1;
                    } else {
                        if (slotForTheDay[x].isPeak && peakCharges && isPeakHourAllowed) {
                            if (emrgencyUnit == peakUnit) {
                                option = "<li value='" + temp + "' onclick='changeMypriority(\"EMERGENCY\",\"peak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='peak-emergency'>Emergency + Peak</br>(+" + (emergencyCharges + peakCharges) + " " + peakUnit + ")</span></div></li>";
                                temp += 1;
                            } else {
                                option = "<li value='" + temp + "' onclick='changeMypriority(\"EMERGENCY\",\"peak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='peak-emergency'>Emergency + Peak</br>(+" + emergencyCharges + emrgencyUnit + " + " + peakCharges + " " + peakUnit + ")</span></div></li>";
                                temp += 1;
                            }
                        } else if (slotForTheDay[x].isOff && offPeakCharges && isPeakHourAllowed) {
                            if (emrgencyUnit == peakUnit) {
                                option = "<li value='" + temp + "' onclick='changeMypriority(\"EMERGENCY\",\"offPeak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='peak-emergency'>Emergency - Off-Peak</br>(+" + (emergencyCharges - offPeakCharges) + " " + peakUnit + ")</span></div></li>";
                                temp += 1;
                            } else {
                                option = "<li value='" + temp + "' onclick='changeMypriority(\"EMERGENCY\",\"offPeak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='peak-emergency'>Emergency - Off-Peak</br>(+" + emergencyCharges + emrgencyUnit + " - " + offPeakCharges + " " + peakUnit + ")</span></div></li>";
                                temp += 1;
                            }
                        } else {
                            option = "<li value='" + temp + "' onclick='changeMypriority(\"EMERGENCY\",\"normal\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='peak-emergency'>Emergency(+" + emergencyCharges + emrgencyUnit + ")</span></div></li>";
                            temp += 1;
                        }
                    }
                    break;
                }
            }
        }
        for (var x in slotForTheDay) {
            if ((slotForTheDay[x].startTime / 60) > (time + duration)) {
                slotForTheDay[x].slotStartTime = parseInt(slotForTheDay[x].startTime / 60 >= 12 ? (slotForTheDay[x].startTime / 60) % 12 == 0 ? 12 : (slotForTheDay[x].startTime / 60) % 12 : slotForTheDay[x].startTime / 60) + (slotForTheDay[x].startTime % 60 == 0 ? "" : ":" + slotForTheDay[x].startTime % 60) + (slotForTheDay[x].startTime / 60 >= 12 ? "PM" : "AM");
                slotForTheDay[x].slotEndTime = parseInt(slotForTheDay[x].endTime / 60 >= 12 ? (slotForTheDay[x].endTime / 60) % 12 == 0 ? 12 : (slotForTheDay[x].endTime / 60) % 12 : slotForTheDay[x].endTime / 60) + (slotForTheDay[x].endTime % 60 == 0 ? "" : ":" + slotForTheDay[x].endTime % 60) + (slotForTheDay[x].endTime / 60 >= 12 ? "PM" : "AM");
                if (slotForTheDay[x].isDisabled) {
                    option += "<li value='" + temp + "' disabled class='opacity_05 swiper-slide'><div class='slot-list ' ><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + "</span><span class='normal'>(Not available)</span></div></li>";
                    temp += 1;
                } else {
                    if (slotForTheDay[x].isPeak && peakCharges && isPeakHourAllowed) {
                        option += "<li value='" + temp + "' onclick='changeMypriority(\"SAMEDAY\",\"peak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='peak'>Peak(+" + peakCharges + " " + peakUnit + ")</span></div></li>";
                        temp += 1;
                    } else if (slotForTheDay[x].isOff && offPeakCharges && isPeakHourAllowed) {
                        option += "<li value='" + temp + "' onclick='changeMypriority(\"SAMEDAY\",\"offPeak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='off-peak'>Off-Peak(-" + offPeakCharges + " " + peakUnit + ")</span></div></li>";
                        temp += 1;
                    } else {
                        option += "<li value='" + temp + "' onclick='changeMypriority(\"SAMEDAY\",\"normal\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list ' ><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span></div></li>";
                        temp += 1;
                    }
                }
            }
        }
        if (option == "") {
            $(".swiper-wrapper-datetime li:nth-child(2)").click();
            return;
        }
        $(".select-time").html(option);
        selectTimeInit();
        calculateCharges();
        disableHolidaysForServices();
    } else {
        changeMypriority((MSG.SCHEDULED).toUpperCase());
        var option = "";
        var temp = 0;
        for (var x in slotForTheDay) {
            slotForTheDay[x].slotStartTime = parseInt(slotForTheDay[x].startTime / 60 >= 12 ? (slotForTheDay[x].startTime / 60) % 12 == 0 ? 12 : (slotForTheDay[x].startTime / 60) % 12 : slotForTheDay[x].startTime / 60) + (slotForTheDay[x].startTime % 60 == 0 ? "" : ":" + slotForTheDay[x].startTime % 60) + (slotForTheDay[x].startTime / 60 >= 12 ? "PM" : "AM");
            slotForTheDay[x].slotEndTime = parseInt(slotForTheDay[x].endTime / 60 >= 12 ? (slotForTheDay[x].endTime / 60) % 12 == 0 ? 12 : (slotForTheDay[x].endTime / 60) % 12 : slotForTheDay[x].endTime / 60) + (slotForTheDay[x].endTime % 60 == 0 ? "" : ":" + slotForTheDay[x].endTime % 60) + (slotForTheDay[x].endTime / 60 >= 12 ? "PM" : "AM");
            if (slotForTheDay[x].isDisabled) {
                option += "<li value='" + temp + "' disabled class='opacity_05 swiper-slide'><div class='slot-list ' ><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + "</span><span class='normal'>(Not available)</span></div></li>";
                temp += 1;
            } else {
                if (slotForTheDay[x].isPeak && peakCharges && isPeakHourAllowed) {
                    option += "<li value='" + temp + "' onclick='changeMypriority(\"SCHEDULED\",\"peak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='peak'>Peak(+" + peakCharges + " " + peakUnit + ")</span></div></li>";
                    temp += 1;
                } else if (slotForTheDay[x].isOff && offPeakCharges && isPeakHourAllowed) {
                    option += "<li value='" + temp + "' onclick='changeMypriority(\"SCHEDULED\",\"offPeak\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list'><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span><span class='off-peak'>Off-Peak(-" + offPeakCharges + " " + peakUnit + ")</span></div></li>";
                    temp += 1;
                } else {
                    option += "<li value='" + temp + "' onclick='changeMypriority(\"SCHEDULED\",\"normal\"," + slotForTheDay[x].startTime + "," + slotForTheDay[x].endTime + ")' class='swiper-slide'><div class='slot-list ' ><span class='slot-img'>" + slotForTheDay[x].slotStartTime + " - " + slotForTheDay[x].slotEndTime + " <img class='img-responsive img-h15 img-ml3' src='/app/images/selected.png' style='display:none;'></span></div></li>";
                    temp += 1;
                }
            }
        }
        $(".select-time").html(option);

        selectTimeInit();
        calculateCharges();
        disableHolidaysForServices();
    }
}


function getAndUpdateCustomerAddress() {
    $.LoadingOverlay("show");
    var params = {};
    params.Auth = udata.data.accessToken;
    callApi.getUrl(apiUrl + "/api/customer/getAllAddress", params, function (err, results) {
        if (!err && results) {
            allAddress = results;
            var addressData = results.data;
            if (addressData.length > 0) {
                addressData = results.data.sort(function (item1, item2) {
                    if (item1.IsdefaultAddress < item2.IsdefaultAddress) {
                        return 1;
                    }
                    if (item1.IsdefaultAddress > item2.IsdefaultAddress) {
                        return -1;
                    }
                    return 0;
                })
            }
            if (addressData.length > 0) {
                for (var k in addressData) {
                    if (addressData[k]["IsdefaultAddress"] == "TRUE") {
                        addressData[k]["IsdefaultAddress"] = true;
                    } else {
                        addressData[k]["IsdefaultAddress"] = false;
                    }
                }
                var addresses = {}, addressDetail, reviewaddress;
                addresses.address = Mustache.render(address_list_template, results)
                $(".address-select").html(addresses.address);

                $(".address-action").click(function (e) {
                    e.stopPropagation();
                });

                $(".bx-shadow").click(function () {
                    $(".bx-shadow").removeClass("bx-shadow-select");
                    $(this).addClass("bx-shadow-select");
                    $("#cwta").addClass("yellow");
                });
                $("#cwta.yellow").click(function () {
                    if ($(".bx-shadow-select").attr('id')) {
                        bookingData.addressID = $(".bx-shadow-select").attr('id');
                        // $("#address_given").modal('hide');
                    }

                });
                calculateCharges();
                $(".address-select-box-label").click(function () {
                    $(".alert-message").html("");
                    $(".checkmark33").css("background", "white")
                    $(this).find(".checkmark33").css("background", "#2EB0E4")
                    bookingData.addressType = $(this).data("addresstype");
                    bookingData.addressId = $(this).attr("id");
                    addressId = $(this).attr("id");
                    if (bookingData && bookingData.addressType === MSG.VILLA) {
                        addressType = MSG.VILLA;
                    } else {
                        addressType = "APARTMENT"
                    }
                    var longitude = $(this).data("long");
                    var latitude = $(this).data("lat");

                    viewMap(longitude, latitude, "myAddressMap");
                    viewMap(longitude, latitude, "myAddressMapMobile");
                    var addressFormat = `<span>${$(this).data("addresstype")} ${$(this).data("apartmentno")}</span>, <span>${$(this).data("streetaddress")}</span>, <span>${$(this).data("community")}, ${$(this).data("city")}</span>`;
                    $(".show-address").html(addressFormat);
                    if (bookingData && bookingData.addressType) {
                        $(".selected-addressType").html(bookingData.addressType);
                    }
                    $(".property-selected,.addressShow").removeClass("hidden");
                    calculateCharges();
                });
                if (getLastBookingdata && check_boooking_data && check_boooking_data.addressId) {
                    $(".address-select .address-select-box[data-id='" + check_boooking_data.addressId + "']>label>.address-select-box-label").click();
                } else {
                    $(".address-select .address-select-box:nth-child(1)>label>.address-select-box-label").click();
                }
                $(".delete-address, .edit-address").removeClass("hidden");

                $.LoadingOverlay("hide", true);
            } else {
                $(".address-select").html("<option>You have not added any addresses at yet.</option>");
                $(".show-address").html("");
                $(".delete-address, .edit-address").addClass("hidden");
                $.LoadingOverlay("hide", true);
            }

        } else {
            $.LoadingOverlay("hide", true);
            err = JSON.parse(err);
            showMessageToUser(err.message)

        }
    });
}


function viewMap(lat, long, id) {
    setTimeout(function () {
        var map_options = {
            center: new google.maps.LatLng(lat, long),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var myLatlng = new google.maps.LatLng(lat, long);
        var map = new google.maps.Map(document.getElementById(id), map_options);
        var markers = new google.maps.Marker({
            position: myLatlng,
            draggable: false,
            map: map
        });
        markers.setMap(map);
    }, 1000);
}

function initMap(lat, long) {
    setTimeout(function () {
        var map_options = {
            center: new google.maps.LatLng(lat, long),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var myLatlng = new google.maps.LatLng(lat, long);
        var map = new google.maps.Map(document.getElementById("map"), map_options);
        var markers = new google.maps.Marker({
            position: myLatlng,
            draggable: true,
            map: map
        });
        markers.setMap(map);

        var geocoder = new google.maps.Geocoder();
        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(markers, 'dragend', function (event) {
            if (updateAddress) {
                editlat = this.getPosition().lat();
                editlong = this.getPosition().lng();
            }
            geocoder.geocode({
                'latLng': event.latLng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, markers);
                        var streetaddress = "";
                        for (var k in results[0]["address_components"]) {
                            if (results[0]["address_components"][k]["types"][0] == "locality") {
                                var city = results[0]["address_components"][k]["long_name"];
                            }
                        }
                    }
                }
            });
        });

        google.maps.event.addListener(map, 'click', function (event) {
            if (updateAddress) {
                editlat = this.getPosition().lat();
                editlong = this.getPosition().lng();
            }
            geocoder.geocode({
                'latLng': event.latLng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, markers);
                        var streetaddress = "";
                        for (var k in results[0]["address_components"]) {
                            if (results[0]["address_components"][k]["types"][0] == "locality") {
                                var city = results[0]["address_components"][k]["long_name"];
                            }
                        }
                    }
                }
            });
        });



        var marker = new google.maps.Marker({ map: map, draggable: true });
        geocoder = new google.maps.Geocoder();
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'dragend', function (event) {
            if (updateAddress) {
                editlat = this.getPosition().lat();
                editlong = this.getPosition().lng();
            }
            geocoder.geocode({
                'latLng': event.latLng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, marker);
                        for (var k in results[0]["address_components"]) {
                            if (results[0]["address_components"][k]["types"][0] == "locality") {
                                var city = results[0]["address_components"][k]["long_name"];
                            }
                        }
                    }
                }
            });
        });

        var input = document.getElementById("searchMap");
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo("bounds", map);

        google.maps.event.addListener(autocomplete, "place_changed", function () {
            var place = autocomplete.getPlace();
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);
            }

            markers.setPosition(place.geometry.location);

            if (place["formatted_address"]) {
                infowindow.setContent(place.formatted_address);
                var address;
                address = place.formatted_address;
                address = address.split("-");
            }

        });

    }, 1000);
}

function calculateCharges() {
    baseCharge = 0, promoBaseCharge = 0, baseChargeWithoutDiscount = 0;
    var discountCharges = 0, totalCharges = 0;
    var emergencyInPercent = $("#autoWidth li.selected-category").data("emergencyinpercent");
    var emergencyInAmount = $("#autoWidth li.selected-category").data("emergencyinamount");
    var emergencyCharges = $("#autoWidth li.selected-category").data("emergency");
    emergencyCharges = emergencyCharges ? parseFloat(emergencyCharges) : 0;
    var fridayCharges = $("#autoWidth li.selected-category").data("friday");
    fridayCharges = fridayCharges ? parseFloat(fridayCharges) : 0;
    var discountFactor = $("#autoWidth li.selected-category").data("discountfactor");
    discountFactor = discountFactor ? parseFloat(discountFactor) : 0;
    var peakCharges = $("#autoWidth li.selected-category").data("peakcharges");
    var offPeakCharges = $("#autoWidth li.selected-category").data("offpeakcharges");
    var isPeakHourAllowed = $("#autoWidth li.selected-category").data("ispeakhourallowed");
    var peakHourChargesInPercent = $("#autoWidth li.selected-category").data("peakhourchargesinpercent");
    var peakHourChargesInAmount = $("#autoWidth li.selected-category").data("peakhourchargesinamount");
    var inspectionCharge = $("#autoWidth li.selected-category").data("calloutcharges");
    var isEmergencyAllowed = $("#autoWidth li.selected-category").data("emergencyallowed");

    var boolean, firstUnitCharges, restUnitCharges, villaCharges, wholeQuesUnit, boolQuesCharges, descriptive, callOutCharges, boolQuesCharges;
    var bookingPeakCharges = 0;
    var promoDisocuntPercentage = 0;
    let inspectionTotalCharges;
    var totalWithoutPrmo;
    var totalChargeVat;
    var vatCharge;



    callOutCharges = parseFloat($("#autoWidth li.selected-category").data("calloutcharges")) ? parseFloat($("#autoWidth li.selected-category").data("calloutcharges")) : 0;
    descriptive = $(".select-descriptive option:selected").attr("ans-id");
    boolQuesCharges = bool_charges;
    if (whole) {
        wholeQuesUnit = parseFloat($(".ans-no-add-select button.input-num").text().trim())
    }
    firstUnitCharges = parseFloat($("#autoWidth li.selected-category").data("firstunitcharges")) ? parseFloat($("#autoWidth li.selected-category").data("firstunitcharges")) : 0;
    restUnitCharges = parseFloat($("#autoWidth li.selected-category").data("restunitcharges")) ? parseFloat($("#autoWidth li.selected-category").data("restunitcharges")) : 0;
    villaCharges = parseFloat($("#autoWidth li.selected-category").data("villacharges")) ? parseFloat($("#autoWidth li.selected-category").data("villacharges")) : 0;
    descriptive = $(".select-descriptive option:selected").attr("ans-id");
    if (booleanYesNo === 'YES') {
        boolean = booleanAns;
    }


    //calculating base charge.
    if (globalServiceType == MSG.INSPECTION) {
        if (descriptive && whole && boolean) {
            baseCharge = callOutCharges + (wholeQuesUnit - 1) * wholeAdditionalCharge + wholeQuesUnit * boolQuesCharges;
        } else if (descriptive && whole && !boolean) {
            baseCharge = callOutCharges + (wholeQuesUnit - 1) * wholeAdditionalCharge;
        } else if (descriptive && !whole && boolean) {
            baseCharge = callOutCharges + boolQuesCharges;
        }
    } else if (globalServiceType == MSG.FIXED) {
        if (whole && boolean) {
            baseCharge = firstUnitCharges + (wholeQuesUnit - 1) * restUnitCharges + wholeQuesUnit * boolQuesCharges;
            if (bookingData && bookingData.addressType == MSG.VILLA && villaCharges) {
                baseCharge += wholeQuesUnit * villaCharges;
            }
        } else if (whole && !boolean) {
            baseCharge = firstUnitCharges + (wholeQuesUnit - 1) * restUnitCharges;
            if (bookingData && bookingData.addressType == MSG.VILLA && villaCharges) {
                baseCharge += wholeQuesUnit * villaCharges;
            }
        } else if (!whole && boolean) {
            baseCharge = firstUnitCharges + boolQuesCharges;
            if (bookingData && bookingData.addressType == MSG.VILLA && villaCharges) {
                baseCharge += villaCharges;
            }
        }
    } else if (globalServiceType == MSG.SURVEY) {
        baseCharge = 0;
    }

    if (isEmergencyAllowed && serviceBasedType == (MSG.EMERGENCY).toUpperCase()) {
        if (emergencyInPercent) {
            emergencyCharges = (baseCharge * emergencyCharges) / 100;
            emergencyCharges = Number(emergencyCharges.toFixed(2));
        } else if (emergencyInAmount) {
            emergencyCharges = emergencyCharges;
        } else {
            emergencyCharges = 0;
        }
    } else {
        emergencyCharges = 0;
    }

    if (bookingData && bookingData.slotType && isPeakHourAllowed) {
        if (bookingData.slotType == MSG.PEAK && peakCharges) {
            bookingPeakCharges = peakCharges;
        } else if (bookingData.slotType == MSG.OFF_PEAK && offPeakCharges) {
            bookingPeakCharges = -offPeakCharges;
        } else {
            bookingPeakCharges = 0;
        }

        if (peakHourChargesInPercent && bookingPeakCharges) {
            bookingPeakCharges = ((baseCharge * bookingPeakCharges) / 100);
        } else if (peakHourChargesInAmount && bookingPeakCharges) {
            bookingPeakCharges = bookingPeakCharges;
        } else {
            bookingPeakCharges = 0;
        }
    }


    if (discountFactor) {
        var wholeAns = [];
        if (QUES.WHOLE && QUES.WHOLE.answers) {
            for (let idx in QUES.WHOLE.answers) {
                wholeAns.push(Number(parseFloat(QUES.WHOLE.answers[idx].answer).toFixed(2)));
            }
            wholeAns.sort(function (a, b) {
                return a - b
            });
            discountCharges = (wholeQuesUnit / wholeAns[wholeAns.length - 1]) * baseCharge * (discountFactor / 100);
            discountCharges = Number(discountCharges.toFixed(2));
        }
    }

    promoBaseCharge = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakCharges)) - parseFloat(discountCharges);
    baseChargeWithoutDiscount = baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakCharges);


    if (promoData) {
        if (promoData.discountInAmount) {
            discountCharges = parseFloat(discountCharges) + promoData.discountInAmount
            promoDisocuntPercentage = promoData.discountInAmount;
        } else if (promoData.discountInPercentage) {
            promoDisocuntPercentage = promoBaseCharge * promoData.discountInPercentage / 100;
            if (promoData.maxDiscountAmt && promoDisocuntPercentage > promoData.maxDiscountAmt) {
                promoDisocuntPercentage = promoData.maxDiscountAmt;
            } else {
                promoDisocuntPercentage = promoDisocuntPercentage;
            }
            discountCharges = parseFloat(discountCharges) + promoDisocuntPercentage;
            discountCharges = Number(discountCharges.toFixed(2));
        }
    }

    //calcultion for addOns
    const addOnsCount = {};
    if (bookingData && bookingData.addOnsFinalList) {
        for (const element of bookingData.addOnsFinalList) {
            if (addOnsCount[element]) {
                addOnsCount[element] += 1;
            } else {
                addOnsCount[element] = 1;
            }
        }
    }
    var addOnBookingValue = [];
    if (myAddOnList && addOnsCount) {
        for (var k in addOnsCount) {
            var addOn = myAddOnList.filter(x => x._id == k);
            const addOnPriceIdValue = {}
            addOnPriceIdValue.title = addOn[0].question;
            addOnPriceIdValue.questionId = addOn[0]._id;
            addOnPriceIdValue._id = addOn[0].answers[addOnsCount[k] - 1]._id;
            addOnPriceIdValue.value = addOn[0].answers[addOnsCount[k] - 1].answer;
            if (addOn[0].additionalCharges) {
                addOnPriceIdValue.price = parseFloat(addOn[0].additionalCharges) * parseFloat(addOn[0].answers[addOnsCount[k] - 1].answer);
            } else {
                addOnPriceIdValue.price = 0;
            }
            addOnBookingValue.push(addOnPriceIdValue);
        }
    }

    var totalAddOnCharges = 0;
    if (addOnBookingValue.length > 0) {
        bookingData.addOnAnswerList = addOnBookingValue;
        for (var x in bookingData.addOnAnswerList) {
            totalAddOnCharges += parseFloat(bookingData.addOnAnswerList[x].price);
        }
    }

    //calculating total charges.
    if (globalServiceType == MSG.INSPECTION) {
        inspectionTotalCharges = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakCharges)) - parseFloat(discountCharges);
        totalWithoutPrmo = inspectionTotalCharges + promoDisocuntPercentage;
        baseCharge = Number(Number(baseCharge).toFixed(2));
        inspectionTotalCharges = Number(Number(inspectionTotalCharges).toFixed(2));
        totalWithoutPrmo = Number(Number(totalWithoutPrmo).toFixed(2));
    } else if (globalServiceType == MSG.FIXED) {
        inspectionCharge = firstUnitCharges;
        totalCharges = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakCharges)) - parseFloat(discountCharges) + parseFloat(totalAddOnCharges);
        totalChargeVat = totalCharges * (1.05);
        totalWithoutPrmo = totalCharges + promoDisocuntPercentage;
        totalWithoutPrmo = totalWithoutPrmo * (1.05);
        vatCharge = Number(Number(totalCharges * 0.05).toFixed(2));
        totalCharges = Number(Number(totalCharges).toFixed(2));
        baseCharge = Number(Number(baseCharge).toFixed(2));
        totalChargeVat = Number(Number(totalChargeVat).toFixed(2));
        totalWithoutPrmo = Number(Number(totalWithoutPrmo).toFixed(2));
    }


    total_charges = totalCharges;


    //var membershipCashback =0;
    // if(localStorage.getItem("isMember") === "true"){
    //     var tier ="";
    //     var membershipTier = localStorage.getItem("membershipTier");
    //     if(membershipTier && membershipTier != "null"){
    //         if(membershipTier =="Basic"){
    //             tier = "tier1";
    //         }else if(membershipTier =="Silver"){
    //             tier = "tier2";
    //         }else if(membershipTier =="Gold"){
    //             tier = "tier3";   
    //         }
    //     }

    //     if(tier && membershipDetails && membershipDetails[tier]){
    //         if(globalServiceType && globalServiceType == MSG.FIXED){
    //             membershipCashback = membershipDetails[tier].cashbackInPercent*totalChargeVat/100;
    //             if(membershipCashback && membershipCashback>=membershipDetails[tier].maximumCashback){
    //                 membershipCashback = membershipDetails[tier].maximumCashback;
    //             }
    //         }else{
    //             membershipCashback = membershipDetails[tier].maximumCashback;
    //         }
    //     }
    //     $(".membership-discount-text").removeClass("hidden");
    //     $(".membership-discount-text").html(membershipTier+" membership cash back of upto AED "+membershipCashback.toFixed(2)+"</br>will be transferred to your wallet upon payment.")
    // }else{
    //     $(".membership-discount-text").addClass("hidden");
    // }



    if (globalServiceType == MSG.FIXED) {
        if (baseCharge) {
            $("#service-p, .service-p, .other-parent").show();
            $("#labor-p, .labor-p").hide();
            $("#otherCharge, .otherCharge").html(baseCharge);
        } else {
            $("#labor-p, .labor-p").hide();
            $("#service-p, .service-p, .other-parent").hide();
        }
        $("#excl-VAT, .excl-VAT").text("( excl.VAT )");
        $("#totalcharges, .totalcharges, .estimated-price, .bookingTotalAmount").html(totalCharges);
        $(".vat-charge").html(vatCharge);
        $(".vat-charges-box").removeClass("hidden");
        $(".totalchargesVat").html(totalChargeVat);
        $("#totalcharges, .totalcharges, .estimated-price").html(totalChargeVat);
        $(".estimated-price").html("<span class='aed'>AED</span> " + totalChargeVat + "<i class='fa fa-angle-down' aria-hidden='true'></i>");
        if (window.innerWidth < 992) {
            $(".estimated-price").html("<span class='aed'>AED</span> " + totalChargeVat);
        }
        if (totalWithoutPrmo != totalChargeVat && promoDisocuntPercentage) {
            $(".nextStep .priceTotal .priceTotalDiv").css('display', "block");
            $(".estimated-price").html("<span class='line-through color-grey'><span> AED </span>" + totalWithoutPrmo + "</span> <span class='aed'> AED </span><span>" + totalChargeVat + "</span><i class='fa fa-angle-down' aria-hidden='true'></i> ");
            if (window.innerWidth < 768) {
                $(".offer-hidden").addClass("hidden");
                $(".nextStep .priceTotal .priceTotalDiv").css("width", "140px");
                $(".estimated-price").html("<span class='line-through color-grey'><span> AED </span>" + totalWithoutPrmo + "</span><i class='fa fa-angle-down' aria-hidden='true'></i> <span class='aed'> AED </span><span>" + totalChargeVat + "</span>");
            }
        }
        if (pricingNote) {
            if (pricingNote.mainUnitNote && (pricingNote.mainUnitNote).match(/PRICE/g)) {
                inspectionCharge = (pricingNote.mainUnitNote).replace("PRICE", inspectionCharge);
            }
            if (pricingNote.additionalUnitNote && pricingNote.additionalUnitNote !== "null") {
                if ((pricingNote.additionalUnitNote).match(/PRICE/g)) {
                    var additionalCharge = (pricingNote.additionalUnitNote).replace("PRICE", restUnitCharges);
                    inspectionCharge += " " + additionalCharge;
                } else {
                    inspectionCharge += "<br/>" + pricingNote.additionalUnitNote;
                }
            }
            if (pricingNote.asteriskNote && pricingNote.asteriskNote !== "null") {
                inspectionCharge += "<br/><br/>" + pricingNote.asteriskNote;
            }
            $("#fixedbased").html(inspectionCharge);
        } else {
            $("#fixedbased").html(inspectionCharge + " AED");
        }
        $(".fixed-based-m").show();
        $(".survey-based-m, .ip-base-m").hide();
        $("#fixedbased").removeClass("hidden");
        $("#pricebasedSurvey, #pricebased, #emergencycharges, #fridaycharges").addClass("hidden");
    } else if (globalServiceType == MSG.INSPECTION || globalServiceType == MSG.SURVEY) {
        totalCharges = "To be decided";
        if (baseCharge) {
            $("#labor-p, .labor-p").show();
            $("#service-p, .service-p, .other-parent").hide();
            $("#laborCharge, .laborCharge, .estimated-price, .bookingTotalAmount").html(baseCharge);
        } else {
            $("#labor-p, .labor-p, .other-parent").hide();
            $("#service-p, .service-p").hide();
        }
        if (globalServiceType == MSG.SURVEY) {
            $("#labor-p, .labor-p").show();
            $("#laborCharge, .laborCharge").html(baseCharge);
            $("#labortext, .labortext").html(MSG.LABOR_TEXT);
            $(".estimated-price").html("<span class='aed'>AED</span> 0.00 <br> <span class='color-grey'>Free survey</span> <i class='fa fa-angle-down' aria-hidden='true'></i>");
            if (window.innerWidth < 992) {
                $(".estimated-price").html("<span class='aed'>AED</span> 0.00 <br> <span class='color-grey'>Free survey</span>");
                $(".membership-save-button").css("bottom", "20px")
            }
            $(".nextStep .priceTotal .priceTotalDiv").css('display', "block");
            if (pricingNote) {
                if (pricingNote.mainUnitNote && (pricingNote.mainUnitNote).match(/PRICE/g)) {
                    inspectionCharge = (pricingNote.mainUnitNote).replace("PRICE", 0);
                }
                if (pricingNote.additionalUnitNote && pricingNote.additionalUnitNote !== "null") {
                    inspectionCharge += ". " + pricingNote.additionalUnitNote;
                }
                if (pricingNote.asteriskNote && pricingNote.asteriskNote !== "null") {
                    inspectionCharge += "<br/><br/>" + pricingNote.asteriskNote;
                }
                $("#pricebasedSurvey").html(inspectionCharge);
            } else {
                $("#pricebasedSurvey").html(inspectionCharge + " AED");
            }
            $(".survey-based-m").show();
            $(".fixed-based-m, .ip-base-m").hide();
            $("#pricebasedSurvey").removeClass("hidden");
            $("#fixedbased, #pricebased, #emergencycharges, #fridaycharges").addClass("hidden");
        } else if (globalServiceType == MSG.INSPECTION) {
            $("#totalcharges, .totalcharges, .estimated-price").html(inspectionTotalCharges);
            $("#labortext, .labortext").html(MSG.LABOR_TEXT_INSPECTION);
            $(".estimated-price").html("<span class='aed'>AED</span> " + totalWithoutPrmo + "<i class='fa fa-angle-down' aria-hidden='true'></i>");
            if (window.innerWidth < 992) {
                $(".estimated-price").html("<span class='aed'>AED</span> " + totalWithoutPrmo);
            }
            if (totalWithoutPrmo != inspectionTotalCharges && promoDisocuntPercentage) {
                $(".nextStep .priceTotal .priceTotalDiv").css('display', "block");
                $(".estimated-price").html("<span class='line-through color-grey'><span > AED </span>" + totalWithoutPrmo + "</span> <span class='aed'> AED </span><span>" + inspectionTotalCharges + "</span> <i class='fa fa-angle-down' aria-hidden='true'></i>");
                if (window.innerWidth < 768) {
                    $(".offer-hidden").addClass("hidden");
                    $(".nextStep .priceTotal .priceTotalDiv").css("width", "140px")
                    $(".estimated-price").html("<span class='line-through color-grey'><span > AED </span>" + totalWithoutPrmo + "</span> <i class='fa fa-angle-down' aria-hidden='true'></i>  <span class='aed'> AED </span><span>" + inspectionTotalCharges + "</span>");
                }
            }
            if (pricingNote) {
                if (pricingNote.mainUnitNote && (pricingNote.mainUnitNote).match(/PRICE/g)) {
                    inspectionCharge = (pricingNote.mainUnitNote).replace("PRICE", inspectionCharge);
                }
                if (pricingNote.additionalUnitNote && pricingNote.additionalUnitNote !== "null") {
                    inspectionCharge += ". " + pricingNote.additionalUnitNote;
                }
                if (pricingNote.asteriskNote && pricingNote.asteriskNote !== "null") {
                    inspectionCharge += "<br/><br/>" + pricingNote.asteriskNote;
                }

                $("#pricebased").html(inspectionCharge);
            } else {
                $("#pricebased").html(inspectionCharge + " AED");
            }

            $(".ip-base-m").show();
            $(".survey-based-m, .fixed-based-m").hide();
            $("#pricebased").removeClass("hidden");
            $("#pricebasedSurvey, #fixedbased, #emergencycharges, #fridaycharges").addClass("hidden");
        }
        $("#excl-VAT, .excl-VAT").text("");
        $("#totalcharges, .totalcharges, .bookingTotalAmount").html(totalCharges);
    }

    if (emergencyCharges && isEmergencyAllowed) {
        emergencyCharges = Number(Number(emergencyCharges).toFixed(2));
        $("#emergencySameday, .emergencySameday").parent().removeClass("hidden");
        $(".emergencySamedaybox").removeClass("hidden");
        $("#emergencyCharge, .emergencyCharge").html(emergencyCharges);
        $(".emergencySamedaybox-friday-box").show();
        $("#other-parent, .other-parent").show();
        $("#emergencycharges .aed, .emergencycharges .aed").html(emergencyCharges);
        $("#fridaycharges, .fridaycharges").addClass("hidden");
    } else {
        $("#emergencySameday, .emergencySameday").parent().addClass("hidden");
        $(".emergencySamedaybox").addClass("hidden");
        $(".emergencySamedaybox-friday-box").hide();
        $("#other-parent, .other-parent").hide();
    }


    if (discountCharges) {
        discountCharges = Number(Number(discountCharges).toFixed(2));
        $("#promo, .promo").parent().show();
        $("#promo, .promo").html(discountCharges);
        $(".promo-p").show();
    } else {
        $("#promo, .promo").parent().hide(); promoData
        $(".promo-p").hide();
    }

    if (bookingPeakCharges != 0) {
        bookingPeakCharges = Number(Number(bookingPeakCharges).toFixed(2));
        $("#other-parent, .other-parent").show();
        $(".slotSameday").parent().removeClass("hidden");
        $(".slotCharge").html(bookingPeakCharges);
        if (bookingPeakCharges > 0) {
            $(".slotSameday").html("Peak hour Charges");
        } else {
            $(".slotSameday").html("Off peak hour Charges");
        }
    } else {
        $(".slotSameday").parent().addClass("hidden");
    }

    if (promoData) {
        if ($('.enterPromo').val() && promoData._id) {
            $(".showPromo").html("<span class='opacity_05'>Discount (self* + " + $('.enterPromo').val() + ")</span><span class='blue pointer promo-edit hidden' onclick='offersBook()'> + add/edit promo</span>");
            $(".showPromo1").html("<span class='opacity_05'>Discount (self* + " + $('.enterPromo').val() + ")</span>");
        } else {
            $(".showPromo").html("<span class='opacity_05'>Discount (self*)</span><span class='blue pointer promo-edit hidden' onclick='offersBook()'> + add/edit promo</span>");
            $(".showPromo1").html("<span class='opacity_05'>Discount (self*)</span>");
        }
    } else {
        $(".showPromo").html("<span class='opacity_05'>Discount (self*)</span><span class='blue pointer promo-edit hidden' onclick='offersBook()'> + add/edit promo</span>");
        $(".showPromo1").html("<span class='opacity_05'>Discount (self*)</span>");
    }
    if (bookingData && bookingData.slotIndex >= 0) {
        $(".promo-edit").removeClass("hidden")
    }

    if (isAddOn) {
        $(".summary-add-on-list, .selected-add-ons-list").removeClass("hidden");
        if (bookingData && bookingData.addOnAnswerList) {
            $(".summary-add-on-list").html(Mustache.render(ADD_ONS_PAYMENT_SUMMARY, { 'data': bookingData.addOnAnswerList }));
            $(".selected-add-ons-list").html(Mustache.render(ADD_ONS_BOOKING_SUMMARY, { 'data': bookingData.addOnAnswerList }));
        }
    } else {
        $(".summary-add-on-list, .selected-add-ons-list").addClass("hidden");
    }
}

function imageValidate() {
    var formData = new FormData();
    var file = document.getElementById("files").files[0];
    formData.append("Filedata", files);
    var t = files.type.split('/').pop().toLowerCase();
    if (t != "jpeg" && t != "jpg" && t != "png") {
        $(".multipleImage-alert").removeClass('hidden');
        $(".multipleImage-alert").html("Kindly upload the image");
        document.getElementById("files").value = '';
        return false;
    }
    return true;
}



function fetchDataForStepOne(edit) {
    $(".alert-message").html("");
    bookingData.subcategoryId = $("#autoWidth li.selected-category").data("id");
    bookingData.categoryId = $(".select-maincategory option:selected").data("id");
    bookingData.answerIDS = [];
    if (!$(".select-descriptive option:selected").attr("ans-id")) {
        var message = "PLease select one option?";
        if ($("select").hasClass("select-descriptive")) {
            $(".issue-alert").html(message);
            return;
        }
    } else {
        bookingData.answerIDS.push($(".select-descriptive option:selected").attr("ans-id"));
    }
    var des_Ans = $(".select-descriptive option:selected").val()
    $(".descriptive-answer").html(des_Ans.slice(2,));

    if (booleanYesNo == "") {
        $(".boolean-alert").html("Please Select yes or no!");
        return;
    }
    if (!WHOLE_COUNT) {
        $(".no-active-button").css('opacity', "0.5");
        $(".whole-alert").html("This can't be zero");
        return;
    }
    if (!edit) {
        $(".screens").addClass('hidden');
        $(".input-note-text, .isOptional").css("color", "#60604E");
        $(".isOptional").html("(OPTIONAL)");
        ga('send', 'event', 'AddToCart', 'Click', 'booking screen', "0");
        fbq('track', 'AddToCart');
        if (isAddOn) {
            getAddOnData();
            $(".add-ons, .backBtnDiv, .add-ons-confirmation").removeClass('hidden');
            $(".btn1_2").attr('onclick', 'fetchDataFromAddOns()');
            bookingData.screenName = "add-ons";
            stepOneCheck = true;
            return;
        } else if (isMandatoryAttachment) {
            getSpecificDetailsScreen();
            return;
        } else {
            getSlotScreen();
            return;
        }
    } else {
        moveToConfirm();
    }
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
var loadFile = function (event) {
    $(".img-load-textt").removeClass("hidden");
    $(".image-file-name").html($("#file-input").prop("files")[0].name);
    var image = document.getElementById('img-output');
    image.src = URL.createObjectURL(event.target.files[0]);
    var uploadFileSize = $("#file-input").prop("files")[0].size;
    bytesToSize(uploadFileSize)
    $(".img-load-textt .image-load-text .image-sizes").html(bytesToSize(uploadFileSize));
};
function takePicture() {
    if (window.File && window.FileList && window.FileReader) {
        $("#files").on("change", function (e) {
            var files = e.target.files
            updateDisplayImg(files);
        });
    }
};

function getDataUrl(dataURl, callback) {
    const reader = new FileReader();
    var url;
    reader.onload = function () {
        url = reader.result;
        callback(url);
    }
    reader.readAsDataURL(dataURl);
}

var myFile = [];
function updateDisplayImg(files) {
    $('.multipleImage-alert').addClass('hidden');
    $(".input-note-text").css("color", "#60604E");
    if (window.File && window.FileList && window.FileReader) {
        var filesLength = files.length;
        if (filesLength <= 4 && problemImgdata.length <= 4) {
            for (var i = 0; i < filesLength; i++) {
                let f = files[i]
                if (f.name) {
                    let fileName = f.name;
                    let uploadFileSize = f.size;
                    totalFileSize = totalFileSize + uploadFileSize;
                    let totalBsize = bytesToSize(totalFileSize)
                    if (totalFileSize > 5242880) {
                        $('.multipleImage-alert').removeClass('hidden');
                        $('.multipleImage-alert').html('Files size is exceed, Maximum 5MB')
                        $('#files').val('');
                        return;
                    }
                    let bsize = bytesToSize(uploadFileSize)
                    var imageData = URL.createObjectURL(files[i]);
                    var blob = new Blob([files[i]], { type: f.type });
                    var dataURl;
                    getDataUrl(blob, function (result) {
                        dataURl = result;
                        var newFile = {
                            "result": imageData,
                            "name": fileName,
                            "index": problemImgdata.length,
                            "size": bsize,
                            "asize": uploadFileSize,
                            "type": f.type,
                            "dataURl": dataURl,
                        }
                        if (problemImgdata.length <= 4) {
                            myFile.push(newFile);
                            problemImgdata.push(f);
                            $(".summaryMultiImageUploaded").html(Mustache.render(UPLOADED_IMG_TEMPLATE, { "data": myFile }));
                            $(".totalKB").html(totalBsize);
                        } else {
                            $('.multipleImage-alert').removeClass('hidden');
                            $('.multipleImage-alert').html('Maximum 5 files only you can upload')
                            return
                        }
                        bookingData.imageData = myFile;
                    });
                }
            }
        } else {
            //alert('Maximum five files only you can upload')
            $('.multipleImage-alert').removeClass('hidden');
            $('.multipleImage-alert').html('Maximum 5 files only you can upload')
            return
        }
    }
}

function removeImage(data) {
    var currentFile = myFile.filter((x) => x.index == data);
    totalFileSize = totalFileSize - currentFile[0].asize
    let totalBsize = bytesToSize(totalFileSize);
    if (myFile.length == 1) {
        problemImgdata.pop();
        myFile.pop();
    }
    else if (data > -1) {
        problemImgdata.splice(data, 1);
        myFile.splice(data, 1);
    }
    if (totalBsize) {
        $(".totalKB").html(totalBsize);
    } else {
        $(".totalKB").html(0);
    }
    $(".summaryMultiImageUploaded").html(Mustache.render(UPLOADED_IMG_TEMPLATE, { "data": myFile }));
};



var loadFile = function (event) {
    $(".img-load-text").html($("#file-input").prop("files")[0].name);
};

$(".leave-instruction").change(function () {
    if ($(".leave-instruction").val()) {
        bookingData.problemDetails = $(".leave-instruction").val();
        if (bookingData && bookingData.problemDetails) {
            $(".instructions-text").html(bookingData.problemDetails)
        }
    }
});

function fetchDataFromAddSpecificDetails(edit) {
    $(".input-note-text").css("color", "#60604E");
    $(".alert-message").html("");
    if ($(".leave-instruction").val()) {
        bookingData.problemDetails = $(".leave-instruction").val();
        if (bookingData && bookingData.problemDetails) {
            $(".instructions-text").html(bookingData.problemDetails)
        }
    }
    if (isMandatoryAttachment) {
        if (problemImgdata.length == 0) {
            $(".input-note-text").css("color", "#ED8686");
            return;
        }
        if (!($(".leave-instruction").val())) {
            // $(".alert-message").html(isMandatoryAttachmentText)
            $(".alert-message").html("*Instructions are mandatory");
            return;
        }
    }
    $(".add-specific-details-edit").show();

    isMandatoryCheck = true;
    if (!edit) {
        getSlotScreen();
        return;
    } else {
        moveToConfirm();
    }
}

function displayAddressModal() {
    $("#add-specific-details").modal('hide');
    //alert('pixel schedule');
    fbq('track', 'Schedule');
    ga('send', 'event', 'Schedule', 'Click', 'booking screen', "0");
    var check_h_user = localStorage.getItem("h_user")
    if (check_h_user && check_h_user !== 'null') {
        $(".btn1_2").attr('onclick', 'fetchSelectedAddress()');
        $(".addPromo").removeClass("hidden");
        $(".datetime-edit").show();
        $('.progressbar-dots').removeClass('active');
        $('.progressbar-dots:nth-child(1)').addClass('tick');
        $('.progressbar-dots:nth-child(2)').addClass('tick');
        $('.progressbar-dots:nth-child(3)').addClass('active');
        $(".screens").addClass('hidden');
        $(".screen5").removeClass('hidden');
        if (getLastBookingdata && check_boooking_data && check_boooking_data.addressId) {
            $(".address-select .address-select-box[data-id='" + check_boooking_data.addressId + "']>label>.address-select-box-label").click();
        } else {
            $(".address-select .address-select-box:nth-child(1)>label>.address-select-box-label").click();
        }
        fbq('track', 'CompleteRegistration');
        ga('send', 'event', 'CompleteRegistration', 'Click', 'booking screen', "0");
    } else {
        // alert('pixel schedule');
        // fbq('track', 'Schedule');
        $("#loginModal .modal-title").html("Select the address you want the service at.");
        $("#loginModal .modal-para").html("Login to choose or add the address you want the service");
        loginModal();
        isSlotSelected = true;
        $("#loginModal").modal('show');
        // alert('pixel CompleteRegistration');
        // fbq('track', 'CompleteRegistration');

    }
}

function fetchTimeAndSlot(edit) {

    $(".alert-message").html("");
    if (!$(".select-time li.selected-slots").attr("value")) {
        //showMessageToUser("Kindly select the slot");
        $(".slot-alert").html("Kindly select the slot");
        return;
    }
    if (!edit) {
        displayAddressModal();
        return;
    } else {
        moveToConfirm();
    }
}

function fetchSelectedAddress() {
    $(".alert-message").html("");
    if (bookingData && !bookingData.addressId) {
        //showMessageToUser("It seems you have not added any addresses. Please add a new address");
        $(".myAdd-alert").html("It seems you have not added any addresses. Please add a new address");
        return;
    }
    getReviewScreendata();
}

/* problem image updated file*/
$(".seleced-fle-box").addClass("hidden")
$('#file-input, #file-inputs, #file-input1, #file-inputs1').change(function (event) {
    var id = $(this).parent().attr("id");
    $(".seleced-fle-box").removeClass("hidden")
    $(".selected-file").attr('src', URL.createObjectURL(event.target.files[0]));
});

$(".datetime-edit").click(function () {
    $("#time-slot-modal .modal-button").attr("onclick", "fetchTimeAndSlot(true);");
    // $("#time-slot-modal").modal('show');
});

function showMessageToUser(message) {
    $.LoadingOverlay("hide", true);
    $("#message").html(message);
    $("#message-modal").modal('show');
}


function showFridayMessage(emergency) {

    if (workingday == MSG.FRIDAY) {
        var fallowed = $(".servicetype-select option:selected").data("fridayallowed");
        var friday = $(".servicetype-select option:selected").data("friday");
        var fInAmount = $(".servicetype-select option:selected").data("fridayinamount");
        var fInPercent = $(".servicetype-select option:selected").data("fridaychargesinpercent");
        if (fallowed) {
            //showMessageToUser(MSG.EMERGENCY_CHARGE);
            $(".priorityMsg-alert").html(MSG.EMERGENCY_CHARGE);
            $("body").addClass("body-flow");
        }
    }
    if (emergency) {
        showMessageToUser("An additional Emergency charges are applicable to the booking.");
        $("body").addClass("body-flow");
    }
}

$(".submit-address").click(function () {

    $.LoadingOverlay("show");
    var data = new FormData();
    var name, apartmentNo, streetAddress, community, city, emirate, lat, long;
    name = $("#nickName").val();
    apartmentNo = $("#apartmentNo").val();
    streetAddress = $("#streetAddress").val();
    community = $("#community").val();
    if ($("#select-city").val()) {
        city = $("#select-city").val();
        var selectedCity = citys.filter(x => x.name == city);
        if (!selectedCity[0]) {
            showMessageToUser("Please select your city.");
            return;
        }
    } else {
        showMessageToUser("Please select your city.");
        return;
    }

    emirate = "UAE";

    if (city) {
        if (!streetAddress) {
            showMessageToUser("Please enter your street address.");
            return;
        }

        var geocoder = new google.maps.Geocoder();
        var place = city + ", " + emirate;
        geocoder.geocode({ 'address': place }, function (results, status) {
            if (results[0]) {
                lat = results[0].geometry.location.lat();
                long = results[0].geometry.location.lng();
                if (!name) {
                    showMessageToUser("Please enter a nickname.");
                    return;
                }
                if (!apartmentNo) {
                    showMessageToUser("Please enter your Apartment No.");
                    return;
                }
                if (!community) {
                    showMessageToUser("Please enter your community.");
                    return;
                }
                if (!lat) {
                    showMessageToUser("Sorry, Not able to find your latitude. Please enter the correct city.");
                    return;
                }
                if (!long) {
                    showMessageToUser("Sorry, Not able to find your longitude. Please enter the correct city");
                    return;
                }
                data.append("nickName", name);
                data.append("apartmentNo", apartmentNo);
                data.append("streetAddress", streetAddress);
                data.append("communtity", community);
                data.append("city", $("#select-city option:selected").val());
                data.append("emirate", emirate);
                data.append("addressType", addressType);
                data.append("IsdefaultAddress", defaultAdrees);
                if (updateAddress) {
                    data.append("locationLat", editlat);
                    data.append("locationLong", editlong);
                    data._method = "PUT";
                    data.Auth = udata.data.accessToken;
                    data.append("addressesID", addressId);
                    callApi.queryUrl(apiUrl + "/api/customer/editAddress", data, function (err, result) {
                        if (!err) {
                            getAndUpdateCustomerAddress();
                            $("#map_select").modal('hide');
                            $("#cwta").removeClass("yellow");
                            showMessageToUser("Your address has been updated.");
                        } else {
                            $.LoadingOverlay("hide", true);
                            err = JSON.parse(err);
                            showMessageToUser(err.message)

                        }
                    });
                } else {
                    data.append("locationLat", lat);
                    data.append("locationLong", long);
                    data._method = "POST";
                    data.Auth = udata.data.accessToken;
                    $.LoadingOverlay("show");
                    callApi.queryUrl(apiUrl + "/api/customer/addNewAddress", data, function (err, result) {
                        if (!err) {
                            getAndUpdateCustomerAddress();
                            $("#map_select").modal('hide');
                            $("#cwta").removeClass("yellow");
                            showMessageToUser("Your address has been added.");

                        } else {
                            err = JSON.parse(err)
                            showMessageToUser(err.message);

                        }
                    });
                }
            } else {
                if (!city) {
                    showMessageToUser("Please enter correct city");
                    return;
                }
                showMessageToUser("Select within Dubai Only");
                return;
            }
        });
    } else {
        showMessageToUser("Please enter your city");
        return;
    }
});

function editAddress(address_id) {
    // $("#address_given").modal('hide');
    $("#map_select").modal('show');
    $("#map").html("");
    updateAddress = true;
    addressId = address_id;
    var count = 0, addressType1, defaultAddress, city;
    for (var k in allAddress.data) {
        count++;
        if (allAddress.data[k]["_id"] === addressId) {
            var latlong = allAddress.data[k]["locationLongLat"];
            editlat = latlong[0];
            editlong = latlong[1];
            // initMap(latlong[0], latlong[1]);
            google.maps.event.addDomListener(window, 'load', initMap(editlat, editlong));
            count--;
            break;
        }
    }
    addressType1 = allAddress.data[count].addressType;
    addressType = addressType1;
    defaultAddress = allAddress.data[count].IsdefaultAddress;
    $("#nickName").val(allAddress.data[count].nickName);
    $("#apartmentNo").val(allAddress.data[count].apartmentNo);
    $("#streetAddress").val(allAddress.data[count].streetAddress);
    $("#community").val(allAddress.data[count].community);
    city = allAddress.data[count].city;
    $("#city, #select-city").val(allAddress.data[count].city);
    //$("#emirate").val(allAddress.data[count].emirate);
    if (addressType1 == "APARTMENT") {
        $("#address-type").html('<label class="addressLabel defaultAddress">\
        <p class="radio-option">Villa</p>\
        <input type="radio"  name="addressType" value="VILLA" onclick = "myAdressType(this.value)">\
        <span class="checkmark"></span>\
        </label>\
        <label class="addressLabel defaultAddress">\
            <p class="radio-option">Apartment</p>\
            <input type="radio" checked="checked" name="addressType" value="APARTMENT" onclick = "myAdressType(this.value)">\
            <span class="checkmark"></span>\
        </label>');
    } else {
        $("#address-type").html('<label class="addressLabel defaultAddress">\
       <p class="radio-option">Villa</p>\
       <input type="radio"  checked="checked" name="addressType" value="VILLA" onclick = "myAdressType(this.value)">\
       <span class="checkmark"></span>\
       </label>\
       <label class="addressLabel defaultAddress">\
           <p class="radio-option">Apartment</p>\
           <input type="radio"  name="addressType" value="APARTMENT" onclick = "myAdressType(this.value)">\
           <span class="checkmark"></span>\
       </label>');
    }
    if (defaultAddress == false) {
        defaultAdrees = "FALSE"
        $("#default-address").html('<p class="default-address-text">Save as default Address?</p>\
        <button class="default-address-button" value="TRUE" onclick = "myDefalutAddress(this)">Yes</button>\
        <button class="default-address-button mp-0" value="FALSE" onclick = "myDefalutAddress(this)" style="background: rgb(46, 176, 228); color: white;">No</button>');
    } else {
        defaultAdrees = "TRUE"
        $("#default-address").html('<p class="default-address-text">Save as default Address?</p>\
       <button class="default-address-button" value="TRUE" onclick = "myDefalutAddress(this)" style="background: rgb(46, 176, 228); color: white;">Yes</button>\
       <button class="default-address-button mp-0" value="FALSE" onclick = "myDefalutAddress(this)">No</button>');
    }
    var cityHTML = '<option  value="Select city" disabled>Select city</option>{{#cities}}<option  value="{{name}}">{{name}}</option>{{/cities}}'
    let cityData = Mustache.render(cityHTML, cities);
    $("#select-city").html(cityData);
    $("#select-city").val(allAddress.data[count].city);
    if (allAddress.data[count].membershipId && allAddress.data[count].membershipId.isMembership) {
        $("#apartmentNo, #streetAddress, #community, #city, #addressType").attr("disabled", "disabled");
        $("#apartmentNo, #streetAddress, #community, #city, #addressType").css("background", "#f5f5f5");
        $(".addressNote").html("Note: You can edit 'nickName' and 'default address' only on active membership address.");
        $(".addressNote").removeClass("hidden");
    } else {
        $("#apartmentNo, #streetAddress, #community, #city, #addressType").removeAttr("disabled");
        $("#apartmentNo, #streetAddress, #community, #city, #addressType").css("background", "#fff");
        $(".addressNote").addClass("hidden");
    }
}

$(".addAddress").click(function () {
    updateAddress = false;
    $("#searchMap").val("");
    $("#map").html("");
    $("#nickName").val("");
    $("#apartmentNo").val("");
    $("#streetAddress").val("");
    $("#community").val("");
    $("#city").val("");
    $("#select-city").prop("selectedIndex", 0);
    $("#addressType").html("<option value='APARTMENT' selected>APARTMENT</option><option value='VILLA'>VILLA</option>");
    $("#defaultAddress").html('<option value="TRUE" selected>YES</option><option value="FALSE">NO</option>');
    $("#curr-location").modal('hide');
    navigator.geolocation.getCurrentPosition(
        function (position) {
            editlat = position.coords.latitude;
            editlong = position.coords.longitude;
            google.maps.event.addDomListener(window, 'load', initMap(editlat, editlong));
        },
        function (error) {
            showMessageToUser("Please allow Location access");
            return;
        },
        {
            timeout: 5000
        }
    );
    $("#map_select").modal('show');
});

function deleteAddress(addressId, confirmText) {
    if (confirmText == 'yes') {
        $("#delete-address").modal("hide");
        $.LoadingOverlay("show");
        var params = {};
        params.data = {};
        params._method = "DELETE";
        params.Auth = udata.data.accessToken;
        callApi.queryUrl(apiUrl + "/api/customer/removeAddress?addressId=" + addressId, params, function (err, results) {
            if (!err) {
                if (bookingData && addressId == bookingData.addressId) {
                    bookingData.addressId = "";
                }
                getAndUpdateCustomerAddress();
                showMessageToUser("Your address has been deleted");
            } else {
                $.LoadingOverlay("hide", true);

                err = JSON.parse(err);
                showMessageToUser(err.message)

            }
        });
    }
    else {
        $(".delete-address-button").attr("onclick", "deleteAddress('" + addressId + "','yes')");
        $("#delete-address").modal("show");
        return;
    }
}

function increment(bool) {
    // booleanYesNo = bool.toUpperCase();
    $(".alert-message").html("");
    if (WHOLE_COUNT <= QUES.WHOLE.answers.length) {
        WHOLE_COUNT++;
        $(".input-num, .whole-ans-num").html(QUES.WHOLE.answers[WHOLE_COUNT - 1].answer);
        $(".input-num").attr("data-ans-id", QUES.WHOLE.answers[WHOLE_COUNT - 1]._id);
        $(".input-num").attr("data-additionalcharges", QUES.WHOLE.additionalCharges);
    }
    bookingData.wholeCount = WHOLE_COUNT;
    $(".whole-value").removeClass("hidden");
    whole = QUES.WHOLE.answers[WHOLE_COUNT - 1]._id;
    wholeAdditionalCharge = QUES.WHOLE.additionalCharges;
    if (myAdditionalCharge || wholeAdditionalCharge) {
        $(".aed-price-note").html(myAdditionalCharge + wholeAdditionalCharge);
        $(".p-not-add").show();
    }
    calculateCharges();
    $(".no-active-button").css("opacity", "1");
}

function decrement(bool) {
    // booleanYesNo = bool.toUpperCase();
    if (WHOLE_COUNT > 1) {
        WHOLE_COUNT--;
        $(".input-num, .whole-ans-num").html(QUES.WHOLE.answers[WHOLE_COUNT - 1].answer);
        $(".input-num").attr("data-ans-id", QUES.WHOLE.answers[WHOLE_COUNT - 1]._id);
        $(".input-num").attr("data-additionalcharges", QUES.WHOLE.additionalCharges);
        bookingData.wholeAnsID = $(".input-num").data("data-ans-id");
    } else {
        if (bool) {
            $(".ans-no-add").show();
        } else {
            $(".ans-yes-add").show();
        }
        $(".ans-yes-add, .ans-no-add").show();
        $(".ans-yes-add, .ans-no-add").removeAttr("disabled");
        $("button.input-num").html('');
        $("button.input-num").removeAttr("data-ans-id");
        $("button.input-num").removeAttr("data-additionalcharges");
        $(".whole-ans-num,.whole-ans-num").html(" ");
        WHOLE_COUNT = 0;
        $(".whole-value").addClass("hidden");
    }
    if (!WHOLE_COUNT) {
        $(".no-active-button").css('opacity', "0.5");
        //showMessageToUser(MSG.WHOLE_MSG +" " + QUES.WHOLE.answers[0].answer);
        $(".whole-alert").html(MSG.WHOLE_MSG + " " + QUES.WHOLE.answers[0].answer);
    }
    calculateCharges();
}

$(".ans-no-add, .ans-yes-add").click(function () {
    $(this).hide();
    let numericClass = $(this).attr('class');
    $("." + numericClass + "-select").show();
    if (numericClass.match(/yes/gi)) {
        $(".ans-no-add").attr("disabled", "disabled");
        increment('yes');
    } else {
        $(".ans-yes-add").attr("disabled", "disabled");
        increment('no');
    }
    calculateCharges();
});

function updateServiceType() {
    var emergency = false;
    var categoryName = (Object.keys(globalCategory))[0];
    var subcategories = globalCategory[categoryName].subcategories;
    for (var k in subcategories) {
        if (subcategories[k].subCategoryName == globalSubCategoryName) {
            if (subcategories[k].fridayBookingsAllowed && workingday == MSG.FRIDAY) {
                // showMessageToUser(MSG.FRIDAY_CHARGE);
            }
            if (subcategories[k].emergencyBookingAllowed && serviceBasedType == (MSG.EMERGENCY).toUpperCase()) {
                showMessageToUser(MSG.EMERGENCY_CHARGE);
            }
            if (subcategories[k].fridayBookingsAllowed && workingday == MSG.FRIDAY && subcategories[k].emergencyBookingAllowed) {
                showMessageToUser("An additional Emergency charges are applicable to the booking.")
                emergency = true;
            }
        }
    }
    $(".boolean-numeric-div").removeAttr("data-ans-id");
    $(".boolean-numeric-div").removeAttr("data-additionalcharges");
    $(".boolean-numeric-div button.input-num").html("");
    $(".ans-yes-add, .ans-no-add").show();
    WHOLE_COUNT = 0;
    showFridayMessage(emergency);
    getBookingInfo(globalCategory, globalSubCategoryName);
    var userInfo = JSON.parse(localStorage.getItem("h_user"));
    calculateCharges();
}

function getTwoDigit(digit) {
    digit = digit.toString();
    var digit = digit;
    if (parseInt(digit) < 10 && digit.length < 2) {
        digit = 0 + digit;
    }
    return digit;
}

$("#datepicker").click(function () {
    $('.ui-datepicker').show();
    $("#datepicker").datepicker({
        minDate: minSelectDate,
        maxDate: 30,
        beforeShowDay: checkFriday,
        defaultDate: new Date(scheduleddate),
        onSelect: function () {
            scheduleddate = ($("#datepicker").datepicker("getDate"));
            scheduleddate = scheduleddate.getDate();
            $(".swiper-wrapper-datetime li[data-date ='" + scheduleddate + "']").click();
            $('.ui-datepicker').hide();
        }
    });
});

$("#booking-summ-sec").click(function () {
    if ($(window).innerWidth() < 768) {
        $(".book-summary-view").toggle();
        if ($(".book-summary-view").css("display") === "none") {
            $("#booking-summ-sec .up-arrow-white-fill").css("transform", "rotate(90deg)");
        } else {
            $("#booking-summ-sec .up-arrow-white-fill").css("transform", "rotate(-90deg)");
        }
    }
});
$("#booking-details").click(function () {
    if ($(window).innerWidth() < 768) {
        $("#booking-details-view").toggle();
        if ($("#booking-details-view").css("display") === "none") {
            $("#booking-details .up-arrow-white-fill").css("transform", "rotate(90deg)");
        } else {
            $("#booking-details .up-arrow-white-fill").css("transform", "rotate(-90deg)");
        }
    }
});
$(window).resize(function () {
    if ($(window).innerWidth() > 767) {
        $(".book-summary-view").show();
        $("#booking-details-view").show();
    }
});

function checkRequiredFieldsForPromo() {
    //to check whether category is selected or not
    if (!$(".select-maincategory option:selected").attr("data-id")) {
        showMessageToUser("Please select category");
        return false;
    }
    //to check whether sub category is selected or not
    if (!$('#autoWidth li.selected-category').attr('data-id')) {
        showMessageToUser("Please select choose need or issue");
        return false;
    }
    // to check whether descriptive type answer is selected is selected or not
    if (!$(".select-descriptive option:selected").attr("ans-id")) {
        var message = "Please select " + ($(".select-descriptive option:selected").text()).toLowerCase();
        if ($("select").hasClass("select-descriptive")) {
            showMessageToUser(message);
            return false;
        }
    }

}

$(".apply-promo").click(function () {
    var userInfo = JSON.parse(localStorage.getItem("h_user"));
    var allFieldsSelected = checkRequiredFieldsForPromo();
    if (allFieldsSelected !== false) {
        var data = new FormData();
        if (userInfo && userInfo !== "null") {
            data.append("customerID", udata.data.userDetails["_id"]);
            data.Auth = udata.data.accessToken;
        }

        data.append("categoryID", $(".select-maincategory option:selected").data("id"));
        data.append("subCategoryID", $('#autoWidth li.selected-category').attr('data-id'));
        data.append("scheduleDate", scheduleddate);
        data._method = "POST";

        var myPromo = $(".enterPromo").val();
        if (myPromo) {
        }
        else {
            myPromo = $(".mobilePromo").val();
        }

        if (myPromo) {
            data.append("promoCode", myPromo);
        } else {
            showMessageToUser("Please enter promo code to apply.");
            return;
        }
        $.LoadingOverlay("show");
        callApi.queryUrl(apiUrl + "/api/customer/applyPromoCode", data, function (err, results) {
            if (!err && results) {
                $(".enterPromo").attr("disabled", "disabled");
                $.LoadingOverlay("hide", true);
                results = JSON.parse(results);
                if (results.data) {
                    if (results.data.minBillAmt) {
                        if (promoBaseCharge >= results.data.minBillAmt) {
                            promo = results.data["_id"];
                            promoData = results.data;
                            calculateCharges();
                            let message;
                            if (promoData.maxDiscountAmt) {
                                if (promoData.discountInPercentage) {
                                    message = 'Promo of ' + promoData.discountInPercentage + '% (Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                                } else {
                                    message = 'Promo of ' + promoData.discountInAmount + 'AED(Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                                }
                            } else {
                                if (promoData.discountInPercentage) {
                                    message = 'Promo of ' + promoData.discountInPercentage + '% is applied successfully.';
                                } else {
                                    message = 'Promo of ' + promoData.discountInAmount + 'AED is applied successfully.';
                                }
                            }
                            showMessageToUser(message);
                            showDeletePromoButton();
                            $(".offerPromoCode").show();
                            $(".offerPromoCode").removeClass("hidden");
                            $(".remove").addClass("hidden");
                            $(".apply").removeClass("hidden");
                            $(".myOffer-code").css("background-color", "#2EB0E4")
                            $(".myOffer-tnc").css("color", "#2EB0E4");
                            $("." + myPromo + "-apply").addClass("hidden");
                            $("." + myPromo + "-remove").removeClass("hidden");
                            $("." + myPromo + "-1-1").css("background-color", "rgba(0,0,0,0.4)")
                            $("." + myPromo + "-1-2").css("color", "rgba(0,0,0,0.4)");
                        } else {
                            var message = "This promo will be valid only on the minimum bill amount of " + results.data.minBillAmt + "AED."
                            showMessageToUser(message);
                        }
                    } else {
                        promo = results.data["_id"];
                        promoData = results.data;
                        calculateCharges();
                        let message;
                        if (promoData.maxDiscountAmt) {
                            if (promoData.discountInPercentage) {
                                message = 'Promo of ' + promoData.discountInPercentage + '% (Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                            } else {
                                message = 'Promo of ' + promoData.discountInAmount + 'AED(Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                            }
                        } else {
                            if (promoData.discountInPercentage) {
                                message = 'Promo of ' + promoData.discountInPercentage + '% is applied successfully.';
                            } else {
                                message = 'Promo of ' + promoData.discountInAmount + 'AED is applied successfully.';
                            }
                        }
                        showMessageToUser(message);
                        showDeletePromoButton();
                    }
                    $("#promocode").html(myPromo);
                }
            } else {
                $.LoadingOverlay("hide", true);

                err = JSON.parse(err);
                showMessageToUser(err.message);
                $(".enterPromo").removeAttr("disabled")
            }
        });
    } else {

    }
});

// show delete promo button
function showDeletePromoButton() {
    $('.del-promo').removeClass('hidden');
    $('.apply-promo').addClass('hidden');
}

// delete the promo if applied
function deletePromo() {
    if (!($(".address-select option:selected").data("membership"))) {
        $('.enterPromo').val('');
        promo = '';
        promoData = '';
        $('.del-promo, .offerPromoCode').addClass('hidden');
        $('.apply-promo').removeClass('hidden');
    }
    if (window.innerWidth < 768) {
        $(".nextStep .priceTotal .priceTotalDiv").css("width", "85px");
    }

    $(".offer-hidden").removeClass("hidden");
    $(".myOffer-code").css("background", "#2EB0E4")
    $(".myOffer-tnc").css("color", "#2EB0E4");
    $(".remove").addClass("hidden");
    $(".apply").removeClass("hidden");
    $(".enterPromo").removeAttr("disabled")
    calculateCharges();
}


function selectTimeInit() {
    swiperSlot = new Swiper('#slot-swiper', {
        speed: 2000,
        observeParents: true,
        observer: true,
        // // effect: "fade",
        loop: false,
        navigation: {
            nextEl: '#slot-swiper-next',
            prevEl: '#slot-swiper-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 2,
            }
        }
    });
    $(".select-time li").on("click", function () {
        if ($(this).hasClass("opacity_05") == false) {
            var slideNo = parseInt($(this).attr("value"));
            if (slideNo > 1) {
                swiperSlot.slideTo(slideNo - 1);
            } else {
                swiperSlot.slideTo(slideNo);
            }
            bookingData.slotIndex = slideNo + 1;
            $(".alert-message, .slot-alert").html("");
            $(".select-time li").removeClass("selected-slots");
            $(".select-time li .slot-list img").hide();
            $(this).addClass("selected-slots");
            var dateTime = "";
            dateTime += $(".select-time li.selected-slots").text();
            $(".select-time li.selected-slots .slot-list img").show();
            $(".date-time-slot").html($(".select-slot li.selected-slots .slot-img").text());
            $(".expiry-date-time").html(getExpiryDate() + " | 8AM - 10AM");
        } else {
            if ($(this).next()) {
                if ($(".select-slot li.selected-slots .slot-img").text() == "") {
                    $(this).next().click();
                }
            } else {
                $(".swiper-wrapper-datetime li:nth-child(1)").click();
            }
        }
    });
    setTimeout(function () {
        if (getLastBookingdata) {
            if (check_boooking_data.slotIndex) {
                var lastSlot = check_boooking_data.slotIndex;
                $(".select-time li:nth-child(" + lastSlot + ")").click();
            }
        } else {
            $(".select-time li:nth-child(1)").click();
        }
    }, 300)
}

function checkRequiredFieldsForAppointment() {
    $("#myModal3, #offers-mobile").modal("hide");

    $.LoadingOverlay("show");

    let bookingNewData = {
        answerIDS: [],
        genieSelected: 'FALSE'
    };
    answerIDS = [];
    if (!$('.select-maincategory option:selected').attr('data-id')) {
        showMessageToUser("Please select category");
        return;
    }
    if (!$('#autoWidth li.selected-category').attr('data-id')) {
        showMessageToUser("Please select choose need or issue");
        return;
    }
    if (!$(".select-descriptive option:selected").attr("ans-id")) {
        var message = "Please select " + ($(".select-descriptive option:selected").text()).toLowerCase();
        if ($("select").hasClass("select-descriptive")) {
            showMessageToUser(message);
            return
        }
    }

    // if (booleanYesNo === "NO" && (!$(".input-num").data("ans-id"))) {
    //     showMessageToUser(MSG.SELECT_ALL_INFO);
    //     return;
    // } else if (booleanYesNo === "YES" && (!$(".input-num").data("ans-id"))) {
    //     showMessageToUser(MSG.SELECT_ALL_INFO);
    //     return;
    // }
    if (booleanYesNo == "") {
        showMessageToUser(MSG.SELECT_ALL_INFO);
        return;
    }
    if (!WHOLE_COUNT) {
        $(".no-active-button").css('opacity', "0.5");
        showMessageToUser("Number of unit to inspect can't be Zero.");
        return;
    }

    if (!$(".select-whole option:selected").attr("ans-id")) {
        var message = "Please select " + ($(".wholeQue").text()).toLowerCase();
        if ($("select").hasClass("select-whole")) {
            showMessageToUser(message);
            return;
        }
    } else {
        answerIDS.push($(".select-whole option:selected").attr("ans-id"));
    }

    if (booleanAns) {
        answerIDS.push(booleanAns);
    }

    if (!scheduleddate) {
        showMessageToUser("Please select a date");
        return;
    }
    var userInfo = JSON.parse(localStorage.getItem("h_user"))
    if (userInfo && userInfo !== "null") {

        if (!$('.select-maincategory option:selected').attr('data-id')) {
            showMessageToUser("Please select category");
            return;
        } else {
            bookingNewData.categoryID = $('.select-maincategory option:selected').attr('data-id');
        }
        if (!$('#autoWidth li.selected-category').attr('data-id')) {
            showMessageToUser("Please select choose need or issue");
            return;
        } else {
            bookingNewData.subCategoryId = bookingData.subcategoryId;
        }
        if (!$(".select-descriptive option:selected").attr("ans-id")) {
            var message = "Please select " + ($(".select-descriptive option:selected").text()).toLowerCase();
            if ($("select").hasClass("select-descriptive")) {
                showMessageToUser(message);
                return;
            }
        } else {
            bookingNewData.answerIDS.push($(".select-descriptive option:selected").attr("ans-id"));
        }
        if (booleanYesNo === "NO") {
            bookingNewData.answerIDS.push($(".input-num").attr("data-ans-id"));
            bookingNewData.answerIDS.push($(".no-button").data("id"));
        } else if (booleanYesNo === "YES") {
            bookingNewData.answerIDS.push($(".input-num").attr("data-ans-id"));
            bookingNewData.answerIDS.push($(".yes-button").data("id"));
        } else {
            showMessageToUser("Please select numeric boolean question");
            return;
        }
        if (bookingData && bookingData.addOnAnswerList && bookingData.addOnAnswerList.length > 0) {
            for (var x in bookingData.addOnAnswerList) {
                bookingNewData.answerIDS.push(bookingData.addOnAnswerList[x]._id);
            }
        }
        if (!$(".select-whole option:selected").attr("ans-id")) {
            var message = "Please select " + ($(".wholeQue").text()).toLowerCase();
            if ($("select").hasClass("select-whole")) {
                showMessageToUser(message);
                return;
            }
        } else {
            answerIDS.push($(".select-whole option:selected").attr("ans-id"));
        }

        if (booleanAns) {
            answerIDS.push(booleanAns);
        }
        if (!scheduleddate) {
            showMessageToUser("Please select a date");
            return;
        }
        if (!$(".select-slot li.selected-slots").attr("value")) {
            showMessageToUser("Please select a date");
            return;
        } else {
            bookingNewData.slots = $(".select-slot li.selected-slots").attr("value");
            bookingNewData.slotType = bookingData.slotType;
            bookingNewData.startTime = bookingData.startTime;
            bookingNewData.endTime = bookingData.endTime;
        }

        if (bookingData && !bookingData.addressId) {
            showMessageToUser("It seems you have not added any addresses. Please add a new address");
            return;
        } else {
            bookingNewData.addressId = bookingData.addressId;
        }
        if (scheduleddate) {
            var twodigit;
            scheduleddate = scheduleddate.split("T");
            twodigit = scheduleddate[0].split("-");
            twodigit[2] = getTwoDigit(twodigit[2]);
            scheduleddate[0] = twodigit[0] + "-" + twodigit[1] + "-" + twodigit[2];
            scheduleddate[1] = bookingData.startTime * 60;
            var date = new Date(null);
            date.setSeconds(scheduleddate[1]); // specify value for SECONDS here
            scheduleddate[1] = date.toISOString().substr(11, 13);
            if (scheduleddate[1] == "00:00:00.000Z") {
                var scheduledate = scheduleddate[0].split("-")[2];
                var newdate = new Date().getDate();
                var nextdaydate = new Date().getTime();
                nextdaydate = 3600000 + nextdaydate;
                nextdaydate = new Date(nextdaydate).getDate();
                if (newdate != nextdaydate) {
                    scheduleddate[0] = twodigit[0] + "-" + twodigit[1] + "-" + getTwoDigit(nextdaydate);
                }
            }
            scheduleddate = scheduleddate[0] + "T" + scheduleddate[1];
            workingday = day[new Date(scheduleddate).getDay()];
            bookingNewData.scheduleDate = scheduleddate;
            bookingNewData.workingday = workingday;
        }

        bookAppointment(bookingNewData);


    } else {
        showMessageToUser('Please <span class="active-color pointer" data-toggle="modal" data-target="#login-box" data-dismiss="modal" onclick="hideerrorBox()">SIGNIN</span> to make a booking. Not registered yet? <span class="active-color pointer" data-toggle="modal" data-target="#sign-up" data-dismiss="modal" onclick="hideerrorBox()">SIGNUP</span>');
        return;
    }
    if (window.innerWidth < 768) {
        $(".btn1_2").text("Confirm");
        //  $(".btn1_2").css("background","#2EB0E4");
    }

}

function bookAppointment(appointmentData) {
    var data = new FormData();
    data.Auth = udata.data.accessToken;
    data._method = "POST";
    if (problemImgdata) {
        for (var k in problemImgdata) {
            data.append("problemImage[" + k + "]", problemImgdata[k]);
        }
    }
    if ($(".leave-instruction").val()) {
        data.append("problemDetails", $(".leave-instruction").val());
    }
    data.append("subcategoryID", appointmentData.subCategoryId);
    for (var k in appointmentData.answerIDS) {
        data.append("answerIDS[" + k + "]", appointmentData.answerIDS[k]);
    }
    data.append("addressID", appointmentData.addressId);
    data.append("serviceType", serviceBasedType.toUpperCase());
    data.append("locationLat", udata.data.userDetails.currentLocation[0]);
    data.append("locationLong", udata.data.userDetails.currentLocation[1]);
    data.append("scheduleDate", appointmentData.scheduleDate);
    data.append("day", appointmentData.workingday);
    // data.append("slot", appointmentData.slots);
    data.append("favouriteGenie", appointmentData.genieSelected);
    data.append("slotType", appointmentData.slotType.toUpperCase());
    data.append("startTime", appointmentData.startTime);
    data.append("endTime", appointmentData.endTime);
    if (promo) {
        data.append("promoID", promo);
    }
    //alert('pixel purchase');
    fbq('track', 'Purchase', { currency: "AED", value: 1.00 });
    ga('send', 'event', 'Confirmation', 'Click', 'booking screen', "0");
    $.LoadingOverlay("show");
    $(".nextStep").addClass("hidden");
    callApi.queryUrl(apiUrl + "/api/appointment/bookAppointment", data, function (err, result) {
        if (!err) {
            var jobid = JSON.parse(result);
            jobid = jobid.data.appointmentId;
            localStorage.setItem("current_id", jobid);
            localStorage.setItem("isMembershipPayment", false);
            localStorage.setItem("memberUrl", null);
            localStorage.setItem("current_booking_info", null);
            location.href = '/app/genieSearch.html?id=' + jobid;
            // $.LoadingOverlay("hide", true);
        } else {
            // $("#review").modal('hide');
            $(".nextStep").removeClass("hidden");
            $.LoadingOverlay("hide", true);
            if (err.statusCode === 401) {

                err = JSON.parse(err);
                showMessageToUser(err.message)
            } else {
                err = JSON.parse(err);
                showMessageToUser(err.message)
                return;
            }

        }
    });
}


function getCityAndLanguage() {
    return {
        city: 'Dubai',
        language: 'en'
    }
}

// $(".hoverMe-effect").hover(function () {
//     $(this).find(".onHover").css('visibility', 'visible');
// }, function () {
//     $(this).find(".onHover").css('visibility', 'hidden');
// });


$(document).ready(function () {
    if (!localStorage.getItem("current_City")) {
        localStorage.setItem("current_City", "Dubai");
    }
    var selected_city = localStorage.getItem("current_City");

    callApi.getUrl(apiUrl + "/api/webapi/getCity", {}, function (err, res) {
        if (err) {
        } else if (res) {
            citys = res.data;
        }


        var docUrl = (document.URL).split("?")[1];
        if (docUrl) {
            docUrl = decodeURIComponent(docUrl.split("=")[1]);
            if (docUrl && docUrl.match(/\|/)) {
                docUrl = docUrl.split("|");
                if (docUrl && docUrl.length > 0 && docUrl[1].match(/promo/gi)) {

                    getDataForCategoryAndSubCategory();

                } else if (docUrl && docUrl.length > 0 && docUrl[1]) {
                    getAllCategories();
                    $("#cattemplate").addClass("hidden");
                    $(".main-body").removeClass("hidden");
                    $(".selected-category-section").removeClass("hidden");
                }

            } else {
                getDataForCategoryAndSubCategory();
            }
        } else {
            getDataForCategoryAndSubCategory();
        }
    })



    $("body").on("click", ".modal-dialog", function (e) {
        if ($(e.target).hasClass('modal-dialog')) {
            var hidePopup = $(e.target.parentElement).attr('id');
            $('#' + hidePopup).modal('hide');
        }
    });
    $("#curr-loc").click(function () {
        $("#curr-loc").removeClass("modal-login-button-cl");
        $("#curr-loc").addClass("modal-login-button-1-cl");
        $("#other-loc1").addClass("modal-login-button-cl");
        $("#other-loc1").removeClass("modal-login-button-1-cl");
    });
    $("#other-loc1").click(function () {
        $("#curr-loc").addClass("modal-login-button-cl");
        $("#curr-loc").removeClass("modal-login-button-1-c");
        $("#other-loc1").removeClass("modal-login-button-cl");
        $("#other-loc1").addClass("modal-login-button-1-cl");
    });
    $("#sa1").click(function () {
        $("#sa1").addClass("sa-map");
        $("#sa2").removeClass("sa-map");
        $("#sa3").removeClass("sa-map");
    });
    $("#sa2").click(function () {
        $("#sa2").addClass("sa-map");
        $("#sa1").removeClass("sa-map");
        $("#sa3").removeClass("sa-map");
    });
    $("#sa3").click(function () {
        $("#sa1").removeClass("sa-map");
        $("#sa2").removeClass("sa-map");
        $("#sa3").addClass("sa-map");
    });
    $("#edit-button-map").click(function () {
        $("#one").addClass("hidden");
        $("#two").removeClass("hidden");
    });

    $("#close-screen").click(function () {
        window.history.back();
    })
    $(".indexModalBtn").click(function () {
        getSubcategoryModalData($("#autoWidth li.selected-category").data("url"))
    });
    $(".mycity").html(localStorage.getItem("current_City"));
    takePicture();

    var check_h_user = localStorage.getItem("h_user");
    if (check_h_user && check_h_user !== 'null') {
        $(".offer-button-info").html("Select a PROMOCODE to apply");
        $(".offers-login").html("View Offers");
        $(".offers-login").css("color", "rgb(246, 173, 0)");
        $(".offers-login").css("font-size", "12px");
        $(".offers-login").css("font-family", "''poppinsMedium''");
        $(".width-offers").css("width", "70%");
        if (window.innerWidth < 768) {
            $(".mobile-booking-login").css("right", "10px");
            $(".login-signup.cat-login").css("right", "15px");
        }
    }
    getHolidays();
    getMembershipDetails();
});




function getSubcategoryModalData(subCat) {
    const params = {};
    //subCat = 'ac-thermostat-installation';
    let city_language = getCityAndLanguage();
    callApi.getUrl(apiUrl + '/api/subcategory/getSubCategory?url=' + subCat + "&getContent=true&city=" + apiCity + "&language=" + LANGUAGE, params, function (err, res) {
        if (!err && res) {
            var data = res.data[0];
            var indexModal_data = Mustache.render(infoModal_Template, data);
            $("#info-modal-click").html(Mustache.render(INFO_CLICK_DATA, data));
            $("#indexModal").html(indexModal_data);
            var BookingratingSlider = new Swiper('.rating-slider', {
                slidesPerView: 1,
                spaceBetween: 25,
                observer: true,
                observeParents: true,
                loop: true,
                mode: 'horizontal',
                centeredSlides: true,
                autoplay: {
                    delay: 3000,
                },
                speed: 1000,
                navigation: {
                    nextEl: '#rating-slider-next',
                    prevEl: '#rating-slider-prev',
                },
            });
        } else {
            var indexModal_Nodata = Mustache.render(infoModal_Template_NODATA);
            $("#indexModal").html(indexModal_Nodata);
        }
    })
}

function initializeServiceCategorizarion(subCat) {
    localStorage.setItem("current_url", subCat);
}


$(document).mouseup(function (e) {
    var container = $(".location-select");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".city-group-booking").addClass("hidden");
    }
    var myContainer = $(".ui-datepicker");
    if (!myContainer.is(e.target) && myContainer.has(e.target).length === 0) {
        $('.ui-datepicker').hide();
    }
});

function getHolidays() {
    callApi.getUrl(apiUrl + "/api/webapi/getAllHolidays", {}, function (err, res) {
        if (!err && res) {
            for (var x in res.data) {
                if (res.data[x].active && !res.data[x].deleted) {
                    var newDate = new Date(res.data[x].day);
                    holidaysList.push(newDate)
                }
            }
        } else {
            err = JSON.parse(err);
            showMessageToUser(err.message)
            return;
        }
    })
}

var SERVICE_GROUP_TEMPLATE1 = '{{#data}}{{#subcategory-list}}\n' +
    '            <div class="col-md-12 xs-padding0">\n' +
    '                <div id="serviceGroup{{index}}" class="carousel3 row swiper-container service">\n' +
    // '                    <p>{{categoryName}}</p>\n' +
    '                    <div id="serviceGroup{{index}}-page" class="carousel3-page swiper-pagination top-20"></div>\n' +
    '                    <div class="swiper-wrapper top-20"> \n' +
    '                           {{#data}} {{#categoryIds}}{{#isPopular}}{{#image}}<div class="swiper-slide  text-center service-cat-img-div">\n' +
    '                            {{#isPopular}}<div class="most-popular"><p>Most Popular</p></div>{{/isPopular}}\n' +
    '                            <div class="hoverMe-effect" ><div class="hoverMe swiper-lazy" data-background="{{image}}"></div>\n' +
    '                            <div class="onHover" onclick="window.location.href=\'{{url}}\'"><div class="onHover-img">{{#whiteImage}}<img class="img-responsive" src="{{original}}">{{/whiteImage}}</div><a href="/app/booking.html?service={{name}}"><button>BOOK NOW</button></a></div>' +
    '                            <span><p>{{name}}</p></span>\n</div>' +
    '                        </div>{{/image}} {{/isPopular}}{{/categoryIds}}{{/data}}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div id="serviceGroup{{index}}-next" class="carousel3-next swiper-button-next"></div>\n' +
    '                <div id="serviceGroup{{index}}-prev" class="carousel3-prev swiper-button-prev"></div>\n' +
    '            </div>\n' +
    '   {{/subcategory-list}}{{/data}}';

var quesTemplate = '{{#ques}}{{#DESCRIPTIVE}}\
    {{#status}}<select id="select-issue" class="select-issue select-descriptive select-options">\
        {{#answers}}<option ans-id="{{_id}}">{{answer}}</option>{{/answers}}\
        </select>{{/status}}{{/DESCRIPTIVE}}{{/ques}}';

var quesTemplate1 = '{{#ques}}{{#WHOLE}}<div style="border:none;position:relative;margin-top:10px;"><span id="wholeAdditionalCharge" class="wholeQue" data-additionalCharges="{{additionalCharges}}">{{question}}</span>\
        <select style="height:35px;position:absolute;right:0;" class="pull-right select-whole">\
            <option>Choose Ans</option>{{#answers}}<option ans-id="{{_id}}" data-additionalCharges="{{additionalCharges}}">{{answer}}</option>{{/answers}}\
        </select>\
    </div>{{/WHOLE}}{{/ques}}';
var quesTemplate2 = '{{#ques}}{{#BOOLEAN}}<div class="toggle-ui-btn" style="border:none;margin-top:10px;position:relative;">\
        <span>{{question}}</span>\
        <input type="checkbox" checked data-toggle="toggle" data-size="small" data-on="YES" data-off="NO" {{#answers}}data-{{answer}}="{{_id}}" data-booladditional="{{additionalCharges}}"{{/answers}} id="toggle-btn" style="position:absolute;right:12.5%;">\
    </div>{{/BOOLEAN}}{{/ques}}';
var quesTemplate3 = '{{#ques}}{{#BOOLEAN}}<div class="col-md-12 col-xs-12 mp-0 marginTB5 m-t-5"><div class="col-md-6 col-xs-12 "><p class="sub-title mp-0">{{question}}</p><p class="additional_charge smallText opacity_05 hidden"><span class="col-sm-7 mp-0">Additional Charges</span><span class="col-sm-5 text-right add_charge"></span></p></div>' +
    '<div class="col-md-6 col-xs-12 isFurnishedAnswer">{{#answers}}<div class="col-md-6 col-xs-6 mp-0"> ' +
    '<button class="{{cssname}}-button" data-id="{{_id}}" data-additional="{{additionalCharges}}" data-answer="{{answer}}">{{answer}}</button></div>{{/answers}}' +
    '<!--<div class="col-md-6 col-xs-6 mp-0"> <button class="no-button">No</button></div>-->' +
    '</div></div>{{/BOOLEAN}}{{/ques}}'

var address_list_template = '{{#data}}<div class="address-select-box" data-id="{{_id}}">\n' +
    '                        <label for="{{_id}}" class="radiobutton-container modal-before-sel-button-ag modal-cursor" >{{nickName}} {{#IsdefaultAddress}}(Default){{/IsdefaultAddress}}<br> <span\n' +
    '                                class="modal-blue-para-ag">{{addressType}} {{apartmentNo}}, {{streetAddress}}, {{community}}, {{city}}, {{emirate}}</span><br>\n' +
    '                            <input type="radio" name="address-list" class="modal-targer-ag address-select-box-label" id="{{_id}}" data-nickname="{{nickName}}" data-addressType="{{addressType}}" ' +
    'data-apartmentNo="{{apartmentNo}}" data-streetAddress="{{streetAddress}}" data-community="{{community}}" data-city="{{city}}" data-emirate="{{emirate}}" data-long="{{locationLongLat.0}}" data-lat="{{locationLongLat.1}}">\n' +
    '                            <span class="checkmark"></span>\n' +
    '                            <span class="checkmark33"></span>\n' +
    '                            <span class="editIcon" onclick="editAddress(\'{{_id}}\')"><i class="fa fa-pencil-square-o c_brand fa-2x" aria-hidden="true"></i></span>\n' +
    '                            <span class="deleteIcon" onclick="deleteAddress(\'{{_id}}\',\'no\')"><i class="fa fa-trash-o c_brand fa-2x" aria-hidden="true"></i></span>\n' +
    '                        </label>\n' +
    '                    </div>\n' +
    '                    <hr class="hr-ag">{{/data}}';
var address_list_template1 = '' +
    '{{#data}}<div class="row bx-shadow" id="{{_id}}" data-nickname="{{nickName}}" data-addressType="{{addressType}}" data-apartmentNo="{{apartmentNo}}" data-streetAddress="{{streetAddress}}" data-community="{{community}}" data-city="{{city}}" data-emirate="{{emirate}}"  data-long="{{locationLongLat.0}}" data-lat="{{locationLongLat.1}}"><div class="col-xs-9 column">' +
    '<p class="font-semibold">{{nickName}} {{#IsdefaultAddress}}(Default){{/IsdefaultAddress}}</p>' +
    '<p class="modal-blue-para-ag">{{addressType}} {{apartmentNo}}, {{streetAddress}}, {{community}}, {{city}}, {{emirate}}</p>' +
    '</div><div class="col-xs-3 column flex-box h-100"><button class="blue-color address-action mp-0" onclick="editAddress(\'{{_id}}\')"><i class="fa fa-edit fa-2x"></i></button><button class="blue-color address-action mp-0" onclick="deleteAddress(\'{{_id}}\',\'no\')"><i class="fa fa-trash-o fa-2x"></i></button></div></div>{{/data}}';

/*custom select css*/
function customSelect() {
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /*for each element, create a new DIV that will act as the selected item:*/
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
}

function closeAllSelect(elmnt) {
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

document.addEventListener("click", closeAllSelect);


function listClicked() {
    //variables
    getLastBookingdata = false;
    stepOneCheck = false;
    // check_boooking_data = localStorage.getItem("current_booking_info");
    // var membershipTier = localStorage.getItem("membershipTier");
    booleanYesNo = "";
    myAdditionalCharge = 0;
    baseCharge = 0, promoBaseCharge = 0, baseChargeWithoutDiscount = 0;
    problemImgdata = [], totalFileSize = 0;
    addOnsFinalList = [];
    myFile = []
    // if (check_boooking_data && check_boooking_data !== 'null') {
    //     check_boooking_data = JSON.parse(check_boooking_data);
    //     bookingData = check_boooking_data;
    // }
    bookingData.subcategoryId = $("#autoWidth li.selected-category").data("id");
    var check_h_user = localStorage.getItem("h_user");

    //html
    $(".vat-charges-box, .servicePriority-ans, .offers-menu-box, .add-ons-confirmation").addClass("hidden");
    $(".img-load-text, .alert-message").html("");
    $(".radiobutton-container input").removeAttr("checked");
    $(".nextStep").removeClass("hidden");
    $('.progressbar-dots').removeClass('active');
    $('.progressbar-dots:nth-child(1)').addClass('active');
    $('.progressbar-dots').removeClass('tick');
    $(".btn1_2").css('display', 'block');
    $(".btn1_2").attr('onclick', 'fetchDataForStepOne()');
    $(".btn1_2").text("next");
    $(".estimated-price").text("0.00")
    $(".input-num").html(0);
    $(".leave-instruction").val("");
    $(".summaryMultiImageUploaded").html("");
    $(".instructions-text").html("");
    $(".bookSummaryModal").attr("data-target", "#myModal3");
    $(".priceTotal").attr("data-target", "#payment-summary-modal");
    $(".confirmationBookingLeftTopBox, .specificDetail_instruction, .screens, .screen2, .screen3, .screen4, .screen5, .screen6, .addPromo, .offerPromoCode, .backBtnDiv, .property-selected, .addressShow").addClass('hidden');
    $(".totalBooking, .hideScreen6, #book-landing, .nextStepModalLinks, .screen1, .membership-save-button, .memership-modal-cta").removeClass('hidden');
    $(".bookSummaryRightBox").removeClass('height-unset');
    $(".bx-shadow").removeClass("bx-shadow-select");
    $(".select-slot.select-time li").removeClass("selected-slots");
    $(".select-slot.select-time li img").hide();
    $(".location-type button, .yes-button, .no-button").removeClass("blue-button");
    $(".selected-addressType").html("");
    $(".offer-hidden").removeClass("hidden");
    getSubcategoryModalData($("#autoWidth li.selected-category").data("url"));
    $(".enterPromo").removeAttr("disabled")

    //css
    $(".membership-save-button").css("bottom", "-5px")
    $(".addOns-text").css("color", "#4B4B4B");
    $(".checkmark33").css("background", "white")
    $(".nextStep .bookSummaryModal .estimated-price").css("font-size", "14px");

    //js
    if (addOnsList && addOnsList.length > 0 && globalServiceType && globalServiceType == MSG.FIXED) {
        isAddOn = true;
    } else {
        isAddOn = false;
    }
    // if(localStorage.getItem("isMember") === "true"){
    //     getMembershipChanges();
    //     if(membershipTier && membershipTier != "null"){
    //         if(membershipTier =="Basic"){
    //             $(".selected-category-section.booking-page, .membership-update").css("background",'#6D5857');
    //         }else if(membershipTier =="Silver"){
    //             $(".selected-category-section.booking-page, .membership-update").css("background",'#BCBCBC');
    //         }else if(membershipTier =="Gold"){
    //             $(".selected-category-section.booking-page, .membership-update").css("background",'#D1B956');   
    //         }
    //     }
    //     if(localStorage.getItem("membershipSucess") == "true"){
    //         localStorage.setItem("membershipSucess",false);
    //         $("#memberhsip-success").html(MEMBERSHIP_MODAL_TEMPLATE);
    //         $("#memberhsip-success").modal("show");
    //     }
    // }


    if (!($(".address-select option:selected").data("membership"))) {
        $('.enterPromo').val('');
        promo = '';
        promoData = '';
        $('.del-promo, .offerPromoCode').addClass('hidden');
        $('.apply-promo').removeClass('hidden');
    }

    if (check_h_user && check_h_user !== 'null') {
        getRelatedOffers();
        $(".addPromo").removeClass("hidden");
    }

    // if (localStorage.getItem("isMembershipPayment") && localStorage.getItem("memberUrl") == "booking" && bookingData && localStorage.getItem("oldSubCategoryName") == localStorage.getItem("subCategoryName")) {
    //     getLastBookingdata = true;
    //     if (bookingData.descriptiveIndex) {
    //         $(".select-descriptive").prop("selectedIndex", bookingData.descriptiveIndex);
    //     } else {
    //         $(".select-descriptive").prop("selectedIndex", 0)
    //     }
    //     if (bookingData.wholeCount) {
    //         $(".input-num, .whole-ans-num").html(QUES.WHOLE.answers[bookingData.wholeCount - 1].answer);
    //         $(".input-num").attr("data-ans-id", QUES.WHOLE.answers[bookingData.wholeCount - 1]._id);
    //         $(".input-num").attr("data-additionalcharges", QUES.WHOLE.additionalCharges);
    //         whole = QUES.WHOLE.answers[bookingData.wholeCount - 1]._id;
    //         wholeAdditionalCharge = QUES.WHOLE.additionalCharges;
    //         WHOLE_COUNT = bookingData.wholeCount;
    //     } else {
    //         increment('no');
    //     }
    //     if (bookingData.booleanYesNo) {
    //         $("." + bookingData.booleanYesNo.toLowerCase() + "-button").click();
    //     } else {
    //         $(".no-button").click();
    //     }
    //     if (bookingData.addOnAnswerList && bookingData.addOnAnswerList.length > 0) {
    //         getAddOnData()
    //         for (var x in bookingData.addOnAnswerList) {
    //             $(".input-add-on-" + bookingData.addOnAnswerList[x].questionId).html(bookingData.addOnAnswerList[x].value);
    //             bookingData.answerIDS.push(bookingData.addOnAnswerList[x]._id);
    //         }
    //         $(".add-ons-confirmation").removeClass("hidden");
    //         stepOneCheck = true;
    //     }
    //     if (isMandatoryAttachment) {
    //         getMandatory()
    //     }
    //     getLastSpecificDetails();
    //     if (bookingData.dateIndex) {
    //         getSlots();
    //         $(".serviceDateTime").removeClass("hidden");
    //     }
    //     if (check_boooking_data.addressId) {
    //         $(".address-select .address-select-box[data-id='" + check_boooking_data.addressId + "']>label>.address-select-box-label").click();
    //     }
    //     if (bookingData.screenName) {
    //         moveToScreen(bookingData.screenName);
    //     }
    // } else {
    if (boolean_data) {
        $(".alert-message").html("");
        $(".booleanQuesAns button").removeClass("blue-button");
        $("." + boolean_data.toLowerCase() + "-button").addClass("blue-button");
        booleanYesNo = boolean_data;
        $(".boolean-yes-noBox").removeClass("hidden");
        $(".boolean-yes-no").html(booleanYesNo);
    }
    if (whole_data) {
        whole_data = parseInt(whole_data)
        for (var x = 0; x < whole_data; x++) {
            if (boolean_data) {
                increment(boolean_data);
            }
            else {
                increment("no")
            }
        }
    }
    $(".no-button").click();
    booleanYesNo = $(".no-button").data("answer");
    $(".boolean-yes-noBox").removeClass("hidden");
    $(".boolean-yes-no").html(booleanYesNo);
    $(".select-descriptive").prop("selectedIndex", 0);
    increment('no');
    //}

    $(".desc-selected").removeClass("hidden");
    $(".whole-value").removeClass("hidden");
    $(".descriptive-answer").html($(".select-descriptive option:selected").text().slice(2,));

    calculateCharges();
}


function commonEdit() {
    $(".bookSummaryModal").attr("data-target", "#myModal3");
    $(".priceTotal").attr("data-target", "#payment-summary-modal");
    $(".totalBooking, .hideScreen6, .offers-menu-box").removeClass('hidden');
    $(".membership-save-button").css("bottom", "20px")
    $(".bookSummaryRightBox").removeClass('height-unset');
    $(".confirmationBookingLeftTopBox, .specificDetail_instruction").addClass('hidden');
    $(".btn1_2").text("next");
}

$(".service-Details-edit").click(function () {
    $(".screens, .backBtnDiv").addClass("hidden");
    $(".screen1").removeClass("hidden");
    commonEdit();
    $(".btn1_2").attr('onclick', 'fetchDataForStepOne("edit")');
});


$(".date-and-time-edit").click(function () {
    $(".screens").addClass('hidden');
    $(".screen4").removeClass('hidden');
    commonEdit();
    $(".btn1_2").attr('onclick', 'fetchTimeAndSlot("edit")');
});


$(".address-edit").click(function () {
    $(".screens").addClass('hidden');
    $(".screen5").removeClass('hidden');
    commonEdit();
    $(".btn1_2").attr('onclick', 'fetchSelectedAddress()');
});

$(".specific-edit").click(function () {
    $(".screens").addClass('hidden');
    $(".screen3").removeClass('hidden');
    commonEdit();
    $(".btn1_2").attr('onclick', 'fetchDataFromAddSpecificDetails("edit")');
});

function moveToConfirm() {
    $(".screens , .hideScreen6, .offers-menu-box").addClass('hidden');
    $(".membership-save-button").css("bottom", "-5px")
    $(".screen6").removeClass('hidden');
    $(".bookSummaryModal, .priceTotal").attr("data-target", "");
    $(".totalBooking").addClass('hidden');
    $(".bookSummaryRightBox").addClass('height-unset');
    $(".confirmationBookingLeftTopBox,.specificDetail_instruction, .backBtnDiv").removeClass('hidden');
    $("").removeClass('hidden');
    $(".btn1_2").attr('onclick', 'checkRequiredFieldsForAppointment()');
    $(".btn1_2").text("Confirm");
    if (window.innerWidth < 768) {
        $(".btn1_2").text("Confirm");
    }
}

$("#myModal3").on('shown.bs.modal', function () {
    // $('.nextStep').addClass('sm-liteBlue');
    $('.bookSummaryModal .fa-angle-down').addClass('arrow-rotate');

});

$("#myModal3").on('hidden.bs.modal', function () {
    // $('.nextStep').removeClass('sm-liteBlue');
    $('.bookSummaryModal .fa-angle-down').removeClass('arrow-rotate');
});
// $(".bookSummaryModal").click(function() {
//     $(".nextStep").addClass('sm-liteBlue');
// });

function createCustomDate(day_month) {
    day_month = moment(day_month).format("YYYY-MM-DD");
    let c_dates = [];
    let totalDays = 30;
    for (let i = 0; i < totalDays; i++) {
        let c_date = {};
        c_date.date = moment().add(i, 'days').format('D');
        c_date.day = moment().add(i, 'days').format('llll').split(",")[0];
        c_date.month = moment().add(i, 'days').format('MMMM');
        c_date.fullDate = moment().add(i, 'days').format('YYYY-MM-DD');
        c_date.index = i;
        if (c_date.day == "Fri") {
            c_date.isFriday = true;
        } else {
            c_date.isFriday = false;
        }
        var holidayCheck = new Date(c_date.fullDate)

        for (var x in holidaysList) {
            if (moment(holidaysList[x]).format("MMM Do YY") == moment(holidayCheck).format("MMM Do YY")) {
                c_date.isHoliday = true;
            }
        }
        c_dates.push(c_date);
    }

    let c_date_template = '{{#date_data}}<li class="swiper-slide {{#isHoliday}}opacity_05{{/isHoliday}}" data-fulldate="{{fullDate}}" data-month="{{month}}" data-date="{{date}}" data-day="{{day}}" data-index="{{index}}"><span class="date-list"><span class="day">{{day}}</span><span class="date">{{date}}</span>{{#isFriday}}<span class="extra hidden">Extra</span>{{/isFriday}}</span></li>{{/date_data}}';
    $(".swiper-wrapper-datetime").html(Mustache.render(c_date_template, { "date_data": c_dates }));
    swiperdate = new Swiper('#service-datetime', {
        slidesPerView: 5.8,
        speed: 2000,
        observeParents: true,
        observer: true,
        // // effect: "fade",
        loop: false,
        navigation: {
            nextEl: '.se-da-next',
            prevEl: '.se-da-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 2.7,
            },
            768: {
                slidesPerView: 6,
            },
            992: {
                slidesPerView: 4.5,
            }
        }
    });

    $(".swiper-wrapper-datetime li").click(function () {
        if ($(this).hasClass("opacity_05") == false) {
            $(".swiper-wrapper-datetime li").removeClass("date-selected");
            $(this).addClass("date-selected");
            var slideNo = parseInt($(this).data("index"));
            if (slideNo < 2) {
                swiperdate.slideTo(slideNo);
            } else {
                swiperdate.slideTo(slideNo - 1);
            }
            bookingData.dateIndex = slideNo + 1;
            let dateToSet = $(this).data('fulldate');
            updateDateToCalendar(dateToSet);
            let s_date = new Date(scheduleddate).setHours(0, 0, 0, 0);
            workingday = day[new Date(s_date)];
            updateTimeSlot(dateToSet);
        } else {
            if (workingday == "") {
                $(this).next().click();
            }
        }
    });
    setTimeout(function () {
        if (getLastBookingdata) {
            if (check_boooking_data && check_boooking_data.dateIndex) {
                var lastDate = check_boooking_data.dateIndex;
                $(".swiper-wrapper-datetime li:nth-child(" + lastDate + ")").click();
            }
        } else {
            $(".swiper-wrapper-datetime li:nth-child(1)").click();
        }
    }, 300);
}


$(".backBtnDiv").click(function () {
    backwardNavigation();
});

function backwardNavigation() {
    let screen;
    $(".alert-message").html("");
    if (!$(".screen5").hasClass("hidden")) {
        screen = 'screen5'
    }
    if (!$(".screen6").hasClass("hidden")) {
        screen = 'screen6'
    }
    if (!$(".screen1").hasClass("hidden")) {
        screen = 'screen1'
    }
    if (!$(".screen3").hasClass("hidden")) {
        screen = 'screen3'
    }
    if (!$(".screen4").hasClass("hidden")) {
        screen = 'screen4'
    }
    if (!$(".add-ons").hasClass("hidden")) {
        screen = 'add-ons'
    }
    switch (screen) {
        case 'screen3':
            $(".screens").addClass('hidden');
            $(".screen1").removeClass('hidden');
            $(".btn1_2").attr('onclick', 'fetchDataForStepOne()');
            $(".backBtnDiv").addClass("hidden");
            if (isAddOn) {
                $(".screens").addClass('hidden');
                $(".add-ons, .backBtnDiv").removeClass('hidden');
                $(".btn1_2").attr('onclick', 'fetchDataFromAddOns()');
            }
            break;
        case 'add-ons':
            $(".screens").addClass('hidden');
            $(".screen1").removeClass('hidden');
            $(".btn1_2").attr('onclick', 'fetchDataForStepOne()');
            $(".backBtnDiv").addClass("hidden");
            break;
        case 'screen4':
            $(".screens").addClass('hidden');
            $(".screen1").removeClass('hidden');
            $(".btn1_2").attr('onclick', 'fetchDataForStepOne()');
            $(".backBtnDiv").addClass("hidden");
            if (isAddOn) {
                $(".screens").addClass('hidden');
                $(".add-ons, .backBtnDiv").removeClass('hidden');
                $(".btn1_2").attr('onclick', 'fetchDataFromAddOns()');
            }
            if (isMandatoryAttachment) {
                $(".screens").addClass('hidden');
                $(".screen3").removeClass('hidden');
                $(".btn1_2").attr('onclick', 'fetchDataFromAddSpecificDetails()');
                $(".backBtnDiv").removeClass("hidden");
            }
            break;
        case 'screen5':
            $(".screens").addClass('hidden');
            $(".screen4").removeClass('hidden');
            $(".btn1_2").attr('onclick', 'fetchTimeAndSlot()');
            break;
        case 'screen6':
            $(".screens").addClass('hidden');
            $(".screen5").removeClass('hidden');

            commonEdit();
            $(".btn1_2").attr('onclick', 'fetchSelectedAddress()');
            break;
        default:
            break;

    }
}

function disabledDateTimeSlot(day) {
    /*for friday*/
    if (day === MSG.EMERGENCY || day === MSG.SAMEDAY) {
        $(".swiper-wrapper-datetime li").each(function () {
            if ($(this).data('day') === day) {
                $(this).addClass("disabled-day");
            } else {
                $(this).removeClass("disabled-day");
            }
        })
    } else {
        $(".swiper-wrapper-datetime li").each(function () {
            if ($(this).data('day') === day) {
                $(this).addClass("disabled-day");
            } else {
                $(this).removeClass("disabled-day");
            }
        })
    }

}

/* Category subcategory code*/
var categorySubcategory = [];
var selectedCity;

function changeMyCity() {
    localStorage.setItem("current_City", selectedCity);
    window.location.reload();
}

function cityChanged(city) {
    selectedCity = city;
    if (selectedCity == localStorage.getItem("current_City")) {
        $(".city-group-booking").addClass("hidden");
        return;
    }
    $("#change-city").modal("show");
};

function getDataForCategoryAndSubCategory() {
    var selected_city = localStorage.getItem("current_City");
    selected_city = uppercase(selected_city);
    callApi.getUrl(apiUrl + "/api/webapi/getCategorySubCategoryUrlsForSiteMap?city=" + selected_city + "&language=en", {}, function (err, res) {
        if (!err && res) {
            categorySubcategory = res.data;
            var specialisedData;
            callApi.getUrl(apiUrl + "/api/category/getSpecializedServices", {}, function (err1, res1) {
                if (!err1 && res1) {
                    if (res1.data) {
                        res1.data = res1.data.filter(x => x.name === 'Specialised Services');
                        specialisedData = res1.data[0];
                        specialisedData.isSpecialised = true;
                    }

                    for (let k in res.data) {
                        res.data[0].active = "active";
                        res.data[0].in = "in";
                        let j
                        for (j in res.data[k].categoryIds) {
                            res.data[0].categoryIds[0].active_active = "active";
                            res.data[0].categoryIds[0].in_in = "in";
                            res.data[k].categoryIds[0].active_active = "active";
                            res.data[k].categoryIds[0].in_in = "in";
                            res.data[k].categoryIds[0].active_active_active = "active_active";
                            res.data[k].categoryIds[0].in_in_in = "in_in";
                        }
                        res.data[k].categoryIds.push(specialisedData);
                    }


                    let cat_subcat_template = Mustache.render(CAT_SUBCAT_TEMPLATE, res);

                    $("#cattemplate").html(cat_subcat_template);
                    $("#city-href").attr("onclick", `location.href=\'/en/${localStorage.getItem("current_City").toLowerCase()}\'`);

                    var optionData = '{{#cities}}<option value="{{key}}"> {{name}}</option>{{/cities}}';
                    var addressData = '<option value="Select city" disabled>Select city</option>{{#cities}}<option value="{{name}}"> {{name}}</option>{{/cities}}';
                    var optionData2 = '{{#cities}}<li value="{{key}}" onclick="cityChanged(\'{{key}}\')"> {{name}}</li>{{/cities}}';

                    cities = {
                        'cities': citys
                    }
                    $(".select-city-booking").html(Mustache.render(optionData, cities));
                    $(".drop-city-booking").html(Mustache.render(optionData2, cities));
                    $("#select-city").html(Mustache.render(addressData, cities));
                    let cityN = localStorage.getItem('current_City');
                    $(".select-city-booking").val(cityN.toLowerCase());

                    $(".dropdown-menu.account-menu.pull-right").html(DROPDOWN_DATA);

                    $.LoadingOverlay("hide", true);
                    $(".select-city-booking").change(function () {
                        localStorage.setItem("current_City", $(this).val());
                        $(".mycity").html(localStorage.getItem("current_City"));
                        $.LoadingOverlay("show");
                        $("#city-href").attr("onclick", `location.href=\'/en/${localStorage.getItem("current_City").toLowerCase()}\'`);
                        getDataForCategoryAndSubCategory();
                    });
                    let doc_cat = decodeURIComponent(document.URL.split("=")[1])
                    if (doc_cat && doc_cat != 'undefined') {
                        $("#search-category").val(doc_cat);
                    }
                    $("#search-category").click();
                    var check_h_user = localStorage.getItem("h_user");
                    if (check_h_user && check_h_user !== 'null') {
                        $(".class-login").html("");
                        check_h_user = JSON.parse(check_h_user)
                        updateUserInfo(check_h_user);
                        $(".name-id4").hide();
                        $(".name-id3NewCategory").removeClass('hidden');
                    }
                    let urlCategory = (document.URL).split("?");
                    if (urlCategory && urlCategory.length > 0) {
                        if (urlCategory[1]) {
                            urlCategory = urlCategory[1].split("=")[1];
                        }

                        if (urlCategory) {
                            findCategory(decodeURIComponent(urlCategory));
                        }
                        ;
                    }


                    $(".categorybuttons > li> a").click(function () {

                    });
                    setTimeout(() => {
                        autocompleteCategorySearch();
                    }, 900)
                    $('#cattemplate .subCategories a.subcat').click(function () {
                        //alert('pixel Lead');
                        fbq('track', 'Lead');
                    });


                }
            });
            getCategorySubcategoryList(true);
            getAllCategories();
        }
    });
}

function findCategory(category) {
    for (let i = 0; i < categorySubcategory.length; i++) {
        for (let j = 0; j < categorySubcategory[i].categoryIds.length; j++) {
            if (category == categorySubcategory[i].categoryIds[j].name) {
                var parentCategory = categorySubcategory[i].category;
                var categoryId = `cat${categorySubcategory[i].categoryIds[j]._id}`;
                $(`.${parentCategory}`).click();
                $(`#${categoryId}`).click();
                break;
            }
        }
    }
}

function searchByCategory(category, Array) {
    for (let i = 0; i < Array.length; i++) {
        if (Array[i].name == category) {
            return i;
        }
    }
    return -1;
}

function autocompleteCategorySearch() {
    $('#search-category').devbridgeAutocomplete({
        lookup: servicesArray,
        minChars: 1,
        onSelect: function (suggestion) {
            service = suggestion.data;
            let parentCategory, categoryId;
            if (service) {
                service = service.split(" | ")[0];
                /// fbq('track', 'Search');
                /// window.location.href = suggestion.URL;
                for (let k = 0; k < 4; k++) {
                    let x = searchByCategory(service, categorySubcategory[k].categoryIds);
                    if (x != -1) {
                        parentCategory = categorySubcategory[k].category;
                        categoryId = `cat${categorySubcategory[k].categoryIds[x]._id}`;
                        break;
                    }
                }
                $(`.${parentCategory}`).click();
                $(`#${categoryId}`).click();
            }
        },
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'Sorry, no matching results',

    });
    // $('#search-category').autocomplete().onValueChange();
}

function goForBooking(cat, subcat) {

    ga('send', 'event', subcat, 'Click', 'category and subcategory', "0");

    var cat_sub_cat = cat + "|" + encodeURIComponent(subcat);
    $("#cattemplate").addClass("hidden");
    $(".main-body").removeClass("hidden");
    $(".selected-category-section").removeClass("hidden");
    prevCategory = cat;
    getAllCategories(cat_sub_cat)
}

function gtagFunctionForSuperCategory(data) {
    ga('send', 'event', 'category and subcategory', 'Click', data, "0");
}
function gtagFunctionCategory(data) {
    ga('send', 'event', 'category and subcategory', 'Click', data, "0");
}

function changeMyCategory() {
    localStorage.setItem("isMembershipPayment", false);
    localStorage.setItem("memberUrl", null);
    localStorage.setItem("current_booking_info", null);
    if (changeCategory) {
        bookingData = {};
        promoData = {};
        WHOLE_COUNT = 0;
        $(".descriptive-answer, .whole-ans-num, .subcategoryType").html("-");
        $(".cat-selected, .serviceType, .additional_charge, .whole_additional_charge").addClass("hidden");
        $(".issue-booking").attr("data-id", "");

        $(".btn1_2").css("display", "none");
        $("#add-info").html('<select id="select-issue" class="select-issue select-descriptive select-options option-selected" onchange="$(this).addClass(\' option-selected\')">\
                <option>Select</option>\
            </select>');

        $('.service-priority input').prop('checked', false)

        if (categoryURL.data("isPopular") === "true") {
            $(".most-popular").show();
        } else {
            $(".most-popular").hide();
        }
        prevCategory = categoryURL.val();
        showSubCategoryList(categoryURL.val(), myCategoryData);
    } else {
        bookingData = {};
        prevSubCategoryURl = subCategoryURl;
        $(".descriptive-answer, .whole-ans-num, .subcategoryType").html("-");
        $(".subcategory-ul li").removeClass("selected-category");
        $("#autoWidth li img").hide();
        $(".additional_charge, .whole_additional_charge").addClass("hidden");
        prevSubCategoryURl.addClass("selected-category");
        $("#autoWidth li.selected-category img").show();
        $(".selected-subcategory-title").html($(".subcategory-ul li.selected-category").text());
        $(".select-selected").html($(".subcategory-ul li.selected-category").text());
        var bgImage = $("#autoWidth li.selected-category").data("image");

        goToNumber = parseInt($("#autoWidth li.selected-category").data("index"));
        slider.goToSlide(goToNumber);

        $(".category-image").css("background-image", "url(" + bgImage + ")");
        initializeServiceCategorizarion($("#autoWidth li.selected-category").data("url"));
        $(".book-continue-btn").hide();
        if ($("#autoWidth li.selected-category").data("emergencyallowed") == true) {
            $(".scope-icons-emergency .avail-img>img").attr("src", "/app/images/emergency-2x.png");
        } else {
            $(".scope-icons-emergency .avail-img>img").attr("src", "/app/images/emergency-2x-gray.png");
        }
        /*if ($("#autoWidth li.selected-category").data("fridayallowed") == true) {
            $(".scope-icons-friday .avail-img img").attr("src", "/app/images/friday-2x.png");
            disabledDateTimeSlot(null);
        } else {
            $(".scope-icons-friday .avail-img img").attr("src", "/app/images/friday-2x-gray.png");
            disabledDateTimeSlot('Fri');
        }*/
        selectSubCategory(subTtypeOfService, subServiceCat, subDataCategory);
        updateServiceType();

        $(".cat-selected").removeClass('hidden');

        listClicked();
    }
}

$(".location-select").click(function () {
    if (!$(".city-group-booking").hasClass("hidden")) {
        $(".city-group-booking").addClass("hidden");
    } else {
        $(".city-group-booking").removeClass("hidden");
    }
});



$('body').click(function (e) {
    if ($(".modal-backdrop")[0]) {
        $("body").addClass("modal-open");
        // Do something if class exists
    } else {
        // Do something if class does not exist
        $("body").removeClass("modal-open");
    }
});
function prevValue() {
    $(".select-maincategory").val(prevCategory);
}


function checkOffers() {
    var check_h_user = localStorage.getItem("h_user");
    if (check_h_user && check_h_user !== 'null') {
        $("#offers-modal").modal("show");
    } else {
        $("#loginModal .modal-title").html("Login/Signup into HomeGenie!");
        $("#loginModal .modal-para").html("Please provide your mobile number to login/ signup into your HomeGenie account.");
        loginModal();
        $("#offers-mobile").modal("hide");
        $("#loginModal").modal('show');

    }
}

function openOffersTnc(className) {
    if ($("." + className).hasClass("hidden")) {
        $("." + className).removeClass("hidden");
    } else {
        $("." + className).addClass("hidden");
    }
}

function applyOffers(apply1, remove1, myPromo, index1, index2) {
    var data = new FormData();
    data.append("customerID", udata.data.userDetails["_id"]);
    data.Auth = udata.data.accessToken;
    data.append("categoryID", $(".select-maincategory option:selected").data("id"));
    data.append("subCategoryID", $('#autoWidth li.selected-category').attr('data-id'));
    data.append("scheduleDate", scheduleddate);
    data._method = "POST";
    data.append("promoCode", myPromo);
    $.LoadingOverlay("show");
    callApi.queryUrl(apiUrl + "/api/customer/applyPromoCode", data, function (err, results) {
        if (!err && results) {
            $(".enterPromo").attr("disabled", "disabled");
            $.LoadingOverlay("hide", true);
            results = JSON.parse(results);
            if (results.data) {
                if (results.data.minBillAmt) {
                    if (promoBaseCharge >= results.data.minBillAmt) {
                        promo = results.data["_id"];
                        promoData = results.data;
                        let message;
                        if (promoData.maxDiscountAmt) {
                            if (promoData.discountInPercentage) {
                                message = 'Promo of ' + promoData.discountInPercentage + '% (Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                            } else {
                                message = 'Promo of ' + promoData.discountInAmount + 'AED(Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                            }
                        } else {
                            if (promoData.discountInPercentage) {
                                message = 'Promo of ' + promoData.discountInPercentage + '% is applied successfully.';
                            } else {
                                message = 'Promo of ' + promoData.discountInAmount + 'AED is applied successfully.';
                            }
                        }
                        showMessageToUser(message);
                        showDeletePromoButton();
                        $('.enterPromo').val(myPromo);
                        $(".offerPromoCode").show();
                        $(".offerPromoCode").removeClass("hidden");
                        $(".remove").addClass("hidden");
                        $(".apply").removeClass("hidden");
                        $(".myOffer-code").css("background-color", "#2EB0E4")
                        $(".myOffer-tnc").css("color", "#2EB0E4");
                        $("." + apply1).addClass("hidden");
                        $("." + remove1).removeClass("hidden");
                        $("." + index1).css("background-color", "rgba(0,0,0,0.4)")
                        $("." + index2).css("color", "rgba(0,0,0,0.4)");
                        $("#offers-modal").modal("hide");
                        calculateCharges();
                    } else {
                        var message = "This promo will be valid only on the minimum bill amount of " + results.data.minBillAmt + "AED."
                        showMessageToUser(message);
                    }
                } else {
                    promo = results.data["_id"];
                    promoData = results.data;
                    let message;
                    if (promoData.maxDiscountAmt) {
                        if (promoData.discountInPercentage) {
                            message = 'Promo of ' + promoData.discountInPercentage + '% (Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                        } else {
                            message = 'Promo of ' + promoData.discountInAmount + 'AED(Maximum of AED ' + promoData.maxDiscountAmt + ') is applied successfully.';
                        }
                    } else {
                        if (promoData.discountInPercentage) {
                            message = 'Promo of ' + promoData.discountInPercentage + '% is applied successfully.';
                        } else {
                            message = 'Promo of ' + promoData.discountInAmount + 'AED is applied successfully.';
                        }
                    }
                    showMessageToUser(message);
                    showDeletePromoButton();
                    $('.enterPromo').val(myPromo);
                    $(".remove").addClass("hidden");
                    $(".apply").removeClass("hidden");
                    $(".myOffer-code").css("background", "#2EB0E4")
                    $(".myOffer-tnc").css("color", "#2EB0E4");
                    $("." + apply1).addClass("hidden");
                    $("." + remove1).removeClass("hidden");
                    $("." + index1).css("background-color", "rgba(0,0,0,0.4)")
                    $("." + index2).css("color", "rgba(0,0,0,0.4)");
                    $("#offers-modal").modal("hide");
                    calculateCharges();
                }
                $("#promocode").html(myPromo);
            }
        } else {
            $.LoadingOverlay("hide", true);
            err = JSON.parse(err);
            showMessageToUser(err["responseType"].replaceAll("_", " "));
            $(".enterPromo").removeAttr("disabled")
        }
    });

}

function removeOffers(remove1, apply1) {
    deletePromo();
    $("." + remove1).addClass("hidden");
    $("." + apply1).removeClass("hidden");
}


function getRelatedOffers() {
    if (bookingData && bookingData.subcategoryId) {
        var data = new FormData();
        data._method = "POST";
        data.Auth = udata.data.accessToken;
        data.append("subcategoryId", bookingData.subcategoryId);
        $.LoadingOverlay("show");
        callApi.queryUrl(apiUrl + "/api/customer/relatedOffers", data, function (err, result) {
            if (!err) {
                const myData = JSON.parse(result);
                var newdate = new Date()
                for (var x in myData.data) {
                    if (myData.data[x].promo.maxUserCount != myData.data[x].promo.customerID.length && new Date(myData.data[x].promo.endTime) > newdate) {
                        myData.data[x].status = true;
                    } else {
                        myData.data[x].status = false;
                    }
                    if (myData.data[x].promo.frequencyPerUser == 1) {
                        if (myData.data[x].promo.customerID.indexOf(udata.data.userDetails["_id"]) >= 0 ? true : false) {
                            myData.data[x].status = false;
                        }
                    }
                }
                if (myData && myData.data && myData.data.length > 0) {
                    $("#allOffers").html(Mustache.render(OFFER_TEMPLATE, myData));
                }
                $.LoadingOverlay("hide");
            } else {
                err = JSON.parse(err)
                showMessageToUser(err.message);
            }
        });
    }
}


function offersBook() {
    if (window.innerWidth < 768) {
        $("#offers-mobile").modal("show");
    }
    else {
        if (fromModal) {
            $("#payment-summary-modal").modal('hide');
            fromModal = false;
            if (!stepOneCheck) {
                showMessageToUser("Please fill each screen's data first.")
                fetchDataForStepOne();
                return;
            }
            else if (isAddOn && !addOnCheck) {
                showMessageToUser("Please fill each screen's data first.")
                fetchDataFromAddOns();
                return;
            } else if (isMandatoryAttachment && !isMandatoryCheck) {
                showMessageToUser("Please fill each screen's data first.")
                fetchDataFromAddSpecificDetails();
                return;
            } else {
                showMessageToUser("Please click on the view offers to explore discounts.")
            }
        } else {
            showMessageToUser("Please click on the view offers to explore discounts.")
            backwardNavigation();
        }
    }
}

function changeMypriority(priority, slotType, startTime, endTime) {
    serviceBasedType = priority;
    bookingData.servicePriority = serviceBasedType;
    bookingData.slotType = slotType;
    bookingData.startTime = startTime;
    bookingData.endTime = endTime;
    $(".servicePriority").html(bookingData.servicePriority);
    $(".servicePriority, .list-priority, .servicePriority-ans").removeClass("hidden");
    if (bookingData && bookingData.servicePriority) {
        if (bookingData.servicePriority === 'EMERGENCY') {
            $(".servicePriority").addClass("red-color");
            $(".subtext-servicePriority").addClass("hidden");
            $(".emergency-text").removeClass("hidden");
            $(".servicePriority").removeClass("yellow-text");
        } else if (bookingData.servicePriority === (MSG.SAMEDAY).toUpperCase()) {
            $(".subtext-servicePriority").addClass("hidden");
            $(".sameday-text").removeClass("hidden");
            $(".servicePriority").addClass("yellow-text");
            $(".servicePriority").removeClass("red-color");
        } else if (bookingData.servicePriority === (MSG.SCHEDULED).toUpperCase()) {
            $(".subtext-servicePriority").addClass("hidden");
            $(".scheduled-text").removeClass("hidden");
            $(".servicePriority").addClass("yellow-text");
            $(".servicePriority").removeClass("red-color");
        }
    }
    calculateCharges()
}

function getSlots() {
    if (bookingData && bookingData.categoryId) {
        callApi.getUrl(apiUrl + "/api/category/slots?categoryId=" + bookingData.categoryId, {}, function (err, res) {
            if (!err && res) {
                slotDetails = res.data;
                setDate();
            } else {
                err = JSON.parse(err);
                showMessageToUser(err.message)
            }
        });
    }
}

function buyMembership() {
    var check_h_user = localStorage.getItem("h_user");
    if (check_h_user && check_h_user !== 'null') {
        localStorage.setItem("isMembershipPayment", true);
        localStorage.setItem("memberUrl", "booking");
        if (bookingData) {
            var current_booking_data = JSON.stringify(bookingData);
            localStorage.setItem("current_booking_info", current_booking_data);
            location.href = "/app/html/paymentgateway.html"
        } else {
            showMessageToUser("Booking Data is Empty.")
        }
    } else {
        loginModal();
        $("#loginModal").modal('show');
    }
}

var ratingSlider = new Swiper('#rating-slider', {
    slidesPerView: 1,
    spaceBetween: 25,
    observer: true,
    observeParents: true,
    loop: true,
    mode: 'horizontal',
    centeredSlides: true,
    autoplay: {
        delay: 3000,
    },
    speed: 1000,
    navigation: {
        nextEl: '#rating-slider-next',
        prevEl: '#rating-slider-prev',
    },
});

function fetchDataFromAddOns(edit) {
    $(".input-note-text").css("color", "#60604E");
    $(".addOns-text").css("color", "#4B4B4B");
    $(".alert-message").html("");
    $(".add-ons-edit").show();
    var minimumAddOnPrice = parseInt($("#autoWidth li.selected-category").data("minimumaddoncharge"));
    if (bookingData && bookingData.addOnAnswerList && bookingData.addOnAnswerList.length > 0) {
        if (total_charges >= minimumAddOnPrice) {
            for (var x in bookingData.addOnAnswerList) {
                bookingData.answerIDS.push(bookingData.addOnAnswerList[x]._id);
            }
        } else {
            $(".addOns-text").css("color", "red");
            return
        }
    }
    addOnCheck = true;
    if (!edit) {
        if (isMandatoryAttachment) {
            getSpecificDetailsScreen();
            return;
        } else {
            getSlotScreen();
            return;
        }
    } else {
        moveToConfirm();
    }
}


$(".add-ons-edit").click(function () {
    $(".screens").addClass('hidden');
    $(".add-ons").removeClass('hidden');
    commonEdit();
    $(".btn1_2").attr('onclick', 'fetchDataFromAddOns("edit")');
    backData = "screen6";
    backFunction = "checkRequiredFieldsForAppointment()";
});

function showAddOnsInfo(title, text) {
    $('#add-on-modal').modal('hide');

    $("#add-on-tittle").html(title + " ADD-ON");
    if (text) {
        $("#add-on-text").html(text);
    } else {
        $("#add-on-text").html("Sorry, We don't have any information about this add ons yet!");
    }
    $('#add-on-modal').modal('show');
}


function decreaseAddOns(id) {
    var itemCount = 0;
    if (addOnsFinalList && addOnsFinalList.length > 0) {
        itemCount = addOnsFinalList.filter(x => x == id).length
        if (itemCount) {
            var itemIndex = addOnsFinalList.indexOf(id);
            addOnsFinalList.splice(itemIndex, 1);
        }
        itemCount = addOnsFinalList.filter(x => x == id).length
    }
    var addOn = myAddOnList.filter(x => x._id == id);
    if (itemCount) {
        $(".input-add-on-" + id).html(addOn[0].answers[itemCount - 1].answer);
    } else {
        $(".input-add-on-" + id).html(0);
    }
    bookingData.addOnsFinalList = addOnsFinalList;
    calculateCharges();
}
function increaseAddOns(id) {
    var itemCount = 0;
    addOnsFinalList.push(id)
    itemCount = addOnsFinalList.filter(x => x == id).length

    var addOn = myAddOnList.filter(x => x._id == id);
    if (addOn && addOn.length > 0 && addOn[0].answers[itemCount - 1]) {
        $(".input-add-on-" + id).html(addOn[0].answers[itemCount - 1].answer);
    } else {
        addOnsFinalList.pop();
        showMessageToUser("You can not add more of this Add Ons, Try our other Add Ons!");
    }
    bookingData.addOnsFinalList = addOnsFinalList;
    calculateCharges();
}

function groupOfArray(array, size) {
    var newAddOnsList = [];
    for (var i = 0; i < array.length; i += size) {
        newAddOnsList.push(array.slice(i, i + size));
    }
    return newAddOnsList;
}

function getMembershipDetails() {
    callApi.getUrl(apiUrl + '/api/webapi/getMembershipDetail', {}, function (err, result) {
        if (!err && result) {
            if (result.data && result.data.length > 0 && result.data[0] && result.data[0].membership && result.data[0].membership.price) {
                membershipDetails = result.data[0].membership;
                $(".membership-price").html(result.data[0].membership.price);
                localStorage.setItem("planCharge", result.data[0].membership.price);
            } else {
                showMessageToUser("Sorry, We are not able to get the membership data right now, please try again late!")
            }
        } else {
            var err = JSON.parse(err)
            showMessageToUser(err.message)
        }
    });
}

function getLastSpecificDetails() {
    if (check_boooking_data.imageData && check_boooking_data.imageData.length > 0) {
        for (var x in check_boooking_data.imageData) {
            if (check_boooking_data.imageData[x].dataURl) {
                var blob = dataURItoBlob(check_boooking_data.imageData[x].dataURl, check_boooking_data.imageData[x].type);
                var imageFile = new File([blob], check_boooking_data.imageData[x].name, { type: check_boooking_data.imageData[x].type });
                updateDisplayImg([imageFile]);
            }
        }

    }
    if (bookingData && bookingData.problemDetails) {
        $(".leave-instruction").val(bookingData.problemDetails);
        bookingData.problemDetails = $(".leave-instruction").val();
        $(".instructions-text").html(bookingData.problemDetails)
    }
}

function dataURItoBlob(dataURI, dataTYPE) {
    var binary = atob(dataURI.split(',')[1]), array = [];
    for (var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
    return new Blob([new Uint8Array(array)], { type: dataTYPE });
}

function moveToScreen(screen) {
    switch (screen) {
        case 'screen3':
            getSpecificDetailsScreen();
            break;
        case 'add-ons':
            $(".screens").addClass('hidden');
            if (bookingData && !bookingData.addOnAnswerList && bookingData.addOnAnswerList.length <= 0) {
                getAddOnData();
            }
            $(".add-ons, .backBtnDiv, .add-ons-confirmation").removeClass('hidden');
            $(".btn1_2").attr('onclick', 'fetchDataFromAddOns()');
            break;
        case 'screen4':
            getSlotScreen();
            break;
        case 'screen5':
            displayAddressModal();
            break;
        case 'screen6':
            getReviewScreendata();
            break;
        default:
            break;
    }
}

function getMandatory() {
    $(".isOptional").html("(Mandatory)");
    $(".isOptional, .img-text").css("color", "#ED8686");
    $(".mandatory-text").html("<b>NOTE:</b> " + isMandatoryAttachmentText);
}
function getSpecificDetailsScreen() {
    $(".screens").addClass('hidden');
    if (isMandatoryAttachment) {
        getMandatory()
    }
    $(".screen3, .backBtnDiv").removeClass('hidden');
    $(".btn1_2").attr('onclick', 'fetchDataFromAddSpecificDetails()');
    bookingData.screenName = "screen3";
}

function getSlotScreen() {
    if ($(".select-slot li.selected-slots .slot-img").text() == "") {
        getSlots();
    }
    $(".screens").addClass('hidden');
    $(".date-timeshow, .offers-menu-box").removeClass("hidden");
    $(".membership-save-button").css("bottom", "20px")
    $('.progressbar-dots').removeClass('active');
    $('.progressbar-dots:nth-child(1)').addClass('tick');
    $('.progressbar-dots:nth-child(2)').addClass('active');
    $(".screen4, .backBtnDiv").removeClass('hidden');
    $(".btn1_2").attr('onclick', 'fetchTimeAndSlot()');
    bookingData.screenName = "screen4";
}

function getAddOnData() {
    if (!stepOneCheck) {
        myAddOnList = [];
        addOnsList.forEach(x => {
            if (x[0] && !x[0].is_deleted) {
                myAddOnList.push(x[0])
            }
        });
        $(".addOns-text").html("Minimum order to be AED " + $("#autoWidth li.selected-category").data("minimumaddoncharge"));
        if (myAddOnList && myAddOnList.length > 4) {
            var addOnListSwiper = groupOfArray(myAddOnList, 4);
            $("#add-ons-list").html(Mustache.render(ADD_ONS_TEMPLATE1, { "data": addOnListSwiper }));
        } else {
            $("#add-ons-list").html(Mustache.render(ADD_ONS_TEMPLATE, { "data": myAddOnList }));
            $("#add-ons-list-next, #add-ons-list-prev").addClass("hidden");
        }
    }
    if (myAddOnList && myAddOnList.length > 4) {
        $("#add-ons-list-next, #add-ons-list-prev").removeClass("hidden");
        var addOns_swiper = new Swiper('#addOns-swiper', {
            slidesPerView: 1,
            spaceBetween: 25,
            observer: true,
            observeParents: true,
            loop: false,
            mode: 'horizontal',
            centeredSlides: true,
            speed: 1000,
            navigation: {
                nextEl: '#add-ons-list-next',
                prevEl: '#add-ons-list-prev',
            },
        });
    }
}

function getReviewScreendata() {
    $(".address-edit").show();
    // $("#address_given").modal("hide");
    $(".book-continue-btn").show();

    $(".btn1_2").attr('onclick', 'checkRequiredFieldsForAppointment()');

    $('.progressbar-dots').removeClass('active');
    $('.progressbar-dots:nth-child(1)').addClass('tick');
    $('.progressbar-dots:nth-child(2)').addClass('tick');
    $('.progressbar-dots:nth-child(3)').addClass('tick');
    $('.progressbar-dots:nth-child(4)').addClass('active');

    $(".screens , .hideScreen6").addClass('hidden');
    $(".screen6, .backBtnDiv").removeClass('hidden');
    bookingData.screenName = "screen6";
    $(".bookSummaryModal, .priceTotal").attr("data-target", "");
    //alert('pixel initiate checkout');
    fbq('track', 'InitiateCheckout');
    ga('send', 'event', 'Location', 'Click', 'booking screen', "0");
    $(".totalBooking, .offers-menu-box").addClass('hidden');
    $(".membership-save-button").css("bottom", "-5px")
    $(".bookSummaryRightBox").addClass('height-unset');
    $(".confirmationBookingLeftTopBox").removeClass('hidden');
    $(".specificDetail_instruction").removeClass('hidden');
    // $('.summaryMultiImage').css('padding', '0 15px')
    // $(".titleSpecific").removeClass('hidden');
    $(".btn1_2").text("Confirm");
    $(".btn1_2").css("font-size", "15px");
    // if (window.innerWidth < 768) {
    //     $(".btn1_2").text("Confirm");
    // }
}

function uppercase(str) {
    str = str.split("-").join(" ");
    var array1 = str.split(' ');
    var newarray1 = [];

    for (var x = 0; x < array1.length; x++) {
        newarray1.push(array1[x].charAt(0).toUpperCase() + array1[x].slice(1));
    }
    return newarray1.join(' ');
}


var CAT_SUBCAT_TEMPLATE = '<div class="container-fluid selected-category-section-header selected-category-section">\n' +
    '    <div class="container webapp-container">\n' +
    '        <div class="row section-category-height vcenter">\n' +
    '            <div class="col-md-6 col-sm-12 col-xs-12">\n' +
    '                <div class="row">\n' +
    '                    <ul class="nav nav-pills categoryButtons">\n' +
    '                        {{#data}}<li class="{{active}}"><a data-toggle="pill" href="#{{category}}" class="btn dailyPillCategory {{category}}" onclick="gtagFunctionForSuperCategory(\'{{categoryName}}\')">{{categoryName}}</a></li>{{/data}}\n' +
    '                    </ul>\n' +
    '                        <ul class="hidden-md hidden-lg">\n' +
    '                            <li>\n' +
    '                            <span class="login-signup name-id4 hidden" id="name-id4">\n' +
    '                                <div class="modal-cursor dropdown-toggle pointer" style="z-index:1000;" data-toggle="dropdown" aria-expanded="false"></div>\n' +
    '                                <span class="login">\n' +
    '                                    <span class="modal-cursor" data-toggle="modal" data-target="#loginModal"><img src="/img/login-icon.svg" class="userImgNoLogin"></span>\n' +
    '                                </span>\n' +
    '                               </span>\n' +
    '                            </li>\n' +
    '                        <li id="login-mob" class=" login-mob hidden" >\n' +
    '                            <span class="login-signup" style=" display: -webkit-inline-box;" >\n' +
    '                                <img src="/img/login-icon.svg" class=""><div class="modal-cursor dropdown-toggle pointer " id="login-after" data-toggle="dropdown" aria-expanded="false" style="z-index:1000;" ><img src="/img/arrow-down.png" class=" dropdown-toggle-mob arrow-mob-login  login-after-arrow menu-icon-md" style="z-index:1001;"></div>\n' +
    '                                <span class="login hidden" id="name-id1" style="z-index:1000;"><span class="modal-cursor" data-toggle="modal" data-target="#loginModal">login | </span>' +
    '                                   <span class="login modal-cursor" data-toggle="modal" data-target="#signup">signup </span></span>' +
    '                                      <ul class="dropdown-menu account-menu pull-right" style="z-index:1000;">' +
    '                        </ul>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="col-md-5 col-sm-11 col-xs-11">\n' +
    '                <div class="row">\n' +
    '                    <div class="category-search-box booking-search-icon">\n' +
    '                        <select class="select-city-booking select-control">\n' +
    '                        </select>\n' +
    '                        <input type="text" placeholder="Search for an issue or service" autocomplete="off" id="search-category">\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="col-md-1 col-sm-1 col-xs-1 column">\n' +
    '                <div class="row">\n' +
    '                    <ul class="category-login-signup">\n' +
    '                       <li class="login-img-candidate">\n' +
    '                           <span class="login-signup cat-login" style="z-index:1111;">\n' +
    '                           <img src="/img/login-icon.svg" class="login-icon-bookingPage hidden dropdown-toggle pointer" data-toggle="dropdown">\n' +
    '                            <span class="login class-login" id="name-id3" onclick="loginModal()" data-toggle="modal" data-target="#loginModal"><span class="modal-cursor modal-login-button-login">\n' +
    '                               <img src="/img/login-icon.svg">\n' +
    '                                <span class="modal-cursor modal-login-button-login hidden-sm hidden-xs hidden">\n' +
    '                                     login  \n' +
    '                                </span>\n' +
    '                                <span class="modal-cursor hidden-sm hidden-xs hidden"> | signup </span>\n' +
    '                            </span> </span>\n' +
    '                           <span class="name-class2 modal-cursor dropdown-toggle pointer hidden-xs hidden-sm" data-toggle="dropdown" style="z-index:1000;color:#253136;font-family:poppinsMedium;font-size:14px;margin-left: 5px;margin-top: 0px;"></span>\n' +
    '                            <span id="arrow-img" class="cat-arrow arrow-img hidden dropdown-toggle pointer" data-toggle="dropdown"><img src="/img/arrow-down.png" class=" dropdown-toggle-mob arrow-mob-login  login-after-arrow menu-icon-md"></span>                   \n' +
    '                            <ul class="dropdown-menu account-menu pull-right">                    \n' +
    '                               </ul>\n' +
    '                           </span>\n' +
    '                       </li>\n' +
    '                       </ul>\n' +
    '                    <div id="city-href"  onclick="location.href=\'/\'">\n' +
    '                        <img id="close-screen" src="/app/images/close-screen.svg" class="img-responsive close-screen">\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="container-fluid">\n' +
    '    <div class="row">\n' +
    '        <div class="tab-content categoryTab">\n' +
    '            {{#data}}<div id="{{category}}" class="tab-pane fade {{in}} {{active}}">\n' +
    '                <ul class="nav">\n' +
    '                    {{#categoryIds}}<li class="nav-item categorytablinks {{active_active}}">\n' +
    '                        <a class="nav-link {{active_active}} {{#isSpecialised}}back-cream{{/isSpecialised}}" data-toggle="tab" href="#{{_id}}_{{category}}" role="tab" id="cat{{_id}}" onclick="gtagFunctionCategory(\'{{name}}\')">' +
    '                           <img class="img-responsive" src="{{imageURL.original}}" alt="{{name}}">{{name}}</a>\n' +
    '                    </li>{{/categoryIds}}\n' +
    '                </ul>\n' +
    '                <div class="tab-content tab-content-subcategoryContent categoryTabcontent">\n' +
    '                    {{#categoryIds}}<div id="{{_id}}_{{category}}" class="tab-pane fade {{#subcategories}} {{in_in}} {{active_active}} {{/subcategories}} dailyFirst">\n' +
    '                        <h3 class="categoryTitle {{#isSpecialised}}yellow-color{{/isSpecialised}}">{{name}}</h3>\n' +
    '                        <div class="subCategories">\n' +
    '                            {{#subcategories}}<a href="#" class="subcat" onclick="goForBooking(\'{{name}}\',\'{{subCategoryName}}\')">\n' +
    // '                                {{#image}}<img src="{{image}}" alt="{{subCategoryName}}" class="subCatImg">{{/image}}{{^image}}<img src="/app/images/subCat_dummy.png" alt="{{subCategoryName}}" class="subCatImg">{{/image}}\n' +
    '                                <div class="my-subcat" {{#image}}data-background="{{image}}" style="background-image: url({{image}});" {{/image}} {{^image}} data-background="/app/images/subCat_dummy.png" style="background-image: url(\'/app/images/subCat_dummy.png\');" {{/image}}> </div>\n' +
    '                                <p class="name">{{subCategoryName}}</p>\n' +
    '                            </a>{{/subcategories}}\n' +
    '                        </div>\n' +
    '                        <div class="categoryHelpContent hidden-md hidden-lg" data-dismiss="modal" data-toggle="modal"\n' +
    '                             data-target="#helpModal">\n' +
    '                            <span class="c_brand"><img class="img-responsive" src="/app/images/service-info.png"> FAQ</span>\n' +
    '                        </div>\n' +
    '                    </div>{{/categoryIds}}\n' +
    '                </div>\n' +
    '            </div>{{/data}}\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>';

var infoModal_Template =
    '   <div class="modal-dialog ">' +
    '        <div class="modal-content">' +
    '            <div class="modal-body p-l-0 p-r-0">' +
    '               <div class="row">' +
    '                    <div class="col-md-12 col-sm-12 col-xs-12 column p-0">' +
    '                       <div class="col-md-12">' +
    '                            <div class="flex-box modal-title-row m-t-0">' +
    '                                <a href="#" class="backarrow"><img src="/img/modal-back-icon.svg" data-dismiss="modal" alt="back" class=""></a>' +
    '                                <div class="modal-title m-t-0 p-l-15 hidden">Why <span class="selected-subcategory-title f-regular">{{subCategoryName}}</span> Services <span>?</span></div>' +
    '                                <div class="modal-title m-t-0 p-l-15 text-capitalize bold">Why HomeGenie ?</div>' +
    '                            </div>' +
    '                            <div class="border-70-02-m-5"></div>' +
    '                        </div>' +
    '                        <div class="col-md-12 flex-box cat-selected">' +
    '                            <div class="icon-box screen1 m-r-5">' +
    '                               {{#categoryRating}}{{#imageURL}}<img src="{{original}}" class="img-responsive category-icon">{{/imageURL}}{{/categoryRating}}' +
    '                               {{^categoryRating}}{{^imageURL}}<img src="https://iesoft.nyc3.cdn.digitaloceanspaces.com/homegenie/original_0Cu2xHf571f8fef784f3f9e7f2779c3.png" class="img-responsive category-icon">{{/imageURL}}{{/categoryRating}}' +
    '                            </div>' +
    '                            <span class=" f-medium name"><span class="selected-subcategory-title">{{subCategoryName}}</span></span>' +
    '                        </div>' +
    '                       {{#content}}{{#content}}{{#mainBulletPoints}}{{#htmlContent}} <div class="col-md-12 indexModal-subText">' +
    '                               {{{.}}} ' +
    '                        </div>{{/htmlContent}}{{/mainBulletPoints}}{{/content}}{{/content}} ' +
    '                       {{#content}}{{#content}}{{^mainBulletPoints}}{{^htmlContent}} <div class="col-md-12 indexModal-subText">' +
    '                            <ul class="sub-text">' +
    '                                <li>Instant anytime booking</li>' +
    '                                <li>Accident damage protection</li>' +
    '                                <li>Service warranty cover</li>' +
    '                                <li>Fully verified experts</li>' +
    '                                <li>Unbeatable upfront prices</li>' +
    '                            </ul>' +
    '                        </div>{{/htmlContent}}{{/mainBulletPoints}}{{/content}}{{/content}} ' +
    '                       {{#content}}{{#content}}{{#mainBulletPoints}}{{^htmlContent}} <div class="col-md-12 indexModal-subText">' +
    '                            <ul class="sub-text">' +
    '                                <li>Instant anytime booking</li>' +
    '                                <li>Accident damage protection</li>' +
    '                                <li>Service warranty cover</li>' +
    '                                <li>Fully verified experts</li>' +
    '                                <li>Unbeatable upfront prices</li>' +
    '                            </ul>' +
    '                        </div>{{/htmlContent}}{{/mainBulletPoints}}{{/content}}{{/content}} ' +
    '                        <div class="col-md-12 indexModal-rating bg_brand text-white">' +
    '                            <div class="row first-rating-section mp-0">' +
    '                                <div class="col-md-6 col-xs-12 p-0">' +
    '                                    <div class="rating-section">' +
    '                                        <div class="live-icon">' +
    '                                            <img class="img-responsive" src="/img/live.svg" alt="LIVE ICON" >' +
    '                                       </div>' +
    '                                        <p class="bold-title-first-box">SERVICE RATING</p>' +
    '                                        <div class="first-box-flex flex-box">' +
    '                                            <div class="first-grid-box">' +
    '                                                <div class="first-box-flex2 flex-box">' +
    '                                                    <div class="star-icon">' +
    '                                                        <img class="img-responsive" src="/img/star-white.png" alt="STAR ICON">' +
    '                                                    </div>' +
    '                                                   {{#categoryRating}}{{#averageRating}} <p id="service-rating" class="number-rating"> {{categoryRating.averageRating}}/5</p>{{/averageRating}}{{/categoryRating}}' +
    '                                                   {{#categoryRating}}{{^averageRating}} <p id="service-rating" class="number-rating"> 4.3/5</p>{{/averageRating}}{{/categoryRating}}' +
    '                                                </div>' +
    '                                               {{#categoryRating}}{{#averageRating}} <p id="total-rating">Based on {{categoryRating.totalCount}} Ratings</p>{{/averageRating}}{{/categoryRating}}' +
    '                                               {{#categoryRating}}{{^averageRating}} <p id="total-rating">Based on 2589 Ratings</p>{{/averageRating}}{{/categoryRating}}' +
    '                                            </div>' +
    '                                            <div class="first-grid-box">' +
    '                                                 {{#categoryRating}}{{#lastYearData}}<p id="booking-number" class="number-rating">{{lastYearData}}</p>{{/lastYearData}}' +
    '                                                     {{^lastYearData}}<p id="booking-number" class="number-rating">450</p>{{/lastYearData}} {{/categoryRating}}' +
    '                                                <p>Booking last year</p>' +
    '                                            </div>' +
    '                                        </div>' +
    '                                    </div>' +
    '                                </div>' +
    '                                {{#categoryRating}}{{#averageRating}}<div class="col-md-6 col-xs-12 xs-padding0 p-0 customer-feedback">' +
    '                                    <div class="w-100 p-0 title text-left text-white">CUSTOMER FEEDBACK</div>' +
    '                                    <div id="rating-slider" class="swiper-container review-slide-container height-fit rating-slider">' +
    '                                        <div class="swiper-wrapper"> ' +
    '                                           {{#customerRating}} <div class="swiper-slide rating-slider-box">' +
    '                                                <div class="mh-auto">' +
    '                                                    <p class="rating-slider-review">“{{customerFeedback}}“</p>' +
    '                                                    <p class="rating-slider-review-by"><span' +
    '                                                            class="name">{{customerName}}</span></p>' +
    '                                                    <p class="rating-slider-review-by"><span class="community">{{community}}</span>, <span class="city">{{city}}</span>, <span class="customerRatingDate"> {{customerRatingDate}}</span></p>' +
    '                                                </div>' +
    '                                            </div>{{/customerRating}} ' +
    '                                        </div>' +
    '                                        <div id="rating-slider-next" class="swiper-button-next"></div>' +
    '                                        <div id="rating-slider-prev" class="swiper-button-prev"></div>' +
    '                                    </div>' +
    '                                </div>{{/averageRating}}{{/categoryRating}}' +
    '                            </div>' +
    '                        </div>' +
    '                        <div class="col-md-12 col-sm-12 col-xs-12">' +
    '                            <div class="row warranty-safety">' +
    '                                <div class="col-md-3 col-sm-3 col-xs-3">' +
    '                                    <div class="row"><img src="/img/warranty.svg" class="img-responsive"></div>' +
    '                                </div>' +
    '                                <div class="col-md-9 col-sm-9 col-xs-9 warranty-safety-text">' +
    '                                    <div class="warranty-title bold">HomeGenie Happiness Warranty</div>' +
    // '                                    <div id="warranty-title">{{content.mainTitle}}</div>' +
    '                                    <div class="text">As provided in the bill estimate.</div>' +
    '                                    <span class="text">For more details, visit</span>' +
    '                                    <a href="/warranty" class="c_brand text display-block" target="_blank">HomeGenie Warranty Policy</a>' +
    '                                        <div class="text"><span>To know more about our COVID19 precautions, please visit, </span><a href="https://www.homegenie.com/en/covid-19-precautions" class="c_brand text hidden-md hidden-lg hidden-sm" target="_blank">covid-19-precautions.</a><a href="https://www.homegenie.com/en/covid-19-precautions" class="c_brand text hidden-xs" target="_blank">https://www.homegenie.com/en/covid-19-precautions</a></div>' +
    '                                </div>    ' +
    '                            </div>' +
    '                        </div>' +
    '                    </div>' +
    '                 </div>' +
    '               </div>' +
    '             </div>' +
    '       </div>';

var infoModal_Template_NODATA =
    '    <div class="modal-dialog ">' +
    '        <div class=" modal-content col-md-12 col-xs-11 modal-data service-type">' +
    '            <div class="back-button back-btn-abs hidden" data-dismiss="modal">' +
    '                <div class="back-arrow"><img src="/img/modal-back-icon.svg" class="img-responsive"></div>' +
    '                <p class="hidden"> Back</p>' +
    '            </div>' +
    '            <div class="col-md-12 col-xs-12 service-description survey-based-m">' +
    '                <p class="title text-center">Additional Info</p>' +
    '                <div class="service-details-list hidden-xs">' +
    '                    <p class="mp-0">No more informaton</p>' +
    '                </div>' +
    '            </div>' +
    '            <div class="col-md-12 col-xs-12">' +
    '                <button class="modal-button mtop-20" data-dismiss="modal">Continue</button>' +
    '            </div>' +
    '        </div>' +
    '    </div>';


var UPLOADED_IMG_TEMPLATE = '{{#data}}<div class="img-load-textt col-md-12 col-xs-12"> ' +
    "<div class=\"col-md-3 col-xs-4 image-load\"><img id=\"img-output\" class=\"img-responsive w-100\" src=\"{{result}}\" alt=\"{{name}}\"/></div>" +
    '<div class="col-md-6 col-xs-8 image-load-text grid">' +
    "<span class=\"image-file-name\">{{name}}</span>" +
    "<span class=\"image-size\">Size: <span class=\"image-sizes\">{{size}}</span> </span>" +
    '</div>' +
    "<div class=\"col-md-3 col-xs-12 remove-button\" onclick=\"removeImage({{index}})\" data-index=\"{{index}}\"><i class=\"fa fa-times-circle-o\" aria-hidden=\"true\"></i> Remove</div>" +
    '</div>{{/data}}'

var INFO_CLICK_DATA = '<div class="first-grid-box">' +
    '                                                <div class="info-click-head">' +

    '                                                   {{#categoryRating}}{{#averageRating}} <p id="service-rating" class="number-rating"> {{categoryRating.averageRating}}</p>{{/averageRating}}{{/categoryRating}}' +
    '                                                   {{#categoryRating}}{{^averageRating}} <p id="service-rating" class="number-rating"> 4.3 </p>{{/averageRating}}{{/categoryRating}}' +
    '                                                    <div class="star-icon">' +
    '                                                        <img class="img-responsive" src="/img/star-fill.png" alt="STAR ICON" style="margin-left:2px;">' +
    '                                                    </div>' +
    '                                                </div>' +
    '                                               <div class="white-box">{{#categoryRating}}{{#averageRating}} <p id="total-rating">{{categoryRating.totalCount}}<br/> reviews</p>{{/averageRating}}{{/categoryRating}}' +
    '                                               {{#categoryRating}}{{^averageRating}} <p id="total-rating">589<br/> reviews</p>{{/averageRating}}{{/categoryRating}}</div>' +
    '                                            </div>'

var OFFER_TEMPLATE = '{{#data}}{{#status}}<div class="col-md-12 col-sm-12 col-xs-12 myOffer mp-0">\
                        <div class="col-md-9 col-sm-9 col-xs-9 mp-0">\
                            <div class="col-md-12 col-sm-12 col-xs-12 mp-0">\
                                <span class="myOffer-title">{{promo.description}}</span>\
                            </div>\
                            <div class="col-md-12 col-sm-12 col-xs-12 mp-0">\
                                <span class="myOffer-subTitle">{{name}}</span>\
                            </div>\
                            <div class="col-md-12 col-sm-12 col-xs-12 mp-0 pt-5">\
                                {{#promo.onlyCard}}{{/promo.onlyCard}}{{^promo.onlyCard}}<span class="myOffer-code {{promo.name}}-1-1">{{promo.name}}</span>{{/promo.onlyCard}}\
                                {{#specialTnc}}<span class="myOffer-tnc {{promo.name}}-1-2" onclick="openOffersTnc(\'{{promo.name}}-1\')">+Terms & conditions</span>{{/specialTnc}}\
                            </div>\
                            <div class="col-md-12 col-sm-12 col-xs-12 offers-tnc mp-0 {{promo.name}}-1 hidden">\
                                <div class="col-md-12 col-sm-12 col-xs-12 mp-0 offers-tnc-text">{{{specialTnc}}}</div>\
                            </div>\
                        </div>\
                        {{#promo.onlyCard}}{{/promo.onlyCard}}{{^promo.onlyCard}}<div class="col-md-3 col-sm-3 col-xs-3 text-center">\
                            <button class="hidden remove {{promo.name}}-remove" onclick="removeOffers(\'{{promo.name}}-remove\',\'{{promo.name}}-apply\')">REMOVE</button>\
                            <button class="apply {{promo.name}}-apply" onclick="applyOffers(\'{{promo.name}}-apply\',\'{{promo.name}}-remove\',\'{{promo.name}}\',\'{{promo.name}}-1-1\',\'{{promo.name}}-1-2\')">APPLY</button>\
                        </div>{{/promo.onlyCard}}\
                    </div>{{/status}}{{^status}}{{/status}}{{/data}}'

var ADD_ONS_TEMPLATE = '{{#data}}{{#is_deleted}}{{/is_deleted}}{{^is_deleted}}<div class="col-md-6 col-sm-6 col-xs-12 add-on-item">\
                            <div class="add-on-img">{{#isPopular}}<div class="most-popular">MOST POPULAR</div>{{/isPopular}}{{#image}}<img class="img-responsive" src="{{image}}"/>{{/image}}</div>\
                            <div class="add-on-details">\
                                <div class="add-on-title"><span class="add-on-desc">{{question}}</span><span class="add-on-info" onclick="showAddOnsInfo(\'{{question}}\',\'{{info}}\')"><img class="img-responsive" src="/app/images/service-info.png"/></span></div>\
                                {{#questionDescription}}<div class="add-on-subtitle">{{questionDescription}}</div>{{/questionDescription}}\
                                {{#isAdditionalCharges}}<div class="add-on-price">AED {{additionalCharges}}</div>{{/isAdditionalCharges}}\
                                <div class="add-on-value"><button class="active-button no-active-button" onclick="decreaseAddOns(\'{{_id}}\')">-</button><button class="input input-add-on input-add-on-{{_id}}" disabled="" data-ans-id="" data-additionalcharges="">0</button><button class="active-button float-right" onclick="increaseAddOns(\'{{_id}}\')">+</button></div>\
                            </div>\
                        </div>{{/is_deleted}}{{/data}}'

var ADD_ONS_PAYMENT_SUMMARY = '{{#data}}<p class="add-on-p"><span class="service-charges-membership ques-title subtitle opacity_05">{{value}} x {{title}}</span><span class="pull-right otherCharge">{{price}}</span></p>{{/data}}'

var ADD_ONS_BOOKING_SUMMARY = '{{#data}}<div class="row"><div class="col-md-8 col-sm-8 col-xs-8 column pright0"><p class="ques-title  opacity_05">{{title}}</p></div>\
                                <div class="col-md-4 col-sm-4 col-xs-4column "><p class="selected-answer"><span class="add-on-unit">{{value}}</span></p></div></div>{{/data}}'

var ADD_ONS_TEMPLATE1 = '<div id="addOns-swiper" class="swiper-container">\
                            <div class="swiper-wrapper addOns-wrapper">\
                            {{#data}}\
                                <div class="swiper-slide addOns-slide">\
                                {{#.}}{{#is_deleted}}{{/is_deleted}}{{^is_deleted}}<div class="add-on-item col-md-6 col-sm-6 col-xs-12">\
                                    <div class="add-on-img">{{#isPopular}}<div class="most-popular">MOST POPULAR</div>{{/isPopular}}{{#image}}<img class="img-responsive" src="{{image}}"/>{{/image}}</div>\
                                    <div class="add-on-details">\
                                        <div class="add-on-title"><span class="add-on-desc">{{question}}</span><span class="add-on-info" onclick="showAddOnsInfo(\'{{question}}\',\'{{info}}\')"><img class="img-responsive" src="/app/images/service-info.png"/></span></div>\
                                        {{#questionDescription}}<div class="add-on-subtitle">{{questionDescription}}</div>{{/questionDescription}}\
                                        {{#isAdditionalCharges}}<div class="add-on-price">AED {{additionalCharges}}</div>{{/isAdditionalCharges}}\
                                        <div class="add-on-value"><button class="active-button no-active-button" onclick="decreaseAddOns(\'{{_id}}\')">-</button><button class="input input-add-on input-add-on-{{_id}}" disabled="" data-ans-id="" data-additionalcharges="">0</button><button class="active-button float-right" onclick="increaseAddOns(\'{{_id}}\')">+</button></div>\
                                    </div>\
                                </div>{{/is_deleted}}{{/.}}\
                                </div>\
                            {{/data}}\
                            </div>\
                        </div>'