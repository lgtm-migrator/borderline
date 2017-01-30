import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

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
        pluginInspector.discover();
    }

    componentDidUpdate() {
        pluginInspector.discover();
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

if (module.hot) {
    module.hot.accept('./utilities/PluginInspector', () => {
        console.info('The pluginManager was reloaded'); // eslint-disable-line no-console
    });
}

// We connect this component to the redux store and export it
export default Borderline;
