import { Component } from 'react';
import { epics } from './flux';

class Info extends Component {

    // Custom name for container
    static displayName = 'DemoAnalysis';

    // Custom properties for borderline model
    static modelName = 'info';
    static modelEpics = epics;

    render() {
        return null;
    }
}

export default Info;
