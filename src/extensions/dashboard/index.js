/* global borderline:true */
import { mainReducer } from './reducers';
import { mainEpic } from './epics';

import DashboardContainer from './DashboardContainer';

class DashboardPlugin {

    invocation() {
        borderline.registerReducer('mainReducer', mainReducer);
        borderline.registerEpic('mainEpic', mainEpic);
        borderline.dispatch({
            type: '@@borderline/ATTACH_SUBAPP',
            component: DashboardContainer
        });
    }
}

export default DashboardPlugin;
