const types = {

    PAGE_DOCK: 'PAGE_DOCK'
};

export const actions = {};
export const epics = {};
export const reducers = {
    pageReducer:
    (state = {
        pages: {}
    }, action) => {

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
        return state;
    state.pages[action.path] = {
        path: action.path,
        icon: action.icon,
        view: action.view,
        proxy: action.proxy,
        origin: action.__origin__
    };
    return state;
};

const logoutCleanup = (state) => {

    state.pages = {};
    return state;
};

export default {
    actions,
    epics,
    reducers
};
