/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import inspectorReducers from './reducers';
import inspectorEpics from './epics';

class InspectorPlugin {

    identity() {
        return 'inspector';
    }

    invocation() {
        this.declareReducers(inspectorReducers);
        this.declareEpics(inspectorEpics);
    }
}

export default InspectorPlugin;
