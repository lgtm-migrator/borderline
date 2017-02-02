import coreReducers from './reducers';
import coreEpics from './epics';
import coreActions from './actions';

class CoreFluxPlugin {

    identity() {
        return 'inspector';
    }

    invocation() {
        this.declareReducers(coreReducers);
        this.declareEpics(coreEpics);
    }
}

export default CoreFluxPlugin;
export const coreFluxPluginActions = coreActions;
