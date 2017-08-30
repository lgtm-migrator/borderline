import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { BehaviorSubject } from 'rxjs';
import { Map } from 'immutable';
import createHistory from 'history/createBrowserHistory';
import ParentTracer from 'containers/ParentTracer';

class StoreManager {

    constructor() {

        this.configure();
    }

    setDefaults() {

        this.asyncReducers = {
            default: (state = Map({})) => state,
            router: routerReducer
        };
        this.asyncEpics = {
            default: (action) => action.ofType('@@NULL').mapTo({ type: '@@TERMINATED' })
        };
    }

    clearRootEpics() {

        this.behaviourEpic = new BehaviorSubject(...Object.values(this.asyncEpics));
        this.rootEpic = (action, store) => this.behaviourEpic.mergeMap(epic => epic(action, store));
    }

    configure() {

        this.setDefaults();
        this.clearRootEpics();

        history = createHistory();

        this.middleware = {
            logger: createLogger({
                duration: true,
                collapsed: true,
                stateTransformer: (state) => {
                    let future = {};
                    for (var name in state) {
                        future[name] = state[name] !== undefined && state[name].toJS instanceof Function ? state[name].toJS() : state[name];
                    }
                    return future;
                }
            }),
            router: routerMiddleware(history),
            epic: createEpicMiddleware(this.rootEpic)
        };

        let mutateCompose = compose;
        if (process.env.NODE_ENV === 'development') {

            mutateCompose = typeof window === 'object' &&
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                    name: 'Borderline',
                    stateSanitizer: (state) => {
                        let future = {};
                        for (var name in state) {
                            future[name] = state[name] && state[name].toJS !== undefined ? state[name].toJS() : state[name];
                        }
                        return future;
                    }
                }) : compose;

        }

        store = createStore(combineReducers(this.asyncReducers), {}, mutateCompose(applyMiddleware(...Object.values(this.middleware))));

    }

    injectAsyncReducer(modelName, asyncReducer) {
        this.asyncReducers[modelName] = asyncReducer;
        store.replaceReducer(combineReducers(this.asyncReducers));
    }

    injectAsyncEpic = (modelName, asyncEpic) => {
        if (this.asyncEpics[modelName] === undefined) {
            this.asyncEpics[modelName] = asyncEpic;
            this.behaviourEpic.next(asyncEpic);
        }
    }

}

export let store = null;
export let history = null;
export const stateAware = (mapStateToProps) =>
    (target) =>
        (props) =>
            <ParentTracer {...props} tracedComponent={target} mapStateToProps={mapStateToProps} />;

export default new StoreManager();
