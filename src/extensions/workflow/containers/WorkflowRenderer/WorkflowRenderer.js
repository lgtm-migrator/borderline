import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    currentWorkflow: state.currentWorkflow
}))
class WorkflowRenderer extends Component {

    // Custom name for container
    static displayName = 'WorkflowRenderer';
    
    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        const { match, currentWorkflow } = this.props;
        if (currentWorkflow !== match.params.particule)
            this.context.dispatch(actions.setCurrentWorkflow(match.params.particule));
    }

    render() {
        const { currentWorkflow } = this.props;
        return (
            <>
                <div className={style.workflowsDescription}>
                    Renderer {currentWorkflow === undefined ? '' : `for ${currentWorkflow}`}
                </div>
            </>
        );
    }
}

export default WorkflowRenderer;
