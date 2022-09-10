export const SHOW_ERROR = 'hg/app/SHOW_ERROR'
export const HIDE_ERROR = 'hg/app/HIDE_ERROR'
export const UPDATE_ERROR = 'hg/app/UPDATE_ERROR'
import { logout } from './reducers/authReducer'


const initialState = {
    isLoading: false,
    showError: false,
    errorTitle: "",
    errorMessage: "",
    statusCode: 0
}

export const init = () => async dispatch => {
    await dispatch(showError());
    await dispatch(hideError());
}

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case SHOW_ERROR:
            console.log("DONE SET STORE ERROR")
            return {
                ...state,
                showError: true,
                errorTitle: action.payload?.title,
                errorMessage: action.payload?.message,
                statusCode: action.payload?.statusCode
            }
        case HIDE_ERROR:
            return {
                ...state,
                showError: false,
                errorTitle: "",
                errorMessage: "",
            }
        default:
            return state
    }
}

export const getError = state => state.error;

export const showError = ({title = "", message = "", statusCode = ""}) => async (dispatch, getState) => {
    console.log("PARENT ERROR RECEIVED")
    dispatch({ type: SHOW_ERROR, payload: { title, message, statusCode } });

    if(statusCode == 401) {
        // auth error should logout
        await dispatch(logout());
    };
}

export const hideError = () => dispatch => {
    dispatch({ type: HIDE_ERROR });
}


// export const isLoading = (state) => state.app.isLoading;