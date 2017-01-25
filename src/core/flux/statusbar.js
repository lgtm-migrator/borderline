import { types as subAppsTypes } from './subapps';

// This is the state pointer name for status
export const anchor = 'statusState';

// Here we find our state reducers
export function reducer(state = '', action) {

    switch (action.type) {
        case subAppsTypes.SUBAPPS_WILL_LOAD:
            return 'Preparing to load sub-applications ...';
        case subAppsTypes.SUBAPPS_SUCCESS:
            return `Found ${action.list.lenght} to load.`;
        case subAppsTypes.SUBAPPS_DID_LOAD:
            return 'All sub-applications loaded.';
        case subAppsTypes.SINGLE_SUBAPP_LOAD:
            return `Loading sub-application ${action.id} ...`;
        case '@@redux-observable/EPIC_END':
            return 'Epic processing chain interrupted !';
        default:
            return state;
    }
}
