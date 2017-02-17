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
