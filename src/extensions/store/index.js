/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import storeEpics from './epics';

class StorePlugin {

    identity() {
        return '0000-00-002';
    }

    invocation() {
        this.declareEpics(storeEpics);
    }
}

export default StorePlugin;
