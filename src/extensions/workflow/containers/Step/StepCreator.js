import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { actions } from '../../flux';
import style from './style.module.css';

class StepCreator extends Component {

    // Custom name for container
    static displayName = 'StepCreator';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    createStep = (e) => {
        e.preventDefault();
        this.context.dispatch(actions.workflowCreate({
            name: this.refs.workflowName.value
        }));
    }

    render() {
        let { root } = this.props;
        console.debug(root);
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
                    <button data-stype="cohort" onSubmit={this.createStep.bind(this)}>A patient cohort</button><br /><br />
                    <button data-stype="text" onSubmit={this.createStep.bind(this)}>A free form text</button><br /><br />
                    <button data-stype="file" onSubmit={this.createStep.bind(this)}>A file</button><br /><br />
                </form>
            </>
        );
    }
}

export default StepCreator;
