/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { Observable } from 'rxjs';
import Immutable, { Map } from 'immutable';
import inspectorTypes from './types';
import systemExtensions from '../../../../extensions';

export default {
    extensionReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case inspectorTypes.EXTENSIONS_SUCCESS:
                return extensionsSuccess(state, action);
            case inspectorTypes.EXTENSIONS_DID_LOAD:
                return extensionsDidLoad(state);
            case inspectorTypes.EXTENSION_UNIT_SUCCESS:
                return extensionUnitSuccess(state, action);
            default:
                return state;
        }
    }
};

const extensionsSuccess = (state, action) => {
    let future = state.toJS();
    future.list = future.list || {};
    Observable.from(action.list).map(extension =>
        future.list[extension.id] = {
            loaded: false
        }
    ).subscribe();
    let count = 0;
    Observable.from(systemExtensions).map(seed =>
        future.list[`__system__${count++}`] = {
            seed: seed,
            loaded: true
        }
    ).subscribe();
    return Immutable.fromJS(future);
};


const extensionsDidLoad = (state) => {
    let future = state.toJS();
    future.ok = true;
    return Immutable.fromJS(future);
};

const extensionUnitSuccess = (state, action) => {
    let future = state.toJS();
    future.list[action.extension.id].seed = () => {};
    future.list[action.extension.id].loaded = true;
    return Immutable.fromJS(future);
};
