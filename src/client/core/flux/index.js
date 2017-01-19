import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import React from 'react';

// We import the plugin managnment flux defitions
import { epics as pluginsEpics, reducer as pluginsReducer } from './plugins';

// This collapses the list of epics across the borad in a single epic
export function createEpics(asyncEpics = []) {
    return combineEpics(
        pluginsEpics,
        ...asyncEpics
    );
};

// This collapses the list of reducers binding it to each sub-store
export function createReducers(asyncReducers = []) {
    return combineReducers({
        pluginsState: pluginsReducer,
        ...asyncReducers
    });
};
