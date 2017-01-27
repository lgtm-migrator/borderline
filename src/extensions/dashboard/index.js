/* global borderline:true */
import { mainReducer } from './reducers';

class DashboardPlugin {

    invocation() {
        borderline.registerReducer('mainReducer', mainReducer);
    }
}

export default DashboardPlugin;
