import axios from "axios";
import { BASE_URL } from "../base_file";
import { showError } from "../ErrorMessage";

export const LOAD_ALL_ADDRESS = "hg/user/LOAD_ALL_ADDRESS";
export const LOAD_ALL_ADDRESS_SUCCESS = "hg/user/LOAD_ALL_ADDRESS_SUCCESS";
export const LOAD_ALL_ADDRESS_FAIL = "hg/user/LOAD_ALL_ADDRESS_FAIL";
export const LOAD_CUSTOMERDETAILS_DATA = "hg/user/LOAD_CUSTOMERDETAILS_DATA";
export const LOAD_CUSTOMERDETAILS_DATA_SUCCESS = "hg/user/LOAD_CUSTOMERDETAILS_DATA_SUCCESS";
export const LOAD_CUSTOMERDETAILS_DATA_FAIL = "hg/user/LOAD_CUSTOMERDETAILS_DATA_FAIL";

export const ADD_ADDRESS = "hg/user/ADD_ADDRESS";
export const ADD_ADDRESS_SUCCESS = "hg/user/ADD_ADDRESS_SUCCESS";
export const ADD_ADDRESS_FAIL = "hg/user/ADD_ADDRESS_FAIL";

export const DELETE_ADDRESS = "hg/user/DELETE_ADDRESS";
export const DELETE_ADDRESS_SUCCESS = "hg/user/DELETE_ADDRESS_SUCCESS";
export const DELETE_ADDRESS_FAIL = "hg/user/DELETE_ADDRESS_FAIL";

