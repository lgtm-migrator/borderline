import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router'

// Get decorator
import StoreConnectable from './decorators/StoreConnectable';

// We import the children component
import Body from './containers/BodyContainer';
import TopBar from './containers/TopBarContainer';
import ContentBox from './containers/ContentBoxContainer';
import StatusBar from './containers/StatusBarContainer';

// We import plugin action as we need to use them upon component mount
import { actions as subAppsManager } from './flux/subapps'

// Declaraction of the Borderline class
@StoreConnectable()
class Borderline extends Component {


    componentDidMount() {
        this.loadSubApps();
    }

    componentDidUpdate() {
        this.loadSubApps();
    }

    loadSubApps() {
        // After the component has updated we load the plugins
        this.props.dispatch(subAppsManager.loadSubApps());
    }

    // Here we do the top level rendering of our application
    render() {
        return (
            <Router>
                <Body>
                    <ContentBox />
                    <TopBar />
                    <StatusBar />
                </Body>
            </Router>
        )
    }
}

// We connect this component to the redux store and export it
export default Borderline;
