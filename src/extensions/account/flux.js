import { Observable } from 'rxjs';
import NavigationButton from './containers/NavigationButton';
import View from './containers/View';

const types = {

    ACCOUNT_HYDRATE: 'ACCOUNT_HYDRATE'
};

export const actions = {

    dockToPager: () => ({
        type: '@@core/pager/PAGE_DOCK',
        path: 'account',
        icon: NavigationButton,
        view: View
    }),

    getCurrentUser: () => ({
        type: '@@core/session/SESSION_FETCH',
        replyTo: types.ACCOUNT_HYDRATE
    })
};

export const epics = {

    enclaveBoot:
    (action) => action.ofType('START')
        .mergeMap(() =>
            Observable.concat(
                Observable.of(actions.dockToPager()),
                Observable.of(actions.getCurrentUser())
            ))

};

export const reducers = {

    accountReducer:
    (state = {}, action) => {

        switch (action.type) {
            case types.ACCOUNT_HYDRATE:
                return hydrateAccount(state, action);
            case 'STOP':
                return clearAccount(state);
            default:
                return state;
        }
    }
};

const hydrateAccount = (state, action) => {

    state.user = action.user;
    return state;
};

const clearAccount = (state) => {

    delete state.user;
    return state;
};

export default {
    actions,
    epics,
    reducers
};
