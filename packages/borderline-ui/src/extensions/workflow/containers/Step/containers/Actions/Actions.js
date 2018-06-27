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

        let buttons = [];
        if (currentStepStatus === 'finished') {
            buttons.push(<button key={'reexec'}>Re-execute</button>);
            buttons.push(<button key={'next'}>See the next step</button>);
        } else if (currentStepStatus === 'ready') {
            buttons.push(<button key={'exec'} onClick={this.prepareNextStep}>Execute</button>);
        } else {
            buttons.push(<div key={'unknown'} className={style.loadbarContainer}><LoadBar /></div>);
        }

        return (
            <div className={style.actions}>
                {buttons}
            </div>
        );
    }
}

export default Actions;
