import moment from "moment";
import { EMERGENCY, FIXED, FIXED_SERVICE, INSPECTION, INSPECTION_SERVICE, SAMEDAY, SCHEDULED, SURVEY, SURVEY_SERVICE } from "../constants/booking";


export const getServiceType = (category) => {

    
    if (category && category.isInspectionRequired) {
        return  category.callOutCharges === 0 ? SURVEY : INSPECTION;
    }

    return FIXED;
}

export const getServiceTypeString = (category) => { 
    const type = getServiceType(category);
    switch(type) {
        case INSPECTION:
            return INSPECTION_SERVICE;
        case SURVEY:
            return SURVEY_SERVICE;
        default:
            return FIXED_SERVICE
    }
};

export const getAvailableDates = (servicePriority) => {

    let date = moment();
    let serviceBasedType, useCustomDate = false;
    let minSelectDate = 1;
    let currentHour = Number(date.format('k'));
    let startTime = currentHour % 2 ? currentHour + 2 : currentHour + 1;

    if ([EMERGENCY, SAMEDAY].indexOf(servicePriority) !== -1) {
        serviceBasedType = serviceType.toUpperCase();
        useCustomDate = true;
    }

    if (serviceBasedType === SCHEDULED) {
        useCustomDate = true;
        date = moment().add(1, 'days');
    }

    if (date.format('ddd') === 'Fri' && serviceBasedType == SCHEDULED) {
        minSelectDate = 2;
        date = moment().add(2, 'days');
    } else if (serviceBasedType == "SCHEDULED" && (startTime > 7 && startTime < 17)) {
        minSelectDate = 1;
        date = moment().add(1, 'days');
    } else if (serviceBasedType == "SCHEDULED" && (stime > 16 || stime < 8)) {
        minSelectDate = 2;
        date = moment().add(1, 'days');

        if (date.format('ddd') === 'Fri') {
            minSelectDate = 3;
            date = moment().add(3, 'days');
        } else {
            minSelectDate = 2;
            date = moment().add(2, 'days');
        }
    } else {
        date = moment();
    }

    // console.log("MIN_SET_SELECT_DATE : ", minSelectDate)

    // date = daysInMonth(date);
    // #TODO: initialize custom date
    let cust_date_to_init = date;
    //console.log("CAAL CUSTOM DATE : ", date)
    return createCustomDate(minSelectDate, serviceBasedType);
    // updateDateToCalendar(date);

};

function createCustomDate(minSelectDate, serviceBasedType) {

    let dates = [];
    let isFridayAllowed = false; // trace logic
    let startDate = minSelectDate - 1;
    let totalDays = 30;
    // console.log('START DATE', minSelectDate)
    if ([EMERGENCY, SAMEDAY].indexOf(serviceBasedType) !== -1) {
        // console.log("e_s ::::: ", startDate)
        if (startDate == 1) {
            totalDays = 2;
        }
        for (let i = 0; i < 1; i++) {
            let currentDate = {};
            currentDate.date = moment().add(i, 'days').format('D');
            currentDate.day = moment().add(i, 'days').format('llll').split(",")[0];
            currentDate.month = moment().add(i, 'days').format('MMMM');
            currentDate.fullDate = moment().add(i, 'days').format('YYYY-MM-DD');
            currentDate.index = i;
            currentDate.push(currentDate);
        }
    } else {

        for (let i = startDate; i < totalDays; i++) {
            let currentDate = {};
            currentDate.date = moment().add(i + 1, 'days').format('D');
            currentDate.day = moment().add(i + 1, 'days').format('llll').split(",")[0];
            currentDate.month = moment().add(i + 1, 'days').format('MMMM');
            currentDate.fullDate = moment().add(i + 1, 'days').format('YYYY-MM-DD');
            currentDate.index = i;
            dates.push(currentDate);
        }
    }

    return dates;

    // useCustomDate = false;

    // $(".swiper-wrapper-datetime li").each(function () {
    //     if ($(this).data('fulldate') === day_month) {
    //         // console.log("FULLDATW : ", $(this).data('fulldate'), " :::", day_month)
    //         $(".swiper-wrapper-datetime li").removeClass("date-selected");
    //         $(this).addClass("date-selected");
    //         var slideNo = parseInt($(this).data("index"));
    //         if (slideNo == 1) {
    //             swiperdate.slideTo(slideNo);
    //         } else {
    //             swiperdate.slideTo(slideNo - 1);
    //         }

    //         // console.log(parseInt($(this).data("index")));
    //         let dateToSet = $(this).data('fulldate');
    //         updateDateToCalendar(dateToSet);
    //         let s_date = new Date(scheduleddate).setHours(0, 0, 0, 0);
    //         workingday = day[new Date(s_date)];
    //         s_date = new Date(s_date).getTime();
    //         s_date += 12 * 60 * 60 * 1000;
    //         let days = (s_date - (new Date()).getTime()) / (24 * 60 * 60 * 1000);
    //         if (serviceBasedType === "EMERGENCY" || serviceBasedType === "SAMEDAY") {
    //             days = 0
    //         }
    //         if (check_custom) {
    //             console.log("SETTING CUSTOM FALSE");
    //             check_custom = false;
    //             updateTimeSlot(serviceBasedType);
    //             selectTimeInit();
    //         }

    //     }
    // });

    // $(".swiper-wrapper-datetime li").click(function () {
    //     check_custom = true;
    //     $(".swiper-wrapper-datetime li").removeClass("date-selected");
    //     $(this).addClass("date-selected");
    //     var slideNo = parseInt($(this).data("index"));
    //     if (slideNo == 1) {
    //         swiperdate.slideTo(slideNo);
    //     } else {
    //         swiperdate.slideTo(slideNo - 1);
    //     }
    //     let dateToSet = $(this).data('fulldate');
    //     updateDateToCalendar(dateToSet);
    //     let s_date = new Date(scheduleddate).setHours(0, 0, 0, 0);
    //     workingday = day[new Date(s_date)];
    //     s_date = new Date(s_date).getTime();
    //     s_date += 12 * 60 * 60 * 1000;
    //     let days = (s_date - (new Date()).getTime()) / (24 * 60 * 60 * 1000);
    //     // updateTimeSlot(serviceBasedType);
    //     updateDateTimeSlot(days)
    //     selectTimeInit();
    // })
    // }
}

