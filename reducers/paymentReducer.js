import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../base_file";
import { showError } from "../ErrorMessage";
const initialState = {
  getAllMyCardData: [],
};
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
export default function (state = initialState, action = {}) {
  switch (action.type) {
    case "SET_GETALLMYCARD_DATA":
      return {
        ...state,
        getAllMyCardData: action.payload,
      };
    default:
      return { ...state };
  }
}

export const getAllMyCard = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    const api = `${BASE_URL}customer/getAllMyCard`;
    const response = await fetch(api, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    const jsonData = await response.json();
    let payload = jsonData.data.cards;
    console.log("result [getAllMyCard] [success]", payload);
    await loadError(jsonData);
    dispatch({ type: "SET_GETALLMYCARD_DATA", payload });
  } catch (e) {
    console.log("result [getAllMyCard] [failed]", e);
    await loadError(jsonData);
  }
};

export const deleteSavedCards = (id) => async (dispatch, getState) => {
  const { token } = getState().auth;
  console.log("token [deleteSavedCards]", token);
  try {
    console.log("cardId [deleteSavedCards]", id);
    const res = await axios.put(`${BASE_URL}customer/deleteCards`, id,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("result [deleteSavedCards]", res);
    await loadError(res.data);
    return true;
  } catch (e) {
    await loadError(res.data);
    return false;
  }
};

export const getAllMyCardData = (state) => state.payment.getAllMyCardData;
