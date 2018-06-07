import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { actions } from '../../flux';
import style from './style.module.css';

class WorkflowCreator extends Component {

    // Custom name for container
    static displayName = 'WorkflowCreator';    

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    createWorflow = (e) => {
        e.preventDefault();
        this.context.dispatch(actions.workflowCreate({
            name: this.refs.workflowName.value
        }));
    }

    render() {
        return (
            <>
                <div className={style.workflowsCreateDescription}>
                    <h1>Create a new Workflow</h1><br />
                    <div>We only need a bit more from you to get you going on a new workflow.</div>
                </div>
                <form className={style.workflowsCreateForm} onSubmit={this.createWorflow.bind(this)}>
                    <input type="text" placeholder="Name of your workflow" ref="workflowName" /><br /><br />
                    <button type="submit">Create</button>
                </form>
            </>
        );
    }
}

export default WorkflowCreator;