export const hasSlots = (date, slotDetails) => {
    var selectedDate = new Date(date);
    var slotForTheDay = slotDetails[selectedDate.getDay()];
    let slots = slotForTheDay.slots;
    var today = new Date();
    const isDateToday = moment().isSame(date, 'day');

    if (isDateToday) {
        var time = today.getHours();
        slots = slots.filter(item => (item.startTime / 60) > time);
        return slots.length > 0;
    }
    return true;
};

export const getSlot = (date, slotDetails, category) => {

    var selectedDate = new Date(date);
    // console.log(selectedDate);

    var slotForTheDay = slotDetails[selectedDate.getDay()];
    let duration = 0;

    var today = new Date();
    var time = today.getHours();

    const {
        peakHourCharges,
        offPeakHourCharges,
        peakHourChargesInPercent,
        peakHourChargesInAmount,
        emergencyBookingAllowed,
        emergencyCharges,
        emergencyChargesInAmount,
        emergencyChargesInPercent,
        isPeakHourAllowed,
    } = category;

    let peakUnit = '';
    let emergencyUnit = '';

    // emergencyCharges = emergencyCharges ? parseFloat(emergencyCharges) : 0;

    if (peakHourChargesInPercent) {
        peakUnit = '%'
    } else if (peakHourChargesInAmount) {
        peakUnit = 'AED'
    }

    if (emergencyChargesInPercent) {
        emergencyUnit = "%"
    } else if (emergencyChargesInAmount) {
        emergencyUnit = "AED"
    }

    if (emergencyBookingAllowed) {
        duration = slotForTheDay.duration / 60;
    } else {
        duration = 0;
    }

    const isDateToday = moment().isSame(date, 'day');
    let type = 'scheduled';

    if (isDateToday) {
        type = emergencyBookingAllowed ? 'emergency' : 'sameday';
    }

    const getIsPeak = (slot) => slot.isPeak && !!peakHourCharges && isPeakHourAllowed;
    const getIsOfPeak = (slot) => slot.isOff && !!offPeakHourCharges && isPeakHourAllowed;

    const getSubText = (slot, subType) => {
        let text = '';
        let textClass = '';

        if (slot.isDisabled) {
            return '(Not available)';
        }
        // console.log('Subtype', subType, isDateToday, (slot.startTime / 60), time, (time + duration));
        if (isDateToday && (slot.startTime / 60) > time) {
            textClass = 'colorRed';
            if (subType === 'peak') {
                if (emergencyUnit === peakUnit) {
                    text = `Emergency + Peak \n (+${emergencyCharges + peakHourCharges} ${peakUnit})`;
                } else {
                    text = `Emergency + Peak \n (+${emergencyCharges}${emergencyUnit} + ${peakHourCharges}${peakUnit})`;
                }
            } else if (subType === 'offPeak') {
                if (emergencyUnit === peakUnit) {
                    text = `Emergency - Off-Peak \n (+${emergencyCharges - offPeakHourCharges}${peakUnit})`;
                } else {
                    text = `Emergency - Off-Peak \n (+${emergencyCharges}${emergencyUnit} - ${offPeakHourCharges} ${peakUnit})`;
                }
            } else {
                text = `Emergency(+${emergencyCharges}${emergencyUnit})`;
            }
        }

        if (isDateToday && (slot.startTime / 60) > (time + duration)) {
            if (subType === 'peak') {
                text = `Peak(+${peakHourCharges} ${peakUnit})`;
                textClass = 'colorBlue';
            } else if (subType === 'offPeak') {
                text = `Off-Peak(-${offPeakHourCharges} ${peakUnit})`;
                textClass = 'colorGreen';
            } else {
                text = '';
            }
        }

        if (type === SCHEDULED) {
            if (subType === 'peak') {
                text = `Peak(+${peakHourCharges} ${peakUnit})`
                textClass = 'colorBlue';
            } else if (subType === 'offPeak') {
                text = `Off-Peak(-${offPeakHourCharges} ${peakUnit})`;
                textClass = 'colorGreen';
            } else {
                text = '';
            }
        }
        // console.log(text)
        return { text, textClass };
    }

    let slots = slotForTheDay.slots;
    if (type !== SCHEDULED) {
        slots = slots.filter(item => (item.startTime / 60) > time);
    }

    slots = slots.map((item, index) => {
        let subType = 'normal';
        // console.log(item, peakHourCharges, offPeakHourCharges, isPeakHourAllowed)
        const isPeak = getIsPeak(item);
        const isOfPeak = getIsOfPeak(item);

        if (isPeak || isOfPeak) {
            subType = isPeak ? 'peak' : 'offPeak';
        }

        if (index !== 0 && type == 'emergency') {
            type = 'sameday';
        }

        return {
            ...item,
            index,
            begin: getTimeString(item.startTime),
            end: getTimeString(item.endTime),
            type,
            subType,
            isPeak,
            ...getSubText(item, subType)
        };
    });


    return slots;
}

