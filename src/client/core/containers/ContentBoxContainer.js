import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';

import ContentBox from '../components/ContentBoxComponent';

class ContentBoxContainer extends Component {

    render() {
        return (
            <ContentBox status={this.props.status} />
        );
    }
}

const mapStateToProps = function (store) {
    return {
        status: store.statusState
    };
}

const result = connect(mapStateToProps)(ContentBoxContainer);
result.child = ContentBoxContainer.name;

export default result;
