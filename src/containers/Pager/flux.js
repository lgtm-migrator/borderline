const types = {

    PAGE_DOCK: 'PAGE_DOCK'
};

export const actions = {};
export const epics = {};

const initial = {
    pages: []
};

export const reducers = {
    pageReducer:
    (state = initial, action) => {

        switch (action.type) {
            case types.PAGE_DOCK:
                return pageDock(state, action);
            case '@@core/session/SESSION_LOGOUT':
            case 'STOP':
                return initial;
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
    state.pages.push({
        path: action.path,
        icon: action.icon,
        view: action.view,
        origin: action.__origin__
    });
    return state;
};

export default {
    actions,
    epics,
    reducers
};
