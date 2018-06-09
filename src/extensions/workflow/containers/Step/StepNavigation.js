import React, { Component } from 'react';
// import { Switch, Route, NavLink } from 'react-router-dom';
// import WorkflowLoader from './WorkflowLoader';
// import WorkflowHistory from './WorkflowHistory';
// import WorkflowPins from './WorkflowPins';
import style from './style.module.css';

class StepNavigation extends Component {

    // Custom name for container
    static displayName = 'StepNavigation';

    render() {

        // const { match } = this.props;
        return (
            <>
                <div key='menu' className={style.menu}>
                    Navigation for Steps
                </div>
            </>
        );
    }
}

export default StepNavigation;
