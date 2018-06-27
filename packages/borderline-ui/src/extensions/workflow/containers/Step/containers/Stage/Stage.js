import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import Enclave from 'containers/Enclave';
import style from './style.module.css';

@stateAware(state => ({
    stepTypes: state.stepTypes,
    stepsList: state.stepsList,
    currentWorkflow: state.currentWorkflow,
    currentStep: state.currentStep
}))
class Stage extends Component {

    // Custom name for container
    static displayName = 'Stage';

    render() {
        const { stepsList, currentWorkflow, currentStep, stepTypes } = this.props;
        if (stepsList[currentWorkflow] === undefined || currentStep === null || stepsList[currentWorkflow][currentStep] === undefined)
            return null;
        const step = stepsList[currentWorkflow][currentStep];
        if (step === undefined || stepTypes[step.extension] === undefined)
            return null;
        const Stage = stepTypes[step.extension].stage || {};

        return (
            <div className={style.stage}>
                <Enclave domain={'extensions'} modelName={step.extension.split('/')[0]} >
                    <Route render={props => <Stage {...props} />} />
                </Enclave>
            </div>
        );
    }
}

export default Stage;
