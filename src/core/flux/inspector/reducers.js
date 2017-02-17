import { Observable } from 'rxjs';
import Immutable, { Map } from 'immutable';
import inspectorTypes from './types';

export default {
    extensionReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case inspectorTypes.EXTENSIONS_SUCCESS:
                return extensionsSuccess(state, action);
            case inspectorTypes.EXTENSION_UNIT_SUCCESS:
                return extensionUnitSuccess(state, action);
            default:
                return state;
        }
    }
};

const extensionsSuccess = (state, action) => {
    let future = state.toJS();
    future.extensions = future.extensions || {};
    Observable.from(action.list).map(id =>
        future.extensions[id] = {
            loaded: false
        }
    ).subscribe();
    return Immutable.fromJS(future);
};

const extensionUnitSuccess = (state, action) => {
    let future = state.toJS();
    future.extensions[action.id].module = action.subapp;
    future.extensions[action.id].loaded = true;
    return Immutable.fromJS(future);
};
