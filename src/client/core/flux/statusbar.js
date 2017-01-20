import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import Immutable, { Map, List } from 'immutable';

import { types as subAppsTypes } from './subapps';

// This is the state pointer name for subapps
export const anchor = 'statusState';

// These are the types of flux for the plugin manager
export const types = {};

// Here are the actionator available for the plugin managment flux
export const actions = {};

// These are event epics for redux observable
export const epics = null;

// Here we find our state reducers
export function reducer(state = '', action) {

    switch (action.type) {
        case subAppsTypes.SUBAPPS_WILL_LOAD:
            return "Preparing to load sub-applications ...";
        case subAppsTypes.SUBAPPS_SUCCESS:
            return `Found ${action.list.lenght} to load.`;
        case subAppsTypes.SUBAPPS_DID_LOAD:
            return "All sub-applications loaded.";
        case subAppsTypes.SINGLE_SUBAPP_LOAD:
            return `Loading sub-application ${action.id} ...`;
        default:
            return state
    }
}
