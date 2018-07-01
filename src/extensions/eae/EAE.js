import { Component } from 'react';
import { epics, reducers } from './flux';

class EAE extends Component {

    // Custom name for container
    static displayName = 'EAE';

    // Custom properties for borderline model
    static modelName = 'eae';
    static modelEpics = epics;
    static modelReducers = reducers;

    render() {
        return null;
    }
}

export default EAE;
