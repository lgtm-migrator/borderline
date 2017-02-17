import storeEpics from './epics';

class StorePlugin {

    identity() {
        return '0000-00-002';
    }

    invocation() {
        this.declareEpics(storeEpics);
    }
}

export default StorePlugin;
