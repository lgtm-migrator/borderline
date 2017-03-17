/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import sessionTypes from './types';
import sessionActions from './actions';
const { api } = borderline;

export default {

    borderlineBoot:
    (action) => action.ofType('START')
        .mapTo(sessionActions.sessionRecover()),

    sessionRecover:
    (action) => action.ofType(sessionTypes.SESSION_RECOVER)
        .mergeMap(() =>
            api.fetchCurrentSession()
                .map(response => response.ok ? sessionActions.sessionLoginSuccess(response.data) : sessionActions.sessionLoginFailure(response.data))
        ),

    sessionLogin:
    (action) => action.ofType(sessionTypes.SESSION_LOGIN)
        .mergeMap((action) =>
            api.userLogin(action.credentials)
                .map(response => response.ok ? sessionActions.sessionLoginSuccess(response.data) : sessionActions.sessionLoginFailure(response.data))
        ),

    sessionLoginSuccess:
    (action) => action.ofType(sessionTypes.SESSION_LOGIN_SUCCESS)
        .mapTo(sessionActions.sessionValid()),

    sessionLogout:
    (action) => action.ofType(sessionTypes.SESSION_LOGOUT)
        .mergeMap(() =>
            api.userLogout()
                .map(() => sessionActions.sessionLogoutSuccess())
        ),

};
