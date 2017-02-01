/* global borderline:true */
import { storylineReducers } from './reducers';
import { storylineEpics } from './epics';

class StoryLinePlugin {

    invocation_() {
        // console.log('Probing DashboardPlugin'); // eslint-disable-line no-console
        borderline.registerReducers(storylineReducers);
        borderline.registerEpics(storylineEpics);
    }
}

export default StoryLinePlugin;
