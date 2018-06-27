import React, { Component } from 'react';
import { default as T } from 'prop-types';

class View extends Component {

    // Custom name for container
    static displayName = 'View';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        this.context.dispatch({
            type: '@@core/session/SESSION_LOGOUT'
        });
    }

    render() {
        return <div>We are loging you out, bear with us a moment ...</div>;
    }
}

export default View;
