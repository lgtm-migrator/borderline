import Immutable, { Map } from 'immutable';
import sessionTypes from './types';

export default {
    sessionReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case sessionTypes.SESSION_RECOVER:
            case sessionTypes.SESSION_LOGIN:
                return sessionLoginOrRecover(state, action);
            case sessionTypes.SESSION_LOGIN_SUCESS:
                return sessionLoginSuccess(state, action);
            case sessionTypes.SESSION_LOGIN_FAILURE:
                return sessionLoginFailure(state);
            case sessionTypes.SESSION_VALID:
                return sessionValid(state);
            default:
                return state;
        }
    }
};

const sessionLoginOrRecover = (state) => {
    let future = state.toJS();
    future.working = true;
    return Immutable.fromJS(future);
};

const sessionLoginSuccess = (state, action) => {
    let future = state.toJS();
    future.working = false;
    future.user = action.session;
    return Immutable.fromJS(future);
};

const sessionLoginFailure = (state) => {
    let future = state.toJS();
    future.working = false;
    future.ok = false;
    return Immutable.fromJS(future);
};

const sessionValid = (state) => {
    let future = state.toJS();
    future.working = false;
    future.ok = true;
    return Immutable.fromJS(future);
};
