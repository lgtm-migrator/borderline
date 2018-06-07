import React, { Component } from 'react';
import { stateAware } from 'utilities/storeManager';

@stateAware(state => ({
    currentWorkflow: state.workflowsList[state.currentWorkflow]
}))
class CurrentWorkflowButton extends Component {

    // Custom name for container
    static displayName = 'CurrentWorkflowButton';    

    render() {
        const { currentWorkflow } = this.props;
        return (
            <>
                {currentWorkflow !== undefined ? currentWorkflow.name : 'Current'}
            </>
        );
    }
}

export default CurrentWorkflowButton;
