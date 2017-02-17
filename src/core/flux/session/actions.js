import sessionTypes from './types';

export default {

    sessionRecover: () => ({
        type: sessionTypes.SESSION_RECOVER
    }),

    sessionLogin: (credentials) => ({
        type: sessionTypes.SESSION_LOGIN,
        credentials: credentials
    }),

    sessionLoginSuccess: (session) => ({
        type: sessionTypes.SESSION_LOGIN_SUCCESS,
        session: session
    }),

    sessionLoginFail: (error) => ({
        type: sessionTypes.SESSION_LOGIN_FAILURE,
        error: error
    }),

    sessionLogout: () => ({
        type: sessionTypes.SESSION_LOGOUT
    }),

    sessionLogoutSuccess: () => ({
        type: sessionTypes.SESSION_LOGOUT_SUCCESS
    }),

    sessionValid: () => ({
        type: sessionTypes.SESSION_VALID
    })
};
