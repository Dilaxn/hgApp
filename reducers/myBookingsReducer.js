import axios from 'axios'
import { BASE_URL } from "../base_file";
import { myBookingConverter } from '../converters/myBookingConverter';

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function getData(key) {
    let result = await SecureStore.getItemAsync(key);
    return result ? result : false;
}

//Login
export const LOAD_BOOKINGS = 'hg/bookings/LOAD_BOOKINGS'
export const LOAD_BOOKINGS_SUCCESS = 'hg/bookings/LOAD_BOOKINGS_SUCCESS'
export const LOAD_BOOKINGS_FAIL = 'hg/bookings/LOAD_BOOKINGS_FAIL'

const initialState = {
    currentBookings: null,
    pastBookings: null
};

export default function (state = initialState, action = {}) {
    switch (action.type) {

        case LOAD_BOOKINGS:
            return {
                ...state,
                isBookingsLoading: true,
                isBookingsLoadError: null,
            }
        case LOAD_BOOKINGS_SUCCESS:
            // // // console.log('HEllo', action.payload)
            return {
                ...state,
                isBookingsLoading: false,
                isBookingsLoadError: null,
                currentBookings: action.payload.currentBookings,
                pastBookings: action.payload.pastBookings
                // ...action.payload
            }
        case LOAD_BOOKINGS_FAIL:
            return {
                ...state,
                isBookingsLoading: false,
                isBookingsLoadError: true,
            }
        default:
            return state
    }
}

const loadError = async (data) => {
    console.log('allError statusCode', data.statusCode);
    if (data.statusCode != 200) {
        await dispatch(
            showError({
                title: "Error",
                message: data?.message,
                statusCode: data?.statusCode,
            })
        );
    }
}
export const loadBookings = () => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const res = await axios.get(`${BASE_URL}customer/getmybookings`, { headers: { Authorization: `Bearer ${token}` } });
        // console.log('statusCode loadBookings', res.data.statusCode);
        // console.log('message loadBookings', res.data.message);
        await loadError(res.data)
        const data = res.data.data;
        const pastBooking = myBookingConverter.fromApi(data.pastBooking, true);
        const upcomingAppointment = myBookingConverter.fromApi(data.upcomingAppointment);
        const payload = {
            pastBookings: pastBooking,
            currentBookings: upcomingAppointment
        };
        dispatch({ type: LOAD_BOOKINGS_SUCCESS, payload });
        return res.data.data;
    } catch (e) {
        dispatch({
            type: LOAD_BOOKINGS_FAIL,
            payload: e
        });
    }
};

export const getPendingRating = () => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const res = await axios.get(`${BASE_URL}customer/getPendingRating`, { headers: { Authorization: `Bearer ${token}` } });
        await loadError(res.data)
        return res.data?.data;
    } catch (e) {
        // console.log('CATCH');
        console.log(e)
    }
};


//Selectors
export const getCurrentBookings = state => state.bookings.currentBookings
export const getPastBookings = state => state.bookings.pastBookings