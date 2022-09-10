import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../base_file";
import { showError, SHOW_ERROR } from "../ErrorMessage";
const initialState = {
  notificationData: [],
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case "SET_NOTIFICATION_DATA":
      return {
        ...state,
        notificationData: action.payload,
      };
    default:
      return { ...state };
  }
}

export const getNotifications = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    const result = await axios.get(`${BASE_URL}customer/getNotifications`, { headers: { Authorization: `Bearer ${token}` } });
    // console.log('statusCode [notiicationReducer]', result.data.statusCode);
    // console.log('message [notiicationReducer]', result.data.message);
    if (result.data.statusCode != 200) {
      await dispatch(
        showError({
          title: "Error",
          message: result.data?.message,
          statusCode: result.data?.statusCode,
        })
      );
    }
    const payload = result.data.data;
    dispatch({ type: "SET_NOTIFICATION_DATA", payload });
    //console.log("result [notification] [success]", result.data.data);
  } catch (e) {
    console.log("result [notification] [failed]", e);
  }
};
export const getNotificationData = (state) => state.notification.notificationData;
