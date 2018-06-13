import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { default as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    workflowsLastLoaded: state.workflowsLastLoaded,
    workflowsListLoading: state.workflowsListLoading,
    workflowsList: state.workflowsList
}))
class WorkflowHistory extends Component {

    // Custom name for container
    static displayName = 'WorkflowHistory';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        const { workflowsListLoading, workflowsLastLoaded } = this.props;
        if (workflowsListLoading === false && new Date().getTime() - workflowsLastLoaded.getTime() > 5 * 1000)
            this.context.dispatch(actions.workflowsListLoad());
    }

    render() {
        const { workflowsListLoading, workflowsList } = this.props;
        let status = null;
        if (workflowsListLoading === true)
            if (Object.keys(workflowsList).length > 0)
                status = '(Updating ...)';
            else
                status = '(Loading ...)';
        let list = Object.keys(workflowsList).map((key) =>
            <Link key={key} to={`/workflow/${key}`}>
                <div className={style.historyItem}>
                    <b>{workflowsList[key].name}</b> by {workflowsList[key].owner} last updated {new Date(workflowsList[key].update).toDateString()}
                </div>
            </Link>
        );
        return (
            <>
                <Helmet>
                    <title>Workflow History</title>
                </Helmet>
                <div className={style.workflowsDescription}>
                    <h1>Workflow History {status}</h1><br />
                    <div>Here is the list of previous workflow you have worked with or have access too.</div>
                </div>
                <div className={style.workflowsList}>
                    {list}
                </div>
            </>
        );
    }
}

export default WorkflowHistory;
