import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router'
import { connect } from 'react-redux';

// We import plugin action as we need to use them upon component mount
import { actions as pluginActions } from './flux/plugins'

// We import the children component
import MainMenu from './containers/MainMenuContainer';

// Declaraction of the Borderline class
class Borderline extends Component {

    componentDidMount() {
        // After the component has mounted we load the plugins
        this.props.dispatch(pluginActions.loadPlugins());
    }

    // Here we do the top level rendering of our application
    render() {
        return (
            <Router>
                <div>
                    <MainMenu />
                </div>
            </Router>
        )
    }
}

// We connect this component to the redux store and export it
export default connect()(Borderline);
