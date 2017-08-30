import { api } from 'api';

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
    (state = {
        ok: false,
        working: false,
        attempts: 0
    }, action) => {

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
    state.working = true;
    return state;
};

const sessionLogin = (state) => {
    state.working = true;
    state.attempts = state.attempts++;
    delete state.error;
    return state;
};

const sessionLoginSuccess = (state, action) => {
    state.working = false;
    state.user = action.session;
    return state;
};

const sessionLoginFailure = (state, action) => {
    state.working = false;
    state.ok = false;
    state.error = action.error.error;
    return state;
};

const sessionLogout = (state) => {
    state.working = true;
    state.ok = false;
    delete state.error;
    return state;
};

const sessionLogoutSuccess = () => {
    window.location.reload();
};

const sessionValid = (state) => {
    state.working = false;
    state.ok = true;
    return state;
};

export default {
    actions,
    epics,
    reducers
};
