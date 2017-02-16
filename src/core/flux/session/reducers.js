import Immutable, { Map } from 'immutable';
import sessionTypes from './types';

export default {
    sessionReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case sessionTypes.SESSION_RECOVER:
                return sessionRecover(state);
            case sessionTypes.SESSION_LOGIN:
                return sessionLogin(state);
            case sessionTypes.SESSION_LOGIN_SUCESS:
                return sessionLoginSuccess(state, action);
            case sessionTypes.SESSION_LOGIN_FAILURE:
                return sessionLoginFailure(state, action);
            case sessionTypes.SESSION_LOGOUT:
                return sessionLogout(state);
            case sessionTypes.SESSION_VALID:
                return sessionValid(state);
            default:
                return state;
        }
    }
};

const sessionRecover = (state) => {
    let future = state.toJS();
    future.working = true;
    return Immutable.fromJS(future);
};

const sessionLogin = (state) => {
    let future = state.toJS();
    future.working = true;
    future.attempts = future.attempts++ || 1;
    delete future.error;
    return Immutable.fromJS(future);
};

const sessionLoginSuccess = (state, action) => {
    let future = state.toJS();
    future.working = false;
    future.user = action.session;
    return Immutable.fromJS(future);
};

const sessionLoginFailure = (state, action) => {
    let future = state.toJS();
    future.working = false;
    future.ok = false;
    future.error = action.error;
    return Immutable.fromJS(future);
};

const sessionLogout = (state) => {
    let future = state.toJS();
    future.working = false;
    future.ok = false;
    future.attempts = 0;
    delete future.error;
    return Immutable.fromJS(future);
};

const sessionValid = (state) => {
    let future = state.toJS();
    future.working = false;
    future.ok = true;
    return Immutable.fromJS(future);
};
