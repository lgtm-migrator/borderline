import React, { Component } from 'react';
import SVG from 'components/SVG';
import logo from './images/logo.svg';
import './style.css';

class NavigationButton extends Component {

    // Custom name for container
    static displayName = 'NavigationButton';

    render() {
        return <SVG src={logo} className="logo" />;
    }
}

export default NavigationButton