const initialState = {
  address: [],
  customerDetails: [],
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_ALL_ADDRESS:
      return {
        ...state,
        isAddressLoading: true,
        isAddressLoadingError: null,
      };
    case LOAD_ALL_ADDRESS_SUCCESS:
      return {
        ...state,
        isAddressLoading: false,
        isAddressLoadingError: null,
        address: action.payload,
      };
    case LOAD_ALL_ADDRESS_FAIL:
      return {
        ...state,
        isAddressLoading: false,
        isAddressLoadingError: true,
      };

    case LOAD_CUSTOMERDETAILS_DATA:
      return {
        ...state,
        isDetailsLoading: true,
        isDetailsLoadingError: null,
      };
    case LOAD_CUSTOMERDETAILS_DATA_SUCCESS:
      return {
        ...state,
        customerDetails: action.payload,
        isDetailsLoading: false,
        isDetailsLoadingError: null,
      };
    case LOAD_CUSTOMERDETAILS_DATA_FAIL:
      return {
        ...state,
        isDetailsLoading: false,
        isDetailsLoadingError: true,
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

export const loadAddress = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const res = await axios.get(`${BASE_URL}customer/getAllAddress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = res.data.data;
    dispatch({ type: LOAD_ALL_ADDRESS_SUCCESS, payload });
    return true;
  } catch (e) {
    dispatch({ type: LOAD_ALL_ADDRESS_FAIL });
  }
};

export const addAddress = (data) => async (dispatch, getState) => {
  const { token } = getState().auth;
  const { address } = getState().user;
  try {
    await console.log("dataaaaa", data)
    let form_data = new FormData();
    form_data.append("nickName", data.nickName)
    form_data.append("apartmentNo", data.apartmentNo)
    form_data.append("streetAddress", data.streetAddress)
    form_data.append("communtity", data.communtity)
    form_data.append("city", data.city)
    form_data.append("emirate", data.emirate)
    form_data.append("addressType", data.addressType)
    form_data.append("locationLat", Number(data.locationLat))
    form_data.append("locationLong", Number(data.locationLong))
    form_data.append("IsdefaultAddress", data.IsdefaultAddress)
    console.log(form_data)
    // const res = await axios.post(`${BASE_URL}customer/addNewAddress`, form_data, {
    //   headers: { Authorization: `Bearer ${token}` },
    //     Accept: 'application/json',
    //     'Content-Type': 'multipart/form-data',
    // });
    const response = await fetch(`${BASE_URL}customer/addNewAddress`, {
      method: 'POST',
      body: form_data,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    })
    //  .then(response => response.json())
    // .then(async data => {
    //   if (data.statusCode === 200) {
    //     console.log(data);
    //     const payload = [...address, data.data];
    //     console.log("payload",payload)
    //     await dispatch(loadAddress());
    //     return true;
    //   } else {
    //     return false;
    //   }
    // })
    // .catch(err=>{
    //   return false;
    // });
    let res = await response.json();
    await console.log('res', res)
    if (res.statusCode === 200) {
      const payload = [...address, res.data];
      console.log("payload", payload)
      await dispatch(loadAddress());
      return true;
    }
    return false;
  } catch (e) {
    console.log('Error Adding Address.....!!!');
    console.log(e.message);
    return false;
  }
};

export const editAddress = (data) => async (dispatch, getState) => {
  const { token } = getState().auth;
  const { address } = getState().user;
  try {
    // console.log(data, `Bearer ${token}`)
    const res = await axios.put(`${BASE_URL}customer/editAddress`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.data.length) {
      await dispatch(loadAddress());
      return true;
    }
    return false;
  } catch (e) {
    // console.log('Error Adding Address.....!!!');
    // console.log(e);
    return false;
  }
};

export const deleteAddress = (id) => async (dispatch, getState) => {
  const { token } = getState().auth;
  const { address } = getState().user;
  try {
    const res = await axios.delete(
      `${BASE_URL}customer/removeAddress?addressId=${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.statusCode) {
      const payload = address.filter((item) => item._id != id);
      dispatch({ type: LOAD_ALL_ADDRESS_SUCCESS, payload });
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const loadRelatedOffers =
  (subCategoryId) => async (dispatch, getState) => {
    const { token, user } = getState().auth;
    const formData = new FormData();
    formData.append("subcategoryId", subCategoryId);
    if (!token || !user) {
      return false;
    }
    // console.log('USER ID', user.id)

    try {
      console.debug(`[Log][App][User Reducer][Related Offers][Loading...!!!]`);
      const response = await fetch(`${BASE_URL}customer/relatedOffers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let { data } = await response.json();
      console.debug(`[Log][App][User Reducer][Related Offers][Loaded...!!!]`);

      var currentDate = new Date();
      data = data
        .map((item) => {
          if (
            item.promo.maxUserCount != item.promo.customerID.length &&
            new Date(item.promo.endTime) > currentDate
          ) {
            item.status = true;
          } else {
            item.status = false;
          }

          if (item.promo.frequencyPerUser == 1) {
            if (item.promo.customerID.indexOf(user.id) >= 0 ? true : false) {
              item.status = false;
            }
          }
          return { ...item };
        })
        .filter((item) => item.status);
      return data;
    } catch (e) {
      console.debug(`[Error][App][User Reducer][Related Offers][Error]`, e);
      return false;
    }
  };

export const applyPromoCode = (data) => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    console.debug(`[Log][App][User Reducer][Promocode ][Applying...!!!]`);
    const response = await fetch(`${BASE_URL}customer/applyPromoCode`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    let json = await response.json();
    console.debug(`[Log][App][User Reducer][Promocode ][Applied...!!!]`);
    return !!json.data ? json.data : json;
  } catch (e) {
    console.debug(`[Error][App][User Reducer][Related Offers][Error]`, e);
    return e;
  }
};

export const getCustomerDetail = (email) => async (dispatch, getState) => {
  const { token } = getState().auth;
  console.log('inside [getCustomerDetail] [userReducer]');
  try {
    let form_data = new FormData();
    console.log("email,",email)
    const response = await fetch(`${BASE_URL}customer/getcustomerDetails?email=${email}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    })
    // const res = await axios.get(`${BASE_URL}customer/getcustomerDetails?email=${email}`,
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );
    let res = await response.json();
    let result = res.data;
    //await loadError(result);
    // console.log('result [getCustomerDetail] [userReducer]',result);
    const payload = result;
    dispatch({ type: LOAD_CUSTOMERDETAILS_DATA_SUCCESS, payload });
    return true;
  } catch (e) {
    dispatch({ type: LOAD_CUSTOMERDETAILS_DATA_FAIL });
    return false;
  }
};

export const getAddress = (state) => state.user.address;
export const getCustomerDetails = (state) => state.user.customerDetails;