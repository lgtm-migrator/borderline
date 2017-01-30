import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import createLogger from 'redux-logger';
// import { connect } from 'react-redux';

import { Map } from 'immutable';

class StoreManager {

    constructor() {
        this.asyncEpics = {
            default: (action) => action.ofType('@@NULL').mapTo({ type: '@@TERMINATED' })
        };
        this.asyncReducers = {
            default: (state = Map({})) => state
        };
        this.behaviourEpic = new BehaviorSubject(...Object.values(this.asyncEpics));
        this.rootEpic = null;
        this.configureStore();
    }

    configureStore() {

        this.rootEpic = (action, store) =>
            this.behaviourEpic.mergeMap(epic =>
                epic(action, store)
            );

        this.epicMiddleware = createEpicMiddleware(this.rootEpic);
        if (process.env.NODE_ENV === 'development')
            this.enhancer = applyMiddleware(this.epicMiddleware, createLogger({
                duration: true,
                collapsed: true,
                stateTransformer: (state) => {
                    let future = {};
                    for (var name in state) {
                        future[name] = state[name].toJS ? state[name].toJS() : state[name];
                    }
                    return future;
                }
            }));
        else
            this.enhancer = applyMiddleware(this.epicMiddleware);
        this.store = createStore(combineReducers(this.asyncReducers), {}, this.enhancer);
    }

    injectAsyncReducer(name, asyncReducer) {
        this.asyncReducers[name] = asyncReducer;
        this.store.replaceReducer(combineReducers(this.asyncReducers));
    }

    injectAsyncEpic = (name, asyncEpic) => {
        this.asyncEpics[name] = asyncEpic;
        this.behaviourEpic.next(asyncEpic);
    }

    synchronise() {
        this.behaviourEpic = new BehaviorSubject(...Object.values(this.asyncEpics));
        this.epicMiddleware.replaceEpic(this.rootEpic);
        this.store.replaceReducer(combineReducers(this.asyncReducers));
    }

    dispatch(action) {
        this.store.dispatch(action);
    }

    getStore() {
        return this.store;
    }

    // retrieve(states, mapping) {
    //     console.log(states); // eslint-disable-line no-console
    //     return (function (target) {
    //         return connect(mapping)(target);
    //     });
    // }
}

const storeManager = new StoreManager();
export default storeManager;
