import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import QueryPanel from './containers/QueryPanel';
import { actions } from '../../flux';

@stateAware(state => ({
    stepObject: state.stepObject
}))
class TextStage extends Component {

    // Custom name for container
    static displayName = 'TextStage';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        this.context.dispatch(actions.getCurrentStep());
    }

    render() {
        const { stepObject } = this.props;
        if (stepObject === null)
            return <div>Loading ...</div>;
        return <QueryPanel />;
    }
}

export default TextStage;
