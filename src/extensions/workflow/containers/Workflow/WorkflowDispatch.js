import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import WorkflowRenderer from './WorkflowRenderer';
import WorkflowCreator from './WorkflowCreator';

@stateAware(state => ({
    currentWorkflow: state.currentWorkflow,
    newWorkflow: state.newWorkflow
}))
class WorkflowDispatch extends Component {

    // Custom name for container
    static displayName = 'WorkflowDispatch';

    render() {
        const { match, currentWorkflow, newWorkflow } = this.props;
        return (
            <Switch>
                <Route path={`${match.url}/:particule`} component={(innerProps) => {
                    const innerMatch = innerProps.match;
                    if (innerMatch.params.particule === 'new') {
                        if (newWorkflow !== null)
                            return <Redirect to={`${match.url.replace(/\/$/, '')}/${newWorkflow}`} />;
                        return <WorkflowCreator />;
                    }
                    return <WorkflowRenderer {...innerProps} />;
                }} />
                <Route component={() => {
                    if (currentWorkflow === null)
                        return <Redirect to={`${match.url.replace(/\/$/, '')}/history`} />;
                    return <Redirect to={`${match.url}/${currentWorkflow}`} />;
                }} />
            </Switch>
        );
    }
}

export default WorkflowDispatch;
