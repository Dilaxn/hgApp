
export const SHOW_LOADING = 'hg/app/SHOW_LOADING'
export const HIDE_LOADING = 'hg/app/HIDE_LOADING'

const initialState = {
    isLoading: false
}

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case SHOW_LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case HIDE_LOADING:
            return {
                ...state,
                isLoading: false,
            }
        default:
            return state
    }
}

export const showLoading = () => dispatch => {
    dispatch({ type: SHOW_LOADING });
}

export const hideLoading = () => dispatch => {
    dispatch({ type: HIDE_LOADING });
}


export const isLoading = (state) => state.app.isLoading;