const getTimeString = (mins) => {
    return moment().startOf('day').add(mins, 'minutes').format('h:mm A');
}

export const getDaysInMonth = (holidays) => {
    const totalDays = 30;

    let dates = Array(totalDays).fill(null).map((v, i) => {
        const date = moment();
        date.add(i, 'days');
        return {
            date: date.format('D'),
            day: date.format('dddd'),
            month: date.format('MMMM'),
            index: i,
            iso: date.toISOString(),
            timestamp: date.valueOf(),
            fullDate: date.format('YYYY-MM-DD'), 
            isDisabled:  holidays.indexOf(date.format('YYYY-MM-DD')) !== -1
        };
    });

    return dates;
}


export const formatAddress = (result) => {
    const extractedObj = { extra: {}, administrativeLevels: {} };
    for (var i = 0; i < result.address_components.length; i++) {
        for (var x = 0; x < result.address_components[i].types.length; x++) {
            var addressType = result.address_components[i].types[x];
            switch (addressType) {
                //Country
                case 'country':
                extractedObj.country = result.address_components[i].long_name;
                extractedObj.countryCode = result.address_components[i].short_name;
                break;
                //Administrative Level 1
                case 'administrative_area_level_1':
                extractedObj.administrativeLevels.level1long =
                    result.address_components[i].long_name;
                extractedObj.administrativeLevels.level1short =
                    result.address_components[i].short_name;
                break;
                //Administrative Level 2
                case 'administrative_area_level_2':
                extractedObj.administrativeLevels.level2long =
                    result.address_components[i].long_name;
                extractedObj.administrativeLevels.level2short =
                    result.address_components[i].short_name;
                break;
                //Administrative Level 3
                case 'administrative_area_level_3':
                extractedObj.administrativeLevels.level3long =
                    result.address_components[i].long_name;
                extractedObj.administrativeLevels.level3short =
                    result.address_components[i].short_name;
                break;
                //Administrative Level 4
                case 'administrative_area_level_4':
                extractedObj.administrativeLevels.level4long =
                    result.address_components[i].long_name;
                extractedObj.administrativeLevels.level4short =
                    result.address_components[i].short_name;
                break;
                //Administrative Level 5
                case 'administrative_area_level_5':
                extractedObj.administrativeLevels.level5long =
                    result.address_components[i].long_name;
                extractedObj.administrativeLevels.level5short =
                    result.address_components[i].short_name;
                break;
                // City
                case 'locality':
                case 'postal_town':
                extractedObj.city = result.address_components[i].long_name;
                break;
                // Address
                case 'postal_code':
                extractedObj.zipcode = result.address_components[i].long_name;
                break;
                case 'route':
                extractedObj.streetName = result.address_components[i].long_name;
                break;
                case 'street_number':
                extractedObj.streetNumber = result.address_components[i].long_name;
                break;
                case 'premise':
                extractedObj.extra.premise = result.address_components[i].long_name;
                break;
                case 'subpremise':
                extractedObj.extra.subpremise =
                    result.address_components[i].long_name;
                break;
                case 'establishment':
                extractedObj.extra.establishment =
                    result.address_components[i].long_name;
                break;
                case 'sublocality_level_1':
                case 'political':
                case 'sublocality':
                case 'neighborhood':
                if (!extractedObj.extra.neighborhood) {
                    extractedObj.extra.neighborhood =
                    result.address_components[i].long_name;
                }
                break;
            }
        }
    }
    return extractedObj;
}

export const baseName = (str) => {
   let base = new String(str).substring(str.lastIndexOf('/') + 1); 
    // if(base.lastIndexOf(".") != -1)       
    //     base = base.substring(0, base.lastIndexOf("."));
   return base;
}

export const fileFormat = (str) => {
    let format = new String(str).substring(str.lastIndexOf('.') + 1); 
     // if(base.lastIndexOf(".") != -1)       
     //     base = base.substring(0, base.lastIndexOf("."));
    return format;
 }
