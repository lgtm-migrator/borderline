import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createEpics, createReducers } from '../flux';
import createLogger from 'redux-logger';

// This function will take care of creating our central redux store
function configureStore(initialState = {}) {

    // This function creates the epicMiddleware
    const epicMiddleware = createEpicMiddleware(createEpics());

    // This function creates the store
    const store = createStore(createReducers(), initialState, applyMiddleware(epicMiddleware, createLogger()));

    // We declare an array that will contain all post-build epics
    // We creacte a function that will inject those epics in the current epicMiddleware
    store.asyncEpics = {};
    store.injectAsyncEpic = (name, asyncEpic) => {
        store.asyncEpics[name] = asyncEpic;
        epicMiddleware.replaceEpic(createEpics(store.asyncEpics));
    }

    // We declare an array that will contain all post-build reducers
    // We creacte a function that will inject those reducers in the current store
    store.asyncReducers = {};
    store.injectAsyncReducer = (name, asyncReducer) => {
        store.asyncReducers[name] = asyncReducer;
        store.replaceReducer(createReducers(store.asyncReducers));
    }

    // In case we are doing hot reloading
    if (module.hot) {

        // Upon hot reload we fetch a new instance of epics,actions and reducers and refresh the store
        module.hot.accept('../flux', () => {
            const hotFlux = require('../flux');
            const hotEpics = hotFlux.createEpics;
            const hotReducers = hotFlux.createReducers;
            epicMiddleware.replaceEpic(hotEpics(store.asyncEpics));
            store.replaceReducer(hotReducers(store.asyncReducers));
        });
    }

    return store;
}

const store = configureStore();
export default store;
