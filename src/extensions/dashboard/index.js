/* global borderline:true */
// import { mainReducer } from './reducers';
import { mainEpic } from './epics';

// import DashboardContainer from './DashboardContainer';

class DashboardPlugin {

    invocation() {
        // console.log('Probing DashboardPlugin'); // eslint-disable-line no-console
        // borderline.registerReducer('mainReducer', mainReducer);
        borderline.registerEpics(mainEpic);
    }

    invoke() {
        // borderline.dispatch({
        //     type: '@@borderline/ATTACH_SUBAPP',
        //     component: DashboardContainer
        // });
    }
}

export default DashboardPlugin;
