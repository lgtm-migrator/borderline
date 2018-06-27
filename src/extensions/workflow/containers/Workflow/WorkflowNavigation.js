import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import WorkflowDispatch from './WorkflowDispatch';
import WorkflowHistory from './WorkflowHistory';
import WorkflowPins from './WorkflowPins';
import style from './style.module.css';

class WorkflowNavigation extends Component {

    // Custom name for container
    static displayName = 'WorkflowNavigation';

    render() {

        const { match: { url } } = this.props;
        return (
            <>
                <div key='menu' className={style.menu}>
                    <NavLink to={`${url}/new`} className={`${style.button} ${style.shiningButton}`}>
                        New +
                    </NavLink>
                    <NavLink to={`${url}/history`} activeClassName={style.active} className={style.button}>
                        Workflow history
                    </NavLink>
                    <Route path={`${url}/:particule`} render={WorkflowPins} />
                </div>
                <div key='panel' className={style.panel}>
                    <Switch>
                        <Route path={`${url}/history`} render={WorkflowHistory} />
                        <Route component={WorkflowDispatch} />
                    </Switch>
                </div>
            </>
        );
    }
}

export default WorkflowNavigation;
