import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import LoadBar from 'components/LoadBar';
import { actions } from '../../../../flux';
import style from './style.module.css';

@stateAware(state => ({
    currentStepStatus: state.currentStepStatus
}))
class Actions extends Component {

    // Custom name for container
    static displayName = 'Actions';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    prepareNextStep = () => {
        this.context.dispatch(actions.stepPrepareNext());
    }

    render() {

        const { currentStepStatus } = this.props;

        return (
            <div className={style.actions}>
                {currentStepStatus !== 'ready' ? <div className={style.loadbarContainer}><LoadBar /></div> : <button onClick={this.prepareNextStep}>Next</button>}
            </div>
        );
    }
}

export default Actions;
