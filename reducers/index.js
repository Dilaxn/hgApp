import { combineReducers } from "redux";
import authReducer from "./authReducer";
import myBookingsReducer from "./myBookingsReducer";
import jobDetailReducer from "./jobDetailReducer";
import categoryReducer from "./categoryReducer";
import userReducer from "./userReducer";
import appReducer from "./appReducer";
import errorReducer from "./../ErrorMessage";
import walletReducer from "./walletReducer";
import notificationReducer from "./notificationReducer";
import paymentReducer from "./paymentReducer";

export default combineReducers({
  auth: authReducer,
  bookings: myBookingsReducer,
  jobdetails: jobDetailReducer,
  common: categoryReducer,
  user: userReducer,
  app: appReducer,
  error: errorReducer,
  wallet: walletReducer,
  notification: notificationReducer,
  payment: paymentReducer,
});
