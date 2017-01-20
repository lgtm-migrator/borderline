import React, { Component, Children } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';

import layout from '../styles/layout.css';

class BodyContainer extends Component {

    componentDidMount() {
        document.getElementsByTagName('html')[0].classList.add(layout.reset)
        document.body.classList.add(layout.reset)
    }

    render() {
        return (
            <div>
                {Children.map(this.props.children, child => child)}
            </div>
        )
    }
}

export default BodyContainer;
