import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    adhocAnalysis: state.adhocAnalysis
}))
class AnalysesPanel extends Component {

    // Custom name for container
    static displayName = 'EAEAnalysesPanel';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    changeCode = (name) => {
        this.context.dispatch(actions.changeAnalysisCode(name));
    }

    render() {
        const { adhocAnalysis } = this.props;
        return Object.keys(adhocAnalysis).map(name =>
            <span key={name} onClick={() => this.changeCode(name)} className={style.analysisButton}>{name}</span>
        );
    }
}

export default AnalysesPanel;
