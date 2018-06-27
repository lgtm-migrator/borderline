import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';

class StatusIndicator extends Component {

    // Custom name for container
    static displayName = 'StatusIndicator';

    render() {
        return (
            <span className={style.status}>
                <Link to="/eae">EAE online</Link>
            </span>
        );
    }
}

export default StatusIndicator;
