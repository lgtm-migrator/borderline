import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router';

// We import the plugin manager
import pluginInspector from './utilities/PluginInspector';

// We import the children component
import Body from './containers/BodyContainer';
import TopBar from './containers/TopBarContainer';
import ContentBox from './containers/ContentBoxContainer';
import StatusBar from './containers/StatusBarContainer';

// Declaraction of the Borderline class
class Borderline extends Component {

    componentDidMount() {
    }

    componentDidUpdate() {
        pluginInspector.refreshExtensions();
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
        );
    }
}

// We connect this component to the redux store and export it
export default Borderline;
