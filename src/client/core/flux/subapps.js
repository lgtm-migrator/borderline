import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { List } from 'immutable';

// These are the types of flux for the plugin manager
export const types = {
    SUBAPPS_WILL_LOAD: '@@core/extension/SUBAPPS_WILL_LOAD',
    SUBAPPS_DID_LOAD: '@@core/extension/SUBAPPS_DID_LOAD',
    SUBAPPS_LISTING: '@@core/extension/SUBAPPS_LISTING',
    SUBAPPS_SUCCESS: '@@core/extension/SUBAPPS_SUCCESS',
    SINGLE_SUBAPP_LOAD: '@@core/extension/SINGLE_SUBAPP_LOAD',
    SINGLE_SUBAPP_SUCCESS: '@@core/extension/SINGLE_SUBAPP_SUCCESS',
    SINGLE_SUBAPP_DID_LOAD: '@@core/extension/SINGLE_SUBAPP_DID_LOAD',
};

// Here are the actionator available for the plugin managment flux
export const actions = {

    loadSubApps: () => ({
        type: types.SUBAPPS_WILL_LOAD
    }),

    subAppsListing: () => ({
        type: types.SUBAPPS_LISTING
    }),

    subAppsSuccess: (list) => ({
        type: types.SUBAPPS_SUCCESS,
        list: list
    }),

    subAppsLoaded: () => ({
        type: types.SUBAPPS_DID_LOAD
    }),

    loadSingleSubApp: (id) => ({
        type: types.SINGLE_SUBAPP_LOAD,
        id: id
    }),

    singleSubAppSucces: (id, subapp) => ({
        type: types.SINGLE_SUBAPP_SUCCESS,
        id: id,
        subapp: subapp
    }),

    singleSubAppLoaded: (id) => ({
        type: types.SINGLE_SUBAPP_DID_LOAD,
        id: id
    }),
}

// These are event epics for redux observable
export const epics = combineEpics(...[

    (action) => action.ofType(types.SUBAPPS_WILL_LOAD)
        .mapTo(actions.subAppsListing()),

    (action) => action.ofType(types.SUBAPPS_LISTING)
        .mergeMap(action =>
            Observable.from(fetch(`https://api.github.com/users/fguitton`)
                .then(response => response.json()))
                .map(response => actions.subAppsSuccess(/*response*/[
                    '8eba023',
                    'f8d72ba'
                ]))
        ),

    (action) => action.ofType(types.SUBAPPS_SUCCESS)
        .mergeMap(action =>
            Observable.concat(
                Observable.from(action.list).map(id =>
                    actions.loadSingleSubApp(id)
                ),
                Observable.of(actions.subAppsLoaded())
            )
        ),

    (action) => action.ofType(types.SINGLE_SUBAPP_LOAD)
        .mergeMap(action =>
            Observable.from(fetch(`https://api.github.com/users/tezirg`)
                .then(response => response.json()))
                .map(response => actions.singleSubAppSucces(action.id, response))
        ),

    (action) => action.ofType(types.SINGLE_SUBAPP_SUCCESS)
        .mapTo(actions.singleSubAppLoaded()),
])

// Here we find our state reducers
export function reducer(state = List([]), action) {

    switch (action.type) {
        case types.SUBAPPS_DID_LOAD:
            return subAppsSuccess(state, action);
        case types.SINGLE_SUBAPP_SUCCESS:
            return singleSubAppsSuccess(state, action);
        default:
            return state
    }
}

const subAppsSuccess = (state, action) => {
    console.log(`All Subapps loaded ... but actually not yet ... bloody observables !`);
    return state;
}

const singleSubAppsSuccess = (state, action) => {
    console.log(`Subapp ${action.id} loaded with content`, action.subapp);
    return state;
}
