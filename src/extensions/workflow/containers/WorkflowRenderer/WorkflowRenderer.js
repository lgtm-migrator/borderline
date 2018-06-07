import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    currentWorkflow: state.currentWorkflow,
    workflowsList: state.workflowsList,
    workflowLoading: state.workflowLoading
}))
class WorkflowRenderer extends Component {

    // Custom name for container
    static displayName = 'WorkflowRenderer';
    
    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    shouldComponentUpdate(nextProps) {
        if (this.props.currentWorkflow !== null)
            return this.props.currentWorkflow !== nextProps.currentWorkflow;
        return true;
    }

    componentDidMount() {
        const { match, currentWorkflow, workflowLoading } = this.props;
        if ((currentWorkflow === null || currentWorkflow !== match.params.particule) && workflowLoading === false)
            this.context.dispatch(actions.workflowLoad(match.params.particule));
    }

    render() {
        const { currentWorkflow } = this.props;
        if (currentWorkflow === null)
            return null;
        return (
            <>
                <div className={style.workflowsDescription}>
                    Renderer for {currentWorkflow}
                </div>
            </>
        );
    }
}

export default WorkflowRenderer;
