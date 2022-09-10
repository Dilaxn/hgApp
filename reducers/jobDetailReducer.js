import axios from "axios";
import { BASE_URL } from "../base_file";
import { JobDetailConverter } from "../converters/jobDetailConverter";

export const LOAD_JOB_DETAIL = "hg/jobdetails/JOB_DETAIL";
export const LOAD_JOB_DETAIL_SUCCESS = "hg/jobdetails/JOB_DETAIL_SUCCESS";
export const LOAD_JOB_DETAIL_FAIL = "hg/jobdetails/JOB_DETAIL_FAIL";

export const LOAD_GENIE_DATA = "hg/jobdetails/GENIE_DATA";
export const LOAD_GENIE_DATA_SUCCESS = "hg/jobdetails/GENIE_DATA_SUCCESS";
export const LOAD_GENIE_DATA_FAIL = "hg/jobdetails/GENIE_DATA_FAIL";

const initialState = {
  jobdetail: null,
  genie: null,
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_JOB_DETAIL:
      return {
        ...state,
        isJobdetailLoading: true,
        isJobdetailLoadError: null,
      };
    case LOAD_JOB_DETAIL_SUCCESS:
      // console.log('HEllo', action.payload)
      return {
        ...state,
        isJobdetailLoading: false,
        isJobdetailLoadError: null,
        jobdetail: action.payload,
      };
    case LOAD_JOB_DETAIL_FAIL:
      return {
        ...state,
        isJobdetailLoading: false,
        isJobdetailLoadError: true,
      };
    case LOAD_GENIE_DATA:
      return {
        ...state,
        isGenieLoading: true,
        isGenieLoadError: null,
      };
    case LOAD_GENIE_DATA_SUCCESS:
      // // console.log('HEllo', action.payload)
      return {
        ...state,
        isGenieLoading: false,
        isGenieLoadError: null,
        genie: action.payload,
      };
    case LOAD_JOB_DETAIL_FAIL:
      return {
        ...state,
        isGenieLoading: false,
        isGenieLoadError: true,
      };
    default:
      return state;
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
export const loadJobDetails = (t, jobId, bookingStatus) => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    const res = await axios.post(
      `${BASE_URL}customer/getJobDetails`,
      { appointmentId: jobId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("statusCode [loadJobDetails]", res.data.statusCode);
    console.log("message [loadJobDetails]", res.data.message);
    console.log("token [loadJobDetails]", token);
    console.log("jobId [loadJobDetails]", jobId);
    await loadError(res.data);
    const payload = JobDetailConverter.fromApi(
      res.data.data[0],
      bookingStatus
    );
    //console.log('Loaded....... JOB DAGTA [job Reducer]', res);
    dispatch({ type: LOAD_JOB_DETAIL_SUCCESS, payload });
    return payload;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    dispatch({
      type: LOAD_JOB_DETAIL_FAIL,
      payload: e,
    });
  }
};

export const loadGenie = (gid) => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    let res = await axios.get(
      `${BASE_URL}customer/getDriverDetails?id=${gid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("statusCode [loadGenie]", res.data.statusCode);
    console.log("message [loadGenie]", res.data.message);
    await loadError(res.data);
    const payload = res.data.data;
    // console.log('Loaded....... GINE DAGTA');
    dispatch({ type: LOAD_GENIE_DATA_SUCCESS, payload });
    return res.data.data;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    dispatch({
      type: LOAD_GENIE_DATA_FAIL,
      payload: e,
    });
  }
};

export const addRating = (token, data) => async (dispatch) => {
  try {
    const res = await axios.post(
      `${BASE_URL}customer/driverRatingComments`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("statusCode [addRating]", res.data.statusCode);
    console.log("message [addRating]", res.data.message);
    await loadError(res.data);
    return true;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const cancelJob = (token, data) => async (dispatch) => {
  try {
    const res = await axios.put(`${BASE_URL}customer/JobCancelCharge`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("statusCode [cancelJob]", res.data.statusCode);
    console.log("message [cancelJob]", res.data.message);
    await loadError(res.data);
    return true;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const getJobCancelCharge = (token, jobId) => async (dispatch) => {
  try {
    // console.log('cancelChargeeee');
    const res = await axios.get(
      `${BASE_URL}customer/JobCancelChargeCalculation?jobId=${jobId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("statusCode [getJobCancelCharge]", res.data.statusCode);
    console.log("message [getJobCancelCharge]", res.data.message);
    await loadError(res.data);
    return res.data.data.cancelCharge;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const updateInspection = (token, data) => async (dispatch) => {
  // console.log('tokenReducer', token);
  // console.log('dataReducer', data);
  try {
    const res = await axios.put(
      `${BASE_URL}customer/acceptOrRejectedJobOnce/`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("statusCode [updateInspection]", res.data.statusCode);
    console.log("message [updateInspection]", res.data.message);
    await loadError(res.data);
    return true;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const updatePayment = (token, jobId, amount) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${BASE_URL}customer/cashPayment?appointmentID=${jobId}&amount=${amount}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("statusCode [updatePayment]", res.data.statusCode);
    console.log("message [updatePayment]", res.data.message);
    await loadError(res.data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAllMyCard = (token) => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}customer/getAllMyCard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("statusCode [getAllMyCard]", res.data.statusCode);
    console.log("message [getAllMyCard]", res.data.message);
    await loadError(res.data);
    const allCards = res.data.data.cards;
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const cardPayment = (token, formData) => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}customer/paymentDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const json = await response.json();
    await loadError(json);
    return json;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const saveCardApi = (token, formData) => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}customer/addCard`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const json = await response.json();
    await loadError(json);
    return json;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const oldCardPayment = (token, formData) => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}customer/pay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const json = await response.json();
    console.log("jsonAPI", json);
    await loadError(json);
    return json;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const rejectAdvancePayment = (token, data) => async (dispatch) => {
  // console.log('tokenReducer', token);
  // console.log('dataReducer', data);
  try {
    const res = await axios.put(
      `${BASE_URL}customer/acceptOrRejectedJobOnce/`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("statusCode [rejectAdvancePayment]", res.data.statusCode);
    console.log("message [rejectAdvancePayment]", res.data.message);
    await loadError(res.data);
    return true;
  } catch (e) {
    // console.log('CATCH');
    // console.log(e)
    return false;
  }
};

export const getSingleJob = (id) => async (dispatch, getState) => {
  const { token } = getState().auth;
  const fd = new FormData();
  fd.append("appointmentId", id);
  // console.log("appointmentId", id);
  try {
    console.debug(`[Log][App][Job Reducer][Single Job][Loading...!!!]`);
    const res = await fetch(`${BASE_URL}customer/getJobDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      body: fd,
    });
    const { data } = await res.json();
    console.log("respopnse [getSingleJob]", res);
    console.log("statusCode [getSingleJob]", res.data.statusCode);
    console.log("message [getSingleJob]", res.data.message);
    const json = await response.json();
    await loadError(json);
    console.debug(`[Log][App][Job Reducer][Single Job][Loaded...!!!]`);
    return data[0];
  } catch (e) {
    console.debug(`[Error][App][Job Reducer][Single Job][Error]`, e);
    return false;
  }
};

// https://beta.api.homegenie.com/api/customer/getJobDetails
//Selectors
export const getJobDetail = (state) => state.jobdetails.jobdetail;
export const getGenie = (state) => state.jobdetails.genie;
