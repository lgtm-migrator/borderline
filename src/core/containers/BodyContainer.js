import React, { Component, Children } from 'react';

import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/Body.css';

class BodyContainer extends Component {

    componentDidMount() {
        document.documentElement.classList.add(...styles.general.split(' '));
        document.body.classList.add(...styles.general.split(' '));
        document.getElementById('root').classList.add(...styles.general.split(' '));
    }

    render() {
        return (
            <WrapClear>
                {Children.map(this.props.children, child => child)}
            </WrapClear>
        );
    }
}

export default BodyContainer;
