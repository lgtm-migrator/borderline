import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import style from './style.module.css';

@stateAware(state => ({
    stepTypes: state.stepTypes,
    currentStep: state.stepsList[state.currentWorkflow][state.currentStep]
}))
class Stage extends Component {

    // Custom name for container
    static displayName = 'Stage';

    render() {
        const { stepTypes, currentStep } = this.props;
        if (!currentStep || stepTypes[currentStep.extension] === null || stepTypes[currentStep.extension] === undefined)
            return null;
        const Stage = stepTypes[currentStep.extension].stage;
        return (
            <div className={style.stage}>
                <Route render={props => <Stage {...props} />} />
            </div>
        );
    }
}

export default Stage;
