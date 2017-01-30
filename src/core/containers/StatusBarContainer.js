import React, { Component } from 'react';

import StatusBar from '../components/StatusBarComponent';

class StatusBarContainer extends Component {

    render() {
        return (
            <StatusBar status={this.props.status} />
        );
    }
}

export default StatusBarContainer;
