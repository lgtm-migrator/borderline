import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { dispatchProxy } from './utilities/PluginContext';

// We import the plugin manager
import lifecycleManager from './utilities/LifecycleManager';

// We import the children component
import Body from './containers/BodyContainer';
import LoginBox from './containers/LoginContainer';
import ContentBox from './containers/ContentBoxContainer';
import MainNavigation from './containers/MainNavigation';
import StatusBar from './containers/StatusBarContainer';

// Declaraction of the Borderline class
class Borderline extends Component {

    componentDidMount() {
        lifecycleManager.discover();
    }

    componentDidUpdate() {
        lifecycleManager.discover();
    }

    // Here we do the top level rendering of our application
    render() {
        return (
            <Router>
                <Body>
                    <ContentBox />
                    <MainNavigation />
                    <StatusBar />
                    <LoginBox dispatch={dispatchProxy('session', 'core')} />
                </Body>
            </Router>
        );
    }
}

if (module.hot) {
    module.hot.accept('./utilities/LifecycleManager', () => {
        console.info('An Extension Manager or a child dependency was modified! Resetting...'); // eslint-disable-line no-console
        var hotLifecycleManager = require('./utilities/LifecycleManager').default;
        hotLifecycleManager.rediscover();
    });
}

// We connect this component to the redux store and export it
export default Borderline;
