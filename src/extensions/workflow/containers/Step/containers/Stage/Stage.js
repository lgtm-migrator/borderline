import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';

@stateAware(state => ({
    stepTypes: state.stepTypes,
    currentStep: state.stepsList[state.currentWorkflow][state.currentStep]
}))
class Stage extends Component {

    // Custom name for container
    static displayName = 'Stage';

    render() {
        const { stepTypes, currentStep } = this.props;
        const Stage = stepTypes[currentStep.extension].stage;
        return (
            <Route component={Stage} />
        );
    }
}

export default Stage;
