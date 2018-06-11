import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
// import { actions } from '../../flux';
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

    createStep = (e) => {
        e.preventDefault();
        // this.context.dispatch(actions.workflowCreate({
        //     name: this.refs.workflowName.value
        // }));
    }

    render() {
        const { root, stepTypes, currentOutput } = this.props;
        const typeList = Object.keys(stepTypes).map((extension) =>
            Object.keys(stepTypes[extension]).map((eid) => {
                const { input, name } = stepTypes[extension][eid];
                if (input !== undefined && input.length > 0 && input.includes(currentOutput) === false)
                    return null;
                return <button key={eid} data-stype={eid} onSubmit={this.createStep.bind(this)}>{name}</button>;
            })
        ).reduce((prev, current) => prev.concat(current), []);

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
                <form className={style.stepsCreateForm}>
                    {typeList}
                </form>
            </>
        );
    }
}

export default StepCreator;
