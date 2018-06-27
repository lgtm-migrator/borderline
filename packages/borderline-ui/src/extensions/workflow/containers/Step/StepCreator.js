import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    stepTypes: state.stepTypes,
    currentOutput: state.currentOutput
}))
class StepCreator extends Component {

    // Custom name for container
    static displayName = 'StepCreator';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    createStep = (eid) => {
        this.context.dispatch(actions.stepCreate(eid));
    }

    render() {
        const { root, stepTypes, currentOutput } = this.props;
        const typeList = Object.keys(stepTypes).map((eid) => {
            const { input, name } = stepTypes[eid];
            if (input !== undefined && input.length > 0 && input.includes(currentOutput) === false)
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
