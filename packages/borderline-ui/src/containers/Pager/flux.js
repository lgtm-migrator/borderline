const types = {

    PAGE_DOCK: 'PAGE_DOCK',
    STATUS_DOCK: 'STATUS_DOCK',
    ERROR_DISPLAY: 'ERROR_DISPLAY',
    ERROR_REMOVE: 'ERROR_REMOVE'
};

export const actions = {
    dismissError: (id) => ({
        type: types.ERROR_REMOVE,
        id: id
    })
};
export const epics = {};

const initial = {
    pages: [],
    statuses: [],
    errors: {}
};

export const reducers = {
    pageReducer:
        (state = initial, action) => {

            switch (action.type) {
                case types.PAGE_DOCK:
                    return pageDock(state, action);
                case types.STATUS_DOCK:
                    return statusDock(state, action);
                case types.ERROR_DISPLAY:
                    return errorDisplay(state, action);
                case types.ERROR_REMOVE:
                    return errorRemove(state, action);
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

const statusDock = (state, action) => {

    if (action.view === undefined || action.view === null)
        return state;
    state.statuses.push({
        view: action.view,
        origin: action.__origin__
    });
    return state;
};

const errorDisplay = (state, action) => {
    state.errors[Math.random().toString(36).substr(2, 5)] = JSON.stringify(action.error, null, 2);
    return state;
};

const errorRemove = (state, action) => {
    delete state.errors[action.id];
    return state;
};


export default {
    actions,
    epics,
    reducers
};
