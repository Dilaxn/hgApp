import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

import { init } from './reducers/authReducer';
import { init as initCommon } from './reducers/categoryReducer';
import { init as initError } from './ErrorMessage';

const initialState = {

};
const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware)),
);

store.dispatch(init());
store.dispatch(initCommon());
// store.dispatch(initError());
// store.subscribe(state => console.log(store.getState().auth));
export default store;