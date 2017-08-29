import { fromJS, Map } from 'immutable'
import { api } from 'api'

const types = {

    SESSION_RECOVER: 'SESSION_RECOVER',
    SESSION_LOGIN: 'SESSION_LOGIN',
    SESSION_LOGIN_SUCCESS: 'SESSION_LOGIN_SUCCESS',
    SESSION_LOGIN_FAILURE: 'SESSION_LOGIN_FAILURE',
    SESSION_LOGOUT: 'SESSION_LOGOUT',
    SESSION_LOGOUT_SUCCESS: 'SESSION_LOGOUT_SUCCESS',
    SESSION_VALID: 'SESSION_VALID'
};

export const actions = {

    sessionRecover: () => ({
        type: types.SESSION_RECOVER
    }),

    sessionLogin: (credentials) => ({
        type: types.SESSION_LOGIN,
        credentials: credentials
    }),

    sessionLoginSuccess: (session) => ({
        type: types.SESSION_LOGIN_SUCCESS,
        session: session
    }),

    sessionLoginFailure: (error) => ({
        type: types.SESSION_LOGIN_FAILURE,
        error: error
    }),

    sessionLogout: () => ({
        type: types.SESSION_LOGOUT
    }),

    sessionLogoutSuccess: () => ({
        type: types.SESSION_LOGOUT_SUCCESS
    }),

    sessionValid: () => ({
        type: types.SESSION_VALID
    })
};

export const epics = {

    enclaveBoot:
    (action) => action.ofType('START')
        .mapTo(actions.sessionRecover()),

    sessionRecover:
    (action) => action.ofType(types.SESSION_RECOVER)
        .mergeMap(() =>
            api.fetchCurrentSession()
                .map(response => response.ok === true ? actions.sessionLoginSuccess(response.data) : actions.sessionLoginFailure(response.data))
        ),

    sessionLogin:
    (action) => action.ofType(types.SESSION_LOGIN)
        .mergeMap((action) =>
            api.userLogin(action.credentials)
                .map(response => response.ok === true ? actions.sessionLoginSuccess(response.data) : actions.sessionLoginFailure(response.data))
        ),

    sessionLoginSuccess:
    (action) => action.ofType(types.SESSION_LOGIN_SUCCESS)
        .mapTo(actions.sessionValid()),

    sessionLogout:
    (action) => action.ofType(types.SESSION_LOGOUT)
        .mergeMap(() =>
            api.userLogout()
                .map(() => actions.sessionLogoutSuccess())
        ),

};

export const reducers = {
    sessionReducer:
    (state = Map({
        ok: false,
        working: false,
        attempts: 0
    }), action) => {

        switch (action.type) {
            case types.SESSION_RECOVER:
                return sessionRecover(state);
            case types.SESSION_LOGIN:
                return sessionLogin(state);
            case types.SESSION_LOGIN_SUCCESS:
                return sessionLoginSuccess(state, action);
            case types.SESSION_LOGIN_FAILURE:
                return sessionLoginFailure(state, action);
            case types.SESSION_LOGOUT:
                return sessionLogout(state);
            case types.SESSION_LOGOUT_SUCCESS:
                return sessionLogoutSuccess();
            case types.SESSION_VALID:
                return sessionValid(state);
            default:
                return state;
        }
    }
};

const sessionRecover = (state) => {
    let future = state.toJS();
    future.working = true;
    return fromJS(future);
};

const sessionLogin = (state) => {
    let future = state.toJS();
    future.working = true;
    future.attempts = future.attempts++;
    delete future.error;
    return fromJS(future);
};

const sessionLoginSuccess = (state, action) => {
    let future = state.toJS();
    future.working = false;
    future.user = action.session;
    return fromJS(future);
};

const sessionLoginFailure = (state, action) => {
    let future = state.toJS();
    future.working = false;
    future.ok = false;
    future.error = action.error.error;
    return fromJS(future);
};

const sessionLogout = (state) => {
    let future = state.toJS();
    future.working = true;
    future.ok = false;
    delete future.error;
    return fromJS(future);
};

const sessionLogoutSuccess = () => {
    window.location.reload();
};

const sessionValid = (state) => {
    let future = state.toJS();
    future.working = false;
    future.ok = true;
    return fromJS(future);
};

export default {
    actions,
    epics,
    reducers
};
