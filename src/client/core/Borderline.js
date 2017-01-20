import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router'
import { connect } from 'react-redux';

// We import plugin action as we need to use them upon component mount
import { actions as subAppsManager } from './flux/subapps'

// We import the children component
import Body from './containers/BodyContainer';
import TopBar from './containers/TopBarContainer';
import ContentBox from './containers/ContentBoxContainer';
import StatusBar from './containers/StatusBarContainer';

// Declaraction of the Borderline class
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
                    <TopBar />
                    <ContentBox />
                    <StatusBar />
                </Body>
            </Router>
        )
    }
}

// We connect this component to the redux store and export it
export default connect()(Borderline);
