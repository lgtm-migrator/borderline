import sessionReducers from './reducers';
import sessionEpics from './epics';

class SessionPlugin {

    identity() {
        return 'session';
    }

    invocation() {
        this.declareReducers(sessionReducers);
        this.declareEpics(sessionEpics);
    }
}

export default SessionPlugin;
