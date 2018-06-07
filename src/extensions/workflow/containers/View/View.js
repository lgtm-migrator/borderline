import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import CurrentWorkflowButton from './CurrentWorkflowButton';
import WorkflowHistory from '../WorkflowHistory';
import WorkflowLoader from '../WorkflowLoader';
import style from './style.module.css';

class View extends Component {

    // Custom name for container
    static displayName = 'View';

    render() {

        const { match } = this.props;
        return (
            <>
                <div key='menu' className={style.menu}>
                    <NavLink to={`${match.url}/new`} className={`${style.button} ${style.shiningButton}`}>
                        New workflow +
                    </NavLink>
                    <NavLink to={`${match.url}/history`} activeClassName={style.active} className={style.button}>
                        Workflow history
                    </NavLink>
                    <Route path={`${match.url}/:particule`} component={(innerProps) => {
                        const innerMatch = innerProps.match;
                        const particule = innerMatch.params.particule;
                        let activeClass = '';
                        if (particule === undefined || particule === null)
                            return null;
                        if (particule === 'history' || particule === 'new')
                            return null;
                        if (particule.length !== 0)
                            activeClass = style.active;
                        return (
                        <NavLink to={`${match.url}/`} activeClassName={activeClass} className={style.button}>
                            <CurrentWorkflowButton />
                        </NavLink>
                        );
                    }} />
                </div>
                <div key='panel' className={style.panel}>
                    <Switch>
                        <Route path={`${match.url}/history`} component={WorkflowHistory} />
                        <Route component={WorkflowLoader} />
                    </Switch>
                </div>
            </>
        );
    }
}

export default View;
