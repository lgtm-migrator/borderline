import { Component } from 'react';
import { epics, reducers } from './flux';

class Transmart extends Component {

    // Custom name for container
    static displayName = 'Transmart';

    // Custom properties for borderline model
    static modelName = 'transmart';
    static modelEpics = epics;
    static modelReducers = reducers;

    render() {
        return null;
    }
}

export default Transmart;
