import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import Editor from 'components/Editor';
import { actions } from '../../../../flux';

@stateAware(state => ({
    analysisCodeText: state.stepObject !== undefined && state.stepObject !== null && state.stepObject.context !== undefined ? state.stepObject.context.analysisCodeText : ''
}))
class QueryPanel extends Component {

    // Custom name for container
    static displayName = 'QueryPanel';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        this.prevEditorValue = this.editorValue;
        this.autoSave = setInterval(this.saveQueryDescription, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.autoSave);
        this.saveQueryDescription();
        this.context.dispatch(actions.clearCurrentStep());
    }

    saveQueryDescription = () => {
        if (this.editorValue !== this.prevEditorValue) {
            this.context.dispatch(actions.saveQueryDescription(this.editorValue));
            this.prevEditorValue = this.editorValue;
        }
    }

    valueChange = (value) => {
        this.editorValue = value;
    }

    render() {
        const { analysisCodeText } = this.props;
        return <Editor language="python" onChange={this.valueChange} value={analysisCodeText} />;
    }
}

export default QueryPanel;
