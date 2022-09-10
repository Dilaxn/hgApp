import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../base_file";
import { showError } from "../ErrorMessage";
const initialState = {
  walletData: [],
  walletTransaction: [],
  debit: [],
  credit: [],
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case "SET_WALLET_DATA":
      return {
        ...state,
        walletData: action.payload,
      };
    case "SET_WALLET_TRANSACTION_DATA":
      return {
        ...state,
        walletTransactionData: action.payload,
      };
    case "SET_WALLET_DEBIT_DATA":
      console.log("debit data", action);
      return {
        ...state,
        debit: action.debit,
      };
    case "SET_WALLET_CREDIT_DATA":
      return {
        ...state,
        credit: action.credit,
      };
    default:
      return { ...state };
  }
}
const loadError = async (data) => {
  console.log("allError statusCode", data.statusCode);
  if (data.statusCode != 200) {
    await dispatch(
      showError({
        title: "Error",
        message: data?.message,
        statusCode: data?.statusCode,
      })
    );
  }
};
let todayDate = moment().format("DD-MM-YYYY");

export const getWallet = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    let result = await axios.get(`${BASE_URL}customer/getWallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("statusCode [walletReducer]", result.data.statusCode);
    console.log("message [walletReducer]", result.data.message);
    await loadError(result.data);
    result.data.data[0].updatedAt = todayDate;
    const payload = result.data.data[0];
    dispatch({ type: "SET_WALLET_DATA", payload });
    console.log("result [wallet] [success] after", result.data.data[0]);
  } catch (e) {
    console.log("result [wallet] [failed]", e);
  }
};

export const getWalletTransaction = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    let result = await axios.get(`${BASE_URL}customer/getWalletTransaction`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadError(result.data);
    const payload = result.data.data;
    dispatch({ type: "SET_WALLET_TRANSACTION_DATA", payload });
    //console.log("result [walletReducer] [walletTransaction] [success]",payload);

    let walletTransaction = payload;
    //console.log("newData [walletReducer]1", walletTransaction);
    let debit = [],
      credit = [];
    if (walletTransaction && walletTransaction.length > 0) {
      walletTransaction.map((x) => {
        if (x.transactionAction == "DEBIT") {
          debit.push(x);
        } else if (x.transactionAction == "CREDIT") {
          credit.push(x);
        }
        let newDate = moment(x.createdAt).format("DD-MM-YYYY");
        x.createdAt = newDate;
        //console.log("newData [walletReducer]", newDate);
        x.amount = parseFloat(x.amount).toFixed(2);

        dispatch({ type: "SET_WALLET_DEBIT_DATA", debit });
        dispatch({ type: "SET_WALLET_CREDIT_DATA", credit });
      });
    }
  } catch (e) {
    console.log("result [wallet] [failed]", e);
  }
};

export const getVoucher = (voucherData) => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    const res = await fetch(`${BASE_URL}customer/applyVoucherCode`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: voucherData,
    });
    const json = await res.json();
    if (json.statusCode == 200) {
      return json.data;
    } else {
      if (json.statusCode != 200) {
        await dispatch(
          showError({
            title: "",
            message: json?.message,
            statusCode: json?.statusCode,
          })
        );
      }
    }
  } catch (e) {
    console.log("result [wallet] [ApplyVoucher] [failed]", e);
    return false;
  }
};
export const getWalletData = (state) => state.wallet.walletData;
export const getWalletTransactionData = (state) => {
  let walletTransactionData = {
    debit: state.wallet.debit,
    credit: state.wallet.credit,
  };
  return walletTransactionData;
};
