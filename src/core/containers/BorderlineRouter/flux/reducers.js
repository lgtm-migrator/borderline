/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import Immutable, { Map } from 'immutable';
import routerTypes from './types';

export default {
    extensionReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case routerTypes.LOCATION_CHANGE:
                return extensionsSuccess(state, action);
            default:
                return state;
        }
    }
};

const extensionsSuccess = (state, action) => {
    let future = state.toJS();
    future.location = action.location;
    return Immutable.fromJS(future);
};
