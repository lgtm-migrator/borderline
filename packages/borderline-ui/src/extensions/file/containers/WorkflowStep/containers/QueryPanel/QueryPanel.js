import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import Editor from 'components/Editor';
import { actions } from '../../../../flux';

@stateAware(state => ({
    fileText: state.stepObject !== undefined && state.stepObject !== null && state.stepObject.context !== undefined ? state.stepObject.context.fileText : ''
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
        this.autoSave = setInterval(this.saveFileText, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.autoSave);
        this.saveFileText();
        this.context.dispatch(actions.clearCurrentStep());
    }

    saveFileText = () => {
        if (this.editorValue !== this.prevEditorValue) {
            this.context.dispatch(actions.saveFileText(this.editorValue));
            this.prevEditorValue = this.editorValue;
        }
    }

    valueChange = (value) => {
        this.editorValue = value;
    }

    render() {
        const { fileText } = this.props;
        return <Editor language="vs" onChange={this.valueChange} value={fileText} />;
    }
}

export default QueryPanel;
