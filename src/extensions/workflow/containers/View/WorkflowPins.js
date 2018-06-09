import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { Helmet } from 'react-helmet';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    currentWorkflow: state.currentWorkflow,
    workflowsList: state.workflowsList,
    workflowPins: state.workflowPins
}))
class WorkflowPins extends Component {

    // Custom name for container
    static displayName = 'WorkflowPins';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    pinWorkflow = (wid) => {
        this.context.dispatch(actions.workflowPin(wid));
    }

    unpinWorkflow = (wid) => {
        this.context.dispatch(actions.workflowUnpin(wid));
    }

    gotoWorkflow = (wid) => {
        const { currentWorkflow, history, match } = this.props;
        if (wid !== currentWorkflow || match.params.particule === 'history' || match.params.particule === 'new')
            history.push(`${match.path.substr(0, match.path.lastIndexOf(':particule'))}${wid}`);
    }

    render() {
        const { currentWorkflow, workflowsList, workflowPins, match } = this.props;
        const _this = this;
        const ModelButton = (innerProps) => {
            if ((match.params.particule === 'history' || match.params.particule === 'new') && innerProps.pinned === undefined)
                return null;
            if (match.params.particule === innerProps.wid && innerProps.pinned === undefined & workflowPins[innerProps.wid] === true)
                return null;
            if (innerProps.wid === undefined || innerProps.wid === null)
                return null;
            return (
                <div className={`${style.button} ${innerProps.pinned !== undefined ? style.pinned : ''} ${match.params.particule === innerProps.wid ? style.active : ''}`} onClick={() => _this.gotoWorkflow(innerProps.wid)}>
                    <Helmet>
                        <title>Workflow: {workflowsList[innerProps.wid].name}</title>
                    </Helmet>
                    <span>{workflowsList[innerProps.wid].name}&nbsp;</span>
                    {innerProps.pinned !== undefined ? (
                        <span className={style.actions} role="img" aria-label="Pin" onClick={() => _this.unpinWorkflow(innerProps.wid)}>&#128473;</span>
                    ) : (
                            <span className={style.actions} role="img" aria-label="Pin" onClick={() => _this.pinWorkflow(innerProps.wid)}>&#128204;</span>
                        )}
                </div>
            );
        };
        const pins = Object.keys(workflowPins).map((key) =>
            workflowPins[key] === true ? <ModelButton key={key} wid={key} pinned /> : null
        );
        return (
            <>
                {pins}
                <ModelButton wid={currentWorkflow} />
            </>
        );
    }
}

export default WorkflowPins;
