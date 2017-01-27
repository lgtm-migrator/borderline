import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import Immutable, { Map } from 'immutable';

// This is the state pointer name for subapps
export const anchor = 'subAppsState';

// These are the types of flux for the plugin manager
export const types = {
    SUBAPPS_WILL_LOAD: '@@core/extension/SUBAPPS_WILL_LOAD',
    SUBAPPS_DID_LOAD: '@@core/extension/SUBAPPS_DID_LOAD',
    SUBAPPS_LISTING: '@@core/extension/SUBAPPS_LISTING',
    SUBAPPS_SUCCESS: '@@core/extension/SUBAPPS_SUCCESS',
    SINGLE_SUBAPP_LOAD: '@@core/extension/SINGLE_SUBAPP_LOAD',
    SINGLE_SUBAPP_SUCCESS: '@@core/extension/SINGLE_SUBAPP_SUCCESS',
    SINGLE_SUBAPP_DID_LOAD: '@@core/extension/SINGLE_SUBAPP_DID_LOAD',
    SINGLE_SUBAPP_CORRUPT: '@@core/extension/SINGLE_SUBAPP_CORRUPT',
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

    singleSubAppCorrupted: (name) => ({
        type: types.SINGLE_SUBAPP_CORRUPT,
        name: name
    }),
};

// These are event epics for redux observable
export const epics = combineEpics(...[

    (action) => action.ofType(types.SUBAPPS_WILL_LOAD)
        .mapTo(actions.subAppsListing()),

    (action) => action.ofType(types.SUBAPPS_LISTING)
        .mergeMap(() =>
            // Observable.from(fetch('/plugin_store')
            //     .then(response => response.json()))
            //     .map(response => actions.subAppsSuccess(response))
            Observable.of(actions.subAppsSuccess([]))
        ),

    (action) => action.ofType(types.SUBAPPS_SUCCESS)
        .mergeMap(action =>
            Observable.from(action.list).defaultIfEmpty(null).map(id =>
                id === null ? actions.subAppsLoaded() : actions.loadSingleSubApp(id)
            )
        ),

    (action) => action.ofType(types.SINGLE_SUBAPP_LOAD)
        .mergeMap(action =>
            // Observable.from(fetch('/plugin')
            //     .then(response => response.json()))
            //     .map(response => actions.singleSubAppSucces(action.id, response))
            Observable.of(actions.singleSubAppSucces(action.id, {}))
        ),

    (action, store) => action.ofType(types.SINGLE_SUBAPP_SUCCESS)
        .mergeMap(action =>
            Observable.concat(
                Observable.of(actions.singleSubAppLoaded(action.id)),
                Observable.from(Object.values(store.getState(anchor)[anchor].toJS().subapps))
                    .every(subapp => subapp.loaded === true)
                    .filter(loaded => loaded === true)
                    .mapTo(actions.subAppsLoaded())
            )
        ),

]);

// Here we find our state reducers
export function reducer(state = Map([]), action) {

    switch (action.type) {
        case types.SUBAPPS_SUCCESS:
            return subAppsSuccess(state, action);
        case types.SINGLE_SUBAPP_SUCCESS:
            return singleSubAppsSuccess(state, action);
        default:
            return state;
    }
}

const subAppsSuccess = (state, action) => {
    let future = state.toJS();
    future.subapps = future.subapps || {};
    Observable.from(action.list).map(id =>
        future.subapps[id] = {
            loaded: false
        }
    ).subscribe();
    return Immutable.fromJS(future);
};

const singleSubAppsSuccess = (state, action) => {
    let future = state.toJS();
    future.subapps[action.id].module = action.subapp;
    future.subapps[action.id].loaded = true;
    return Immutable.fromJS(future);
};
