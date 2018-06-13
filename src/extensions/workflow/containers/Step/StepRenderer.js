import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import Sidebar from './containers/Sidebar';
import Stage from './containers/Stage';
import style from './style.module.css';

@stateAware(state => ({
    currentStep: state.currentStep
}))
class StepRenderer extends Component {

    // Custom name for container
    static displayName = 'StepRenderer';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    shouldComponentUpdate(nextProps) {
        if (this.props.currentStep !== null)
            return this.props.currentStep !== nextProps.currentStep;
        return true;
    }

    render() {
        const { currentStep, match } = this.props;
        if (currentStep === null)
            return null;
        return (
            <div className={style.stepLayout}>
                <Sidebar match={match} />
                <Stage match={match} />
            </div>
        );
    }
}

export default StepRenderer;
