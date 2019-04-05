import { Component } from 'react';
import { epics, reducers } from './flux';

class File extends Component {

    // Custom name for container
    static displayName = 'File';

    // Custom properties for borderline model
    static modelName = 'file';
    static modelEpics = epics;
    static modelReducers = reducers;

    render() {
        return null;
    }
}

export default File;
