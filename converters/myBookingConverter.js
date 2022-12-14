import { SLOTS } from '../constants/jobdetails';
import moment from 'moment';
import { getMyBookingsOption } from '../helpers/myBooking';


export const myBookingConverter = {
    fromApi: (items, isPastBooking) => {
        return items.map((data) => {
            let jobDetail = data;

            const { slotBooked: { slot } } = data;
            // console.log('slott', slot)
            const slotTime = slot[0];
            jobDetail['slot'] = SLOTS[slotTime];

            const { scheduleDate } = jobDetail;

            const date = moment(scheduleDate);
            jobDetail['scheduleDate'] = `${date.format('ddd DD MMM YYYY')} | ${SLOTS[slotTime]}`;
            jobDetail['dateScheduled'] = `${SLOTS[slotTime]}, ${date.format('MMM DD')}`;

            const { utc_timing: { requestedTime } } = jobDetail;
            const requstedMoment = moment(requestedTime);
            // console.log(requstedMoment)
            jobDetail["utc_timing"]["requestedTime"] = [requstedMoment.format('DD/MM/YYYY'), requstedMoment.format('hh:mm:ss a')]
            jobDetail['favouriteGenie'] = !(jobDetail['favouriteGenie'] === 'FALSE')

            const { charges: { totalCharges, unitCharges, estimateCharges, cancellationCharges } } = jobDetail;
            const { status, payment } = jobDetail;

            if (!totalCharges && status !== 'CANCELLED') {
                jobDetail['charges']['totalCharges'] = 'To be decided';
            }

            if (unitCharges) {
                jobDetail['services'] = 'Fixed price';
                jobDetail['charges']['totalCharges'] = unitCharges;
            } else {
                //bookingOngoing[k]['services'] = 'Inspection based';
                jobDetail['services'] = 'Inspection based';
            }

            if (estimateCharges) {
                jobDetail['charges']['totalCharges'] = estimateCharges;
            }
            if (totalCharges == cancellationCharges) {
                jobDetail['charges']['totalCharges'] = totalCharges;
            }
            if (payment && payment['payment_type'] === null && !jobDetail.advancePayment) {
                jobDetail['payment']['payment_type'] = 'On Completion';
            }
            jobDetail = {
                ...jobDetail,
                ...getMyBookingsOption(status, jobDetail),
            }

            if (isPastBooking) {

                if (data['payment_status'] == 'PENDING') {
                    jobDetail['payment_status'] = 'SETTLED';
                }

                if (data['charges']['unitCharges']) {
                    jobDetail['services'] = 'Fixed price';
                } else {
                    jobDetail['services'] = 'Inspection based';
                }

                if (data['payment'] && data['payment']['payment_type'] === null) {
                    jobDetail['payment']['payment_type'] = '';
                }

                switch (status) {
                    case 'CANCELLED':
                        if (data['payment']['payment_type'] == 'CASH') {
                            jobDetail['showAction'] = 'Cancelled and paid';
                        } else {
                            jobDetail['showAction'] = '';
                        }
                        break;
                    case 'SETTLED':
                        jobDetail['showAction'] = '';
                        break;
                    case "REJECTED":
                        jobDetail['showAction'] = 'Rejected and paid';
                        break;
                    default:
                        break;
                }
            }

            return { ...jobDetail };
        });
    }
}