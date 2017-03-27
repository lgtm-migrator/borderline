/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { connect } from 'react-redux';
import { createLogger } from 'redux-logger';

import { Map } from 'immutable';

const storeResetSequence = '@@core/store/RESET';

class StoreManager {

    constructor() {
        this.rootEpic = null;
        this.setDefaults();
        this.configureStore();
    }

    setDefaults() {
        this.asyncEpics = {
            default: (action) => action.ofType('@@NULL').mapTo({ type: '@@TERMINATED' })
        };
        this.asyncReducers = {
            default: (state = Map({})) => state
        };
        this.behaviourEpic = new BehaviorSubject(...Object.values(this.asyncEpics));
        this.rootEpic = (action, store) =>
            this.behaviourEpic.mergeMap(epic =>
                epic(action, store)
            );
    }

    recreate() {

        if (process.env.NODE_ENV === 'production')
            throw 'Store Recreation should not be used at production runtime';
        this.dispatch({ type: storeResetSequence });
        this.setDefaults();
        try {
            this.store.replaceReducer(combineReducers(this.asyncReducers));
            this.epicMiddleware.replaceEpic(this.rootEpic);
        } catch (e) {
            console.info('Reseting application status at runtime may cause side effects ...'); // eslint-disable-line no-console
        }
    }

    configureStore() {

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
        this.asyncReducers[name] = (state, action) => {
            if (action.type === storeResetSequence)
                return asyncReducer(undefined, action);
            return asyncReducer(state, action);
        };
        this.store.replaceReducer(combineReducers(this.asyncReducers));
    }

    injectAsyncEpic = (name, asyncEpic) => {
        this.asyncEpics[name] = asyncEpic;
        this.behaviourEpic.next(asyncEpic);
    }

    dispatch(action) {
        if (action.type.match(/@@.*?\/.*?\/.*/g) === null)
            if (process.env.NODE_ENV === 'production')
                return;
            else
                console.warn('Action must be tagged before being dispatched. Maybe you forgot to use dispatchProxy'); // eslint-disable-line no-console
        this.store.dispatch(action);
    }

    getStore() {
        return this.store;
    }
}

export default new StoreManager();
export const stateAware = () => {
    return (target) => {
        return connect(state => {
            return { state: state };
        }, () => ({}))(target);
    };
};
