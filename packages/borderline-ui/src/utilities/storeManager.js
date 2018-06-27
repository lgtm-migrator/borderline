import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { BehaviorSubject } from 'rxjs';
import { mergeMap, mapTo } from 'rxjs/operators';
import { Map } from 'immutable';
import createHistory from 'history/createBrowserHistory';
import ParentTracer from 'containers/ParentTracer';

class StoreManager {

    constructor() {

        this.configure();
    }

    setDefaults() {

        this.asyncReducers = {
            default: (state = Map({})) => state
        };
        this.asyncEpics = {
            default: (action) => action.ofType('@@NULL').pipe(mapTo({ type: '@@TERMINATED' }))
        };
    }

    clearRootEpics() {

        this.behaviourEpic = new BehaviorSubject(...Object.values(this.asyncEpics));
        this.rootEpic = (action, store) => this.behaviourEpic.pipe(mergeMap(epic => epic(action, store)));
    }

    configure() {

        this.setDefaults();
        this.clearRootEpics();

        history = createHistory();

        this.middleware = {
            router: routerMiddleware(history),
            epic: createEpicMiddleware()
        };

        let mutateCompose = compose;
        if (process.env.NODE_ENV === 'development') {

            this.middleware = Object.assign(this.middleware, {
                logger: createLogger({
                    duration: true,
                    collapsed: true,
                    stateTransformer: (state) => {
                        let future = {};
                        for (let name in state) {
                            future[name] = state[name] !== undefined && state[name].toJS instanceof Function ? state[name].toJS() : state[name];
                        }
                        return future;
                    }
                })
            });

            mutateCompose = typeof window === 'object' &&
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                    name: 'Borderline',
                    stateSanitizer: (state) => {
                        let future = {};
                        for (let name in state) {
                            future[name] = state[name] && state[name].toJS !== undefined ? state[name].toJS() : state[name];
                        }
                        return future;
                    }
                }) : compose;

        }

        store = createStore(connectRouter(history)(combineReducers(this.asyncReducers)), mutateCompose(applyMiddleware(...Object.values(this.middleware))));
        this.middleware.epic.run(this.rootEpic);

    }

    injectAsyncReducer(modelName, asyncReducer) {
        this.asyncReducers[modelName] = asyncReducer;
        store.replaceReducer(connectRouter(history)(combineReducers(this.asyncReducers)));
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
