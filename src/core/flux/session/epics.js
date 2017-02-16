import sessionTypes from './types';
import sessionActions from './actions';
import api from '../../utilities/ServerCommunication';

export default {

    borderlineBoot:
    (action) => action.ofType('@@all/borderline/BOOT')
        .mapTo(sessionActions.sessionRecover()),

    sessionRecover:
    (action) => action.ofType(sessionTypes.SESSION_RECOVER)
        .mergeMap(() =>
            api.fetchCurrentSession()
                .map(response => response.ok ? sessionActions.sessionLoginSuccess(response.data) : sessionActions.sessionLoginFail(response.data))
        ),

    sessionLogin:
    (action) => action.ofType(sessionTypes.SESSION_LOGIN)
        .mergeMap((action) =>
            api.userLogin(action.credentials)
                .map(response => response.ok ? sessionActions.sessionLoginSuccess(response.data) : sessionActions.sessionLoginFail(response.data))
        ),

    sessionLoginSuccess:
    (action) => action.ofType(sessionTypes.SESSION_LOGIN_SUCCESS)
        .mapTo(sessionActions.sessionValid()),

};
