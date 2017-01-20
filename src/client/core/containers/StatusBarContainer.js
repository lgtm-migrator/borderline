import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';

import StatusBar from '../components/StatusBarComponent';

class StatusBarContainer extends Component {

    render() {
        return (
            <StatusBar status={this.props.status} />
        );
    }
}

const mapStateToProps = function (store) {
    return {
        status: store.statusState
    };
}

const result = connect(mapStateToProps)(StatusBarContainer);
result.child = StatusBarContainer.name;

export default result;
