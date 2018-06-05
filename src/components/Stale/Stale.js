import React, { Component } from 'react';
import SVG from 'components/SVG';
import errorIcon from './images/errorIcon.svg';
import style from './style.module.css';

export default class Stale extends Component {

    // Custom name for container
    static displayName = 'Stale';

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div className={style.stale} >
                <SVG src={errorIcon} />
            </div>
        );
    }
}
