import React, { Component, Children } from 'react';

// import WrapClear from '../components/WrapClearComponent';
import bodyStyles from '../styles/Body.css';
import layoutStyles from '../styles/Layout.css';

class BodyContainer extends Component {

    componentDidMount() {
        document.documentElement.classList.add(...bodyStyles.general.split(' '));
    }

    render() {
        return (
            <div className={layoutStyles.wrap}>
                {Children.map(this.props.children, child => child)}
            </div>
        );
    }
}

export default BodyContainer;
