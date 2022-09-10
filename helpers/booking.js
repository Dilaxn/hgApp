const { INSPECTION, FIXED, EMERGENCY, SURVEY } = require("../constants/booking");
const { getServiceType } = require("./common");


const TYPE_DESCRIPTIVE = 'DESCRIPTIVE';
const TYPE_BOOLEAN = 'BOOLEAN';
const TYPE_WHOLE = 'WHOLE';

const DESCRIPTIVE_INDEX = 0;
const WHOLE_INDEX = 1;
const BOOLEAN_INDEX = 2;



export function calculateCharges(category, bookingForm, state, promoData = null) {

    const mainServiceType = getServiceType(category);
    const getQuestion = (type) => category.questions.find(item => item.type === type);

    const { wholeAnswer, booleanAnswer, selectedSlot, isVilla } = state;


    const descriptiveQuestion = getQuestion(TYPE_DESCRIPTIVE);
    const booleanQuestion = getQuestion(TYPE_BOOLEAN);
    const wholeQuestion = getQuestion(TYPE_WHOLE);

    const hasDescriptiveCharges = descriptiveQuestion.isAdditionalCharges;
    const hasBoolenCharges = booleanQuestion.isAdditionalCharges;
    const hasWholeCharges = wholeQuestion.isAdditionalCharges;

    const booleanExtraCharges = booleanQuestion.additionalCharges;
    const wholeExtraCharges = wholeQuestion.additionalCharges;

    let wholeUnits = 1;
    if (wholeAnswer !== null) {
        wholeUnits = parseInt(wholeAnswer.value);
    }

    let isBooleanYes = false;

    if (booleanAnswer !== null) {
        isBooleanYes = booleanAnswer.answer === 'YES';
    }

    const descriptive = bookingForm.answerIDS[0];


    let baseCharge = 0,
        promoBaseCharge = 0,
        baseChargeWithoutDiscount = 0,
        discountCharges = 0,
        totalCharges = 0;


    let {
        peakHourCharges,
        offPeakHourCharges,
        peakHourChargesInPercent,
        peakHourChargesInAmount,
        emergencyBookingAllowed,
        emergencyCharges,
        emergencyChargesInAmount,
        emergencyChargesInPercent,
        isPeakHourAllowed,
        fridayCharges,
        discountFactor,
        discountFactorInAmount,
        discountFactorInPercent,
        callOutCharges,
        unitCharges,
        villaCharges,
    } = category;




    // var inspectionCharge = $("#autoWidth li.selected-category").data("calloutcharges");
    let inspectionCharge = callOutCharges;
    let bookingPeakHourCharges = 0;
    let promoDisocuntPercentage = 0;
    let inspectionTotalCharges;
    let totalWithoutPrmo;
    let totalChargeVat;
    let vatCharge;


    let { firstUnitCharges, restUnitCharges } = unitCharges;
    const villaExtraCharges = villaCharges.inAmount;

    //console.log('unitChargess', unitCharges);

    // Base charge Calculation
    baseCharge = 0;
    if (mainServiceType !== SURVEY) {
        baseCharge = mainServiceType === INSPECTION ? callOutCharges : firstUnitCharges;
    }
    //console.log(`Type`, mainServiceType, baseCharge);

    //console.log('fewCharges', hasWholeCharges, wholeUnits, restUnitCharges)
    if (hasWholeCharges || wholeUnits) {
        const charge = mainServiceType === INSPECTION ? wholeExtraCharges : restUnitCharges;
        baseCharge += (wholeUnits - 1) * charge;
    }



    // console.log('firstUnitChargess', firstUnitCharges);
    // console.log('restUnitCharges', restUnitCharges);
    if (hasBoolenCharges && isBooleanYes) {
        baseCharge += wholeUnits * booleanExtraCharges;
    }


    if (isVilla && villaExtraCharges) {
        baseCharge += villaExtraCharges;
    }


    // Emergency && PeakHour calculation
    if (selectedSlot !== null) {

        bookingPeakHourCharges = 0;
        if (selectedSlot.subType !== 'normal') {
            bookingPeakHourCharges = selectedSlot.isPeak ? peakHourCharges : -offPeakHourCharges;
            if (peakHourChargesInPercent) {
                bookingPeakHourCharges = (baseCharge * bookingPeakHourCharges) / 100;
            }
        }
        // console.log('Hello', selectedSlot, emergencyCharges);
        if (emergencyBookingAllowed && selectedSlot.type === EMERGENCY) {
            if (emergencyChargesInPercent) {
                emergencyCharges = (baseCharge * emergencyCharges) / 100;
            }
        } else {
            emergencyCharges = 0;
        }
    } else {
        emergencyCharges = 0;
    }

    // if (discountFactor) {
    //     const maxUnits = Math.max(...(wholeQuestion.answers.map(item => parseInt(item.answer))));
    //     discountCharges = (wholeUnits / maxUnits) * baseCharge * (discountFactor / 100);
    // }

    // promoBaseCharge = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakHourCharges)) - parseFloat(discountCharges);
    // baseChargeWithoutDiscount = baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakHourCharges);


    if (discountFactor) {
        const maxUnits = Math.max(...(wholeQuestion.answers.map(item => parseInt(item.answer))));
        discountCharges = (wholeUnits / maxUnits) * baseCharge * (discountFactor / 100);
    }

    promoBaseCharge = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakHourCharges)) - parseFloat(discountCharges);
    baseChargeWithoutDiscount = baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakHourCharges);
    // if (discountFactor) {
    //     var wholeAns = [];
    //     if (QUES.WHOLE && QUES.WHOLE.answers) {
    //         for (let idx in QUES.WHOLE.answers) {
    //             wholeAns.push(Number(parseFloat(QUES.WHOLE.answers[idx].answer).toFixed(2)));
    //         }
    //         wholeAns.sort(function (a, b) {
    //             return a - b
    //         });
    //         discountCharges = (wholeQuesUnit / wholeAns[wholeAns.length - 1]) * baseCharge * (discountFactor / 100);
    //         discountCharges = Number(discountCharges.toFixed(2));
    //     }
    // }

    // promoBaseCharge = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakCharges)) - parseFloat(discountCharges);
    // baseChargeWithoutDiscount = baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakCharges);


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
        //console.log('DISCOUNT', discountCharges)
    }

    // Calculating total charges.
    if (mainServiceType == INSPECTION) {
        inspectionTotalCharges = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakHourCharges)) - parseFloat(discountCharges);
        discountCharges = discountCharges.toFixed(2);
        totalWithoutPrmo = inspectionTotalCharges + promoDisocuntPercentage;
        baseCharge = Number(Number(baseCharge).toFixed(2));
        inspectionTotalCharges = Number(Number(inspectionTotalCharges).toFixed(2));
        totalWithoutPrmo = Number(Number(totalWithoutPrmo).toFixed(2));
        // const emergencyChargesDetail = parseFloat(emergencyCharges)?.toFixed(2);

        return {
            totalWithoutPrmo,
            baseCharge,
            discountCharges,
            emergencyCharges,
            finalEstimate: inspectionTotalCharges,
        };
    } else if (mainServiceType == FIXED) {
        inspectionCharge = firstUnitCharges;
        discountCharges = discountCharges.toFixed(2);
        totalCharges = (baseCharge + parseFloat(emergencyCharges) + parseFloat(bookingPeakHourCharges)) - parseFloat(discountCharges);
        totalChargeVat = totalCharges * (1.05);
        totalWithoutPrmo = totalCharges + promoDisocuntPercentage;
        totalWithoutPrmo = totalWithoutPrmo * (1.05);
        vatCharge = Number(Number(totalCharges * 0.05).toFixed(2));
        totalCharges = Number(Number(totalCharges).toFixed(2));
        baseCharge = Number(Number(baseCharge).toFixed(2));
        totalChargeVat = Number(Number(totalChargeVat).toFixed(2));
        totalWithoutPrmo = Number(Number(totalWithoutPrmo).toFixed(2));

        return {
            inspectionCharge,
            discountCharges,
            totalCharges,
            totalChargeVat,
            totalWithoutPrmo,
            totalWithoutPrmo,
            vatCharge,
            totalCharges,
            baseCharge,
            totalWithoutPrmo,
            discountCharges,
            finalEstimate: totalChargeVat,
        };
    } else {
        return {
            finalEstimate: baseCharge
        }
    }

    /*if (mainServiceType == MSG.FIXED) {
        if (baseCharge) {
            $("#service-p, .service-p, .other-parent").show();
            $("#labor-p, .labor-p").hide();
            $("#otherCharge, .otherCharge").html(baseCharge);
        } else {
            $("#labor-p, .labor-p").hide();
            $("#service-p, .service-p, .other-parent").hide();
        }
        $("#excl-VAT, .excl-VAT").text("( excl.VAT )");
        $("#totalcharges, .totalcharges, .estimated-price").html(totalCharges);
        $(".vat-charge").html(vatCharge);
        $(".vat-charges-box").removeClass("hidden");
        $(".totalchargesVat").html(totalChargeVat);
        $("#totalcharges, .totalcharges, .estimated-price").html(totalChargeVat);
        $(".estimated-price").html("<span class='aed'>AED</span> "+totalChargeVat)
        if(totalWithoutPrmo !=totalChargeVat){
            $(".nextStep .priceTotal .priceTotalDiv").css('display',"block");
            $(".estimated-price").html("<span class='line-through color-grey'><span> AED </span>"+totalWithoutPrmo+"</span> <span class='aed'> AED </span><span>"+totalChargeVat+"</span>");
            if (window.innerWidth < 768) {
                $(".offer-hidden").addClass("hidden");
                $(".nextStep .priceTotal .priceTotalDiv").css("width","140px");
                $(".estimated-price").html("<span class='line-through color-grey'><span> AED </span>"+totalWithoutPrmo+"</span><i class='fa fa-angle-down' aria-hidden='true'></i> <span class='aed'> AED </span><span>"+totalChargeVat+"</span>");
            }
        }
        if (pricingNote) {
            if (pricingNote.mainUnitNote && (pricingNote.mainUnitNote).match(/PRICE/g)) {
                inspectionCharge = (pricingNote.mainUnitNote).replace("PRICE", inspectionCharge);
            }
            if (pricingNote.additionalUnitNote && pricingNote.additionalUnitNote !== "null") {
                if ((pricingNote.additionalUnitNote).match(/PRICE/g)) {
                    var additionalCharge = (pricingNote.additionalUnitNote).replace("PRICE", restUnitCharges);
                    inspectionCharge += " "+additionalCharge;
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
    } else if (mainServiceType == MSG.INSPECTION || mainServiceType == MSG.SURVEY) {
        totalCharges = "To be decided";
        if (baseCharge) {
            $("#labor-p, .labor-p").show();
            $("#service-p, .service-p, .other-parent").hide();
            $("#laborCharge, .laborCharge, .estimated-price").html(baseCharge);
        } else {
            $("#labor-p, .labor-p, .other-parent").hide();
            $("#service-p, .service-p").hide();
        }
        if (mainServiceType == MSG.SURVEY) {
            $("#labor-p, .labor-p").show();
            $("#laborCharge, .laborCharge").html(baseCharge);
            $("#labortext, .labortext").html(MSG.LABOR_TEXT);
            $(".estimated-price").html("<span class='aed'>AED</span> 0.00 <br> <span class='color-grey'>Free survey</span>");
            $(".nextStep .priceTotal .priceTotalDiv").css('display',"block");
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
        }
        */
    //     else if (mainServiceType == MSG.INSPECTION) {

    //         $("#totalcharges, .totalcharges, .estimated-price").html(inspectionTotalCharges);
    //         $("#labortext, .labortext").html(MSG.LABOR_TEXT_INSPECTION);
    //         $(".estimated-price").html("<span class='aed'>AED</span> "+totalWithoutPrmo)
    //         if(totalWithoutPrmo !=inspectionTotalCharges){
    //             $(".nextStep .priceTotal .priceTotalDiv").css('display',"block");
    //             $(".estimated-price").html("<span class='line-through color-grey'><span > AED </span>"+totalWithoutPrmo+"</span> <span class='aed'> AED </span><span>"+inspectionTotalCharges+"</span>");
    //             if (window.innerWidth < 768) {
    //                 $(".offer-hidden").addClass("hidden");
    //                 $(".nextStep .priceTotal .priceTotalDiv").css("width","140px")
    //                 $(".estimated-price").html("<span class='line-through color-grey'><span > AED </span>"+totalWithoutPrmo+"</span> <i class='fa fa-angle-down' aria-hidden='true'></i>  <span class='aed'> AED </span><span>"+inspectionTotalCharges+"</span>");
    //             }
    //         }
    //         if (pricingNote) {
    //             if (pricingNote.mainUnitNote && (pricingNote.mainUnitNote).match(/PRICE/g)) {
    //                 inspectionCharge = (pricingNote.mainUnitNote).replace("PRICE", inspectionCharge);
    //             }
    //             if (pricingNote.additionalUnitNote && pricingNote.additionalUnitNote !== "null") {
    //                 inspectionCharge += ". " + pricingNote.additionalUnitNote;
    //             }
    //             if (pricingNote.asteriskNote && pricingNote.asteriskNote !== "null") {
    //                 inspectionCharge += "<br/><br/>" + pricingNote.asteriskNote;
    //             }

    //             $("#pricebased").html(inspectionCharge);
    //         } else {
    //             $("#pricebased").html(inspectionCharge + " AED");
    //         }

    //         $(".ip-base-m").show();
    //         $(".survey-based-m, .fixed-based-m").hide();
    //         $("#pricebased").removeClass("hidden");
    //         $("#pricebasedSurvey, #fixedbased, #emergencycharges, #fridaycharges").addClass("hidden");
    //     }
    //     $("#excl-VAT, .excl-VAT").text("");
    //     $("#totalcharges, .totalcharges").html(totalCharges);
    // }

    // if (emergencyCharges && emergencyBookingAllowed) {
    //     emergencyCharges = Number(Number(emergencyCharges).toFixed(2));
    //     $("#emergencySameday, .emergencySameday").parent().removeClass("hidden");
    //     $(".emergencySamedaybox").removeClass("hidden");
    //     $("#emergencyCharge, .emergencyCharge").html(emergencyCharges);
    //     $(".emergencySamedaybox-friday-box").show();
    //     $("#other-parent, .other-parent").show();
    //     $("#emergencycharges .aed, .emergencycharges .aed").html(emergencyCharges);
    //     $("#fridaycharges, .fridaycharges").addClass("hidden");
    // } else {
    //     $("#emergencySameday, .emergencySameday").parent().addClass("hidden");
    //     $(".emergencySamedaybox").addClass("hidden");
    //     $(".emergencySamedaybox-friday-box").hide();
    //     $("#other-parent, .other-parent").hide();
    // }


    // if (discountCharges) {
    //     discountCharges = Number(Number(discountCharges).toFixed(2));
    //     $("#promo, .promo").parent().show();
    //     $("#promo, .promo").html(discountCharges);
    //     $(".promo-p").show();
    // } else {
    //     $("#promo, .promo").parent().hide();promoData
    //     $(".promo-p").hide();
    // }

    // if(bookingPeakHourCharges !=0){
    //     bookingPeakHourCharges = Number(Number(bookingPeakHourCharges).toFixed(2));
    //     $("#other-parent, .other-parent").show();
    //     $(".slotSameday").parent().removeClass("hidden");
    //     $(".slotCharge").html(bookingPeakHourCharges);
    //     if(bookingPeakHourCharges>0){
    //         $(".slotSameday").html("Peak hour Charges");
    //     }else{
    //         $(".slotSameday").html("Off peak hour Charges");
    //     }
    // } else {
    //     $(".slotSameday").parent().addClass("hidden");
    // }

    // if (promoData) {
    //     if ($('.enterPromo').val() && promoData._id) {
    //         $(".showPromo").html("<span class='opacity_05'>Discount (self* + " + $('.enterPromo').val() + ")</span><span class='blue bpointer' onclick='offersBook()'> + add/edit promo</span>");
    //     } else {
    //         $(".showPromo").html("<span class='opacity_05'>Discount (self*)</span><span class='blue pointer' onclick='offersBook()'> + add/edit promo</span>");
    //     }
    // } else {
    //     $(".showPromo").html("<span class='opacity_05'>Discount (self*)</span><span class='blue pointer ' onclick='offersBook()'> + add/edit promo</span>");
    // }
}

