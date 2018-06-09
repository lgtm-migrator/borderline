import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import Sidebar from './containers/Sidebar';
import Stage from './containers/Stage';
import style from './style.module.css';

@stateAware(state => ({
    currentStep: state.currentStep,
    stepsListLoading: state.stepsListLoading
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

    componentDidMount() {
        const { match, currentStep, stepsListLoading } = this.props;
        if ((currentStep === null || currentStep !== match.params.particule) && stepsListLoading === false)
            this.context.dispatch(actions.stepsListLoad(match.params.particule));
    }

    render() {
        const { currentStep } = this.props;
        if (currentStep === null)
            return null;
        return (
            <div className={style.workflowLayout}>
                <Sidebar {...this.props} />
                <Stage />
            </div>
        );
    }
}

export default StepRenderer;
