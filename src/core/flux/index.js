import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import React from 'react';

// We import the plugin managnment flux defitions
import { anchor as subAppsName, epics as subAppsEpics, reducer as subAppsReducer } from './subapps';
import { anchor as statusBarName, reducer as statusBarReducer } from './statusbar';

// This collapses the list of epics across the borad in a single epic
export function createEpics(asyncEpics = {}) {
    return combineEpics(
        subAppsEpics,
        ...asyncEpics
    );
};

// This collapses the list of reducers binding it to each sub-store
export function createReducers(asyncReducers = {}) {
    let catalog = {}
    catalog[subAppsName] = subAppsReducer
    catalog[statusBarName] = statusBarReducer
    Object.assign(catalog, asyncReducers)
    return combineReducers(catalog);
};
