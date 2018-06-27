import { Component } from 'react';
import { epics } from './flux';

class Magnifier extends Component {

    // Custom name for container
    static displayName = 'Magnifierrmation';

    // Custom properties for borderline model
    static modelName = 'info';
    static modelEpics = epics;

    render() {
        return null;
    }
}

export default Magnifier;
