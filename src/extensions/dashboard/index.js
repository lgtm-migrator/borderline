/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import dashboardReducers from './reducers';
import dashboardEpics from './epics';

class DashboardPlugin {

    identity() {
        return '0000-00-001';
    }

    invocation() {
        this.declareReducers(dashboardReducers);
        this.declareEpics(dashboardEpics);
    }
}

export default DashboardPlugin;
