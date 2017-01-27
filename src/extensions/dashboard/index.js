/* global borderline:true */
import { mainReducer } from './reducers';

class DashboardPlugin {

    invocation() {
        borderline.registerReducer(mainReducer);
    }
}

export default DashboardPlugin;
