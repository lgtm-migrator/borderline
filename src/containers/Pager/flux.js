import { fromJS, Map } from 'immutable'

const types = {

    PAGE_DOCK: 'PAGE_DOCK'
};

export const actions = {};
export const epics = {};
export const reducers = {
    pageReducer:
    (state = Map({
        pages: {}
    }), action) => {

        switch (action.type) {
            case types.PAGE_DOCK:
                return pageDock(state, action);
            case '@@core/session/SESSION_LOGOUT':
            case 'STOP':
                return logoutCleanup(state);
            default:
                return state;
        }
    }
};
const pageDock = (state, action) => {

    if (action.path === undefined || action.path === null ||
        action.icon === undefined || action.icon === null ||
        action.view === undefined || action.view === null)
        return state
    let future = state.toJS();
    future.pages[action.path] = {
        path: action.path,
        icon: action.icon,
        view: action.view,
        proxy: action.proxy,
        origin: action.__origin__
    };
    return fromJS(future);
};

const logoutCleanup = (state) => {

    let future = state.toJS();
    future.pages = {};
    return fromJS(future);
};

export default {
    actions,
    epics,
    reducers
};
