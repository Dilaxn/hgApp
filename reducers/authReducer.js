import axios from 'axios'
import { BASE_URL } from "../base_file";
import { setItem, getItem, removeItem } from '../helpers/localStorage'

const USER_TOKEN = 'token';
const IS_LOGGEDIN = 'loggedin';
const USER = 'user';


//Login
export const LOGIN = 'hg/auth/user/LOGIN'
export const LOGIN_SUCCESS = 'hg/auth/user/LOGIN_SUCCESS'
export const LOGIN_FAIL = 'hg/auth/user/LOGIN_FAIL'

//Verify otp

export const VERIFY_OTP = 'hg/auth/user/VERIFY_OTP'
export const VERIFY_OTP_SUCCESS = 'hg/auth/user/VERIFY_OTP_SUCCESS'
export const VERIFY_OTP_FAIL = 'hg/auth/user/VERIFY_OTP_FAIL'

export const RESEND_OTP = 'hg/auth/user/RESEND_OTP'
export const RESEND_OTP_SUCCESS = 'hg/auth/user/RESEND_OTP_SUCCESS'
export const RESEND_OTP_FAIL = 'hg/auth/user/RESEND_OTP_FAIL'

export const LOGOUT = 'hg/auth/user/LOGOUT'
export const LOGOUT_SUCCESS = 'hg/auth/user/LOGOUT_SUCCESS'
export const LOGOUT_FAIL = 'hg/auth/user/LOGOUT_FAIL'

export const LOAD_LOCAL_DATA = 'hg/auth/user/LOAD_LOCAL_DATA'

const initialState = {
  token: null,
  isOTPSent: false,
  isLoggedIn: false,
  user: {}
}

export default function (state = initialState, action = {}) {
  switch (action.type) {

    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        loginError: null,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        info: action.result,
        loggingIn: false,
        isOTPSent: true,
      }
    case LOGIN_FAIL:
      return {
        ...state,
        info: {},
        loggingIn: false,
        loginError: action.error,
      }
    case LOGOUT:
      removeItem(USER_TOKEN);
      removeItem(USER);
      removeItem(IS_LOGGEDIN)

      return {
        ...state,
        loggingOut: true,
        isLoggedIn: false,
        user: {},
        token: null
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        loggingOut: false,
        info: {},
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error,
      }
    case VERIFY_OTP:
      return {
        ...state,
        isOTPVerifying: true,
      }
    case VERIFY_OTP_SUCCESS:

      setItem(USER_TOKEN, action.payload.token);
      setItem(IS_LOGGEDIN, true);
      setItem(USER, action.payload.user);

      return {
        ...state,
        isLoggedIn: true,
        isOTPVerifying: false,
        user: { ...action.payload.user },
        token: action.payload.token
      }
    case VERIFY_OTP_FAIL:
      return {
        ...state,
        isOTPVerifying: false,
      }
    case LOAD_LOCAL_DATA:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export const init = () => async dispatch => {
  const token = await getItem(USER_TOKEN);
  const isLoggedIn = token ? true : false//await getItem(IS_LOGGEDIN);
  const user = await getItem(USER);

  const payload = {
    token,
    isLoggedIn,
    user
  };
  await dispatch({ type: LOAD_LOCAL_DATA, payload });
  dispatch(loggedIncheck());
}

export const login = (phone, countryCode) => async dispatch => {

  try {
    const res = await axios.post(
      `${BASE_URL}customer/validatePhoneNo`,
      {
        phoneNo: phone,
        countryCode: countryCode,
      }
    );

    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    return res.data.data;
  } catch (e) {
    console.log(e)
    dispatch({ type: LOGIN_FAIL, payload: e });
  }
};


export const verifyOTP = (params) => async dispatch => {
  try {
    const res = await axios.put(`${BASE_URL}customer/verifyOTP1`, params);
    const data = res.data.data;
    console.log("result [verifyOTP] [authReducer]", data);
    const addressData = data.defaultAddress.find(x => x._id === data.userDetails.customerAddresses[0]);
    const payload = {
      token: data.accessToken,
      user: {
        name: data.userDetails.name,
        email: data.userDetails.email,
        phoneNumber: data.userDetails.phoneNo,
        countryCode: data.userDetails.countryCode,
        dob: data.userDetails.dob,
        nationality: data.userDetails.nationality,
        profilePicURL: data.userDetails.profilePicURL.original,
        phoneVerified: data.userDetails.phoneVerified,
        emailVerified: data.userDetails.emailVerified,
        firstTimeLogin: data.userDetails.firstTimeLogin,
        language: data.userDetails.language,
        // customerAddresses: data.userDetails.customerAddresses[0],
        // DefaultAddressFind: data.defaultAddress.find(x => x._id === customerAddresses),
        //defaultCards: data.userDetails.defaultCards._id,
        customerAddresses: addressData || null,
        defaultCards: data.defaultCards ? data.defaultCards.Digit : null,
        // IsdefaultAddress: addressData.IsdefaultAddress,
        // addressType: addressData.addressType,
        // apartmentNo: addressData.apartmentNo,
        // city: addressData.city,
        // community: addressData.community,
        // emirate: addressData.emirate,
        // nickName: addressData.nickName,
        id: data.userDetails._id,
        secondaryPhoneNumber: data.userDetails.secondaryPhoneNumber || null
      },
    }
    await dispatch({ type: VERIFY_OTP_SUCCESS, payload });
    return res.data.data;
  } catch (e) {
    console.log(e);
    dispatch({ type: VERIFY_OTP_FAIL, payload: e });
  }
}

export const loggedIncheck = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  if (!token) {
    console.debug(`[App][Reducers][User Reducer][Session] Not Found !!!`);
    return;
  }

  try {
    console.debug(`[App][Reducers][User Reducer][Session] Verifying Session !!!`);
    const res = await axios.get(`${BASE_URL}customer/getAllAddress`, { headers: { Authorization: `Bearer ${token}` } });
    console.debug(`[App][Reducers][User Reducer][Session] Session Active !!!`);
  } catch (e) {
    console.error(`[App][Reducers][User Reducer][Session] Session Expired !!!`);
    dispatch(logout());
  }
};

export const logout = () => async dispatch => {
  await dispatch({ type: LOGOUT });
}

//Selectore

export const getAccessToken = state => state.auth.token;
export const getLoggedInStatus = state => state.auth.isLoggedIn;
export const getUser = state => state.auth.user;