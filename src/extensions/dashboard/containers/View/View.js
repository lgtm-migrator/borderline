import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import style from './style.module.css';

class View extends Component {

    // Custom name for container
    static displayName = 'View';

    render() {
        return (
            <>
                <Helmet>
                    <title>Dashboard</title>
                </Helmet>
                <div key='menu' className={style.menu}></div>
                <div key='panel' className={style.panel}>
                    Dashboard
                </div>
            </>
        );
    }
}

export default View;
