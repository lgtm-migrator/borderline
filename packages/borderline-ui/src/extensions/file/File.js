import { Component } from 'react';
import { epics } from './flux';

class File extends Component {

    // Custom name for container
    static displayName = 'File';

    // Custom properties for borderline model
    static modelName = 'file';
    static modelEpics = epics;

    render() {
        return null;
    }
}

export default File;
