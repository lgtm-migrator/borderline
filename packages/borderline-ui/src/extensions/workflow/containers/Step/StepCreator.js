import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { Redirect } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    stepTypes: state.stepTypes,
    currentStep: state.currentStep,
    currentOutputs: state.currentOutputs,
    newStep: state.newStep
}))
class StepCreator extends Component {

    // Custom name for container
    static displayName = 'StepCreator';

    // Types for available context
    static contextTypes = {
        dispatch: T.func,
        router: T.object
    };

    createStep = (eid) => {
        const { root } = this.props;
        if (root === true)
            this.context.dispatch(actions.stepCreate(eid));
        else
            this.context.dispatch(actions.stepCreateFollowup(eid));
    }

    render() {
        const { root, stepTypes, currentOutputs, currentStep, newStep } = this.props;
        const { router: { route: { match: { path } } } } = this.context;

        if (root !== true && currentStep === null)
            return <Redirect to={path.substr(0, path.lastIndexOf('/'))} />;

        if (newStep !== null)
            return <Redirect to={`${path.substr(0, path.lastIndexOf('/'))}/${newStep}`} />;

        const typeList = Object.keys(stepTypes).map((eid) => {
            const { inputs, name } = stepTypes[eid];
            if (currentOutputs !== null && inputs.filter(value => -1 !== currentOutputs.indexOf(value)).length === 0)
                return null;
            return <button key={eid} onClick={() => this.createStep(eid)}>{name}</button>;
        });

        return (
            <>
                <div className={style.stepsCreateDescription}>
                    {root === true ?
                        <>
                            <h1>How would like to start ?</h1><br />
                            <div>This seems to be the first action in your workflow! What would you like to start with ?</div>
                        </>
                        :
                        <>
                            <h1>What's next ?</h1><br />
                            <div>What would you like to continue with ?</div>
                        </>
                    }
                </div>
                <form className={style.stepsCreateForm} onSubmit={(e) => e.preventDefault()}>
                    {typeList}
                </form>
            </>
        );
    }
}

export default StepCreator;
