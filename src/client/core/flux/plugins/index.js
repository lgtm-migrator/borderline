import { combineEpics } from 'redux-observable';
import { List } from 'immutable';

// These are the types of flux for the plugin manager
export const types = {
    PLUGINS_WILL_LOAD: '@@core/plugins/PLUGINS_WILL_LOAD',
    PLUGINS_DID_LOAD: '@@core/plugins/PLUGINS_DID_LOAD',
    PLUGINS_GET_LIST: '@@core/plugins/PLUGINS_GET_LIST',
    PLUGINS_SUCCESS: '@@core/plugins/PLUGINS_SUCCESS',
};

// Here are the actionator available for the plugin managment flux
export const actions = {
    loadPlugins: () => ({
        type: types.PLUGINS_WILL_LOAD
    }),
    pluginsGetList: () => ({
        type: types.PLUGINS_GET_LIST
    }),
    pluginsSuccess: () => ({
        type: types.PLUGINS_SUCCESS,
        list: [
            '8eba023',
            'f8d72ba'
        ]
    }),
    pluginsLoaded: () => ({
        type: types.PLUGINS_DID_LOAD
    })
}

export const epics = combineEpics(...[

    (action) => action.ofType(types.PLUGINS_WILL_LOAD)
        .mapTo(actions.pluginsGetList()),

    (action) => action.ofType(types.PLUGINS_GET_LIST)
        .mapTo(actions.pluginsSuccess()),

    (action) => action.ofType(types.PLUGINS_SUCCESS)
        .mapTo(actions.pluginsLoaded())
])

export function reducer(state = List([]), action) {

    switch (action.type) {
        case types.PLUGINS_SUCCESS:
            return pluginsSuccess(state, action);
        default:
            return state
    }
}

const pluginsSuccess = (state, action) => {
    console.log('Should actions.pluginsLoaded() here ...');
    return state;
}
