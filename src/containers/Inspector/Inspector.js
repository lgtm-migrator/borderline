import React, { Component } from 'react'
import { reducers, epics } from './flux'
import Injector from './containers/Injector'

class Inspector extends Component {

    // Custom name for container
    static displayName = 'Inspector';

    // Custom properties for borderline model
    static modelName = 'inspector';
    static modelEpics = epics;
    static modelReducers = reducers;

    render() {
        return <Injector />
    }
}

export default Inspector
