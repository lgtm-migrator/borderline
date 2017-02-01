/* globalborderline:true */
import { dashboardReducers } from './reducers';
import { dashboardEpics } from './epics';

// import DashboardContainer from './DashboardContainer';

class DashboardPlugin {

    identity() {
        return '0000-00-001';
    }

    invocation() {
        // console.log('Probing DashboardPlugin'); // eslint-disable-line no-console
        this.declareReducers(dashboardReducers);
        this.declareEpics(dashboardEpics);
        this.declareEpics(dashboardEpics);
        this.declareLocation();
        this.declareBinding();
    }
}

export default DashboardPlugin;
