import React, { PureComponent } from 'react';

import style from './style.css';

class LoadBar extends PureComponent {

    render() {
        return (
            <div className={style.loader}></div>
        );
    }
}

export default LoadBar;
