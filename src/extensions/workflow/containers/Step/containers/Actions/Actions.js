import React, { Component } from 'react';
import style from './style.module.css';

class Actions extends Component {

    // Custom name for container
    static displayName = 'Actions';

    render() {
        return (
            <div className={style.actions}>
                <button>Next</button>
            </div>
        );
    }
}

export default Actions;
