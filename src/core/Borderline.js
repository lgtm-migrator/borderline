import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// We import the plugin manager
import lifecycleManager from './utilities/LifecycleManager';

// We import the children component
import Body from './containers/BodyContainer';
import TopBar from './containers/TopBarContainer';
import LoginBox from './containers/LoginContainer';
import ContentBox from './containers/ContentBoxContainer';
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
                    <TopBar />
                    <StatusBar />
                    <LoginBox />
                </Body>
            </Router>
        );
    }
}

if (module.hot) {
    module.hot.accept('./utilities/LifecycleManager', () => {
        console.info('An Extension Manager or a child dependency was modified! Resetting...'); // eslint-disable-line no-console
        var HotLifecycleManager = require('./utilities/LifecycleManager').default;
        HotLifecycleManager.rediscover();
    });
}

// We connect this component to the redux store and export it
export default Borderline;
