import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';

import TopBar from '../components/TopBarComponent';

class TopBarContainer extends Component {

    render() {
        return (
            <TopBar status={this.props.status} />
        );
    }
}

const mapStateToProps = function (store) {
    return {
        status: store.statusState
    };
}

const result = connect(mapStateToProps)(TopBarContainer);
result.child = TopBarContainer.name;

export default result;
