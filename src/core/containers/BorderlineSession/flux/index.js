/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import sessionReducers from './reducers';
import sessionEpics from './epics';

export default class SessionExtension {

    identity() {
        return 'session';
    }

    invocation() {
        this.declareReducers(sessionReducers);
        this.declareEpics(sessionEpics);
    }
}
