import { Component } from 'react';
import { epics } from './flux';

class Dashboard extends Component {

    // Custom name for container
    static displayName = 'Dashboard';

    // Custom properties for borderline model
    static modelName = 'dashboard';
    static modelEpics = epics;

    render() {
        return null;
    }
}

export default Dashboard;
