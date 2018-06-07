import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { epics } from './flux';

class Dashboard extends Component {

    // Custom name for container
    static displayName = 'Dashboard';

    // Custom properties for borderline model
    static modelName = 'dashboard';
    static modelEpics = epics;

    render() {
        return (
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
        );
    }
}

export default Dashboard;
