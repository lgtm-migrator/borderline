import { Component } from 'react';
import { epics } from './flux';

class Theme extends Component {

    // Custom name for container
    static displayName = 'Theme';

    // Custom properties for borderline model
    static modelName = 'theme';
    static modelEpics = epics;

    render() {
        return null;
    }
}

export default Theme;
