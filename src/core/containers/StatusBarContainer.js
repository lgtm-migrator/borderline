import React, { Component } from 'react';

import StoreConnectable from '../decorators/StoreConnectable'
import StatusBar from '../components/StatusBarComponent';

@StoreConnectable(store => ({
    status: store.statusState
}))
class StatusBarContainer extends Component {

    render() {
        return (
            <StatusBar status={this.props.status} />
        );
    }
}

export default StatusBarContainer;
