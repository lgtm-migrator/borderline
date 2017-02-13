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

    sessionLoginFail: () => ({
        type: sessionTypes.SESSION_LOGIN_FAILURE
    }),

    sessionLogout: () => ({
        type: sessionTypes.SESSION_LOGOUT
    }),

    sessionValid: () => ({
        type: sessionTypes.SESSION_VALID
    })
};
