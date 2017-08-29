import React, { Component } from 'react';
import SVG from 'components/SVG';
import errorIcon from './images/errorIcon.svg';
import './style.css';

export default class Stale extends Component {

    // Custom name for container
    static displayName = 'Stale';

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div className="stale" >
                <SVG src={errorIcon} />
            </div>
        );
    }
}
