import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import style from './style.module.css';

class Sidebar extends Component {

    // Custom name for container
    static displayName = 'Sidebar';

    render() {
        return (
            <div className={style.sidebar}>
                <Switch>
                    plop
                </Switch>
            </div>
        );
    }
}

export default Sidebar;
