import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { Route } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import { StepNavigation } from '../Step';

@stateAware(state => ({
    currentWorkflow: state.currentWorkflow,
    workflowLoading: state.workflowLoading
}))
class WorkflowRenderer extends Component {

    // Custom name for container
    static displayName = 'WorkflowRenderer';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        const { match, currentWorkflow, workflowLoading } = this.props;
        if ((currentWorkflow === null || currentWorkflow !== match.params.particule) && workflowLoading === false)
            this.context.dispatch(actions.workflowLoad(match.params.particule));
    }

    componentDidUpdate() {
        const { match, currentWorkflow, workflowLoading } = this.props;
        if ((currentWorkflow === null || currentWorkflow !== match.params.particule) && workflowLoading === false)
            this.context.dispatch(actions.workflowLoad(match.params.particule));
    }

    render() {
        const { match, currentWorkflow, workflowLoading } = this.props;
        if (currentWorkflow !== null && currentWorkflow === match.params.particule && workflowLoading === false)
            return <Route render={props => <StepNavigation {...props} />} />;
        return null;
    }
}

export default WorkflowRenderer;
