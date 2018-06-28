import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import Editor from 'components/Editor';
import { actions } from '../../../../flux';
import schema from './schema.json';

@stateAware(state => ({
    apiQueryText: state.stepObject !== undefined && state.stepObject.context !== undefined ? state.stepObject.context.apiQueryText : ''
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

    editorWillMount = (engine) => {
        const { apiQueryText } = this.props;
        let marker = 'transmart_API_query.json';
        engine.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [{
                fileMatch: [marker],
                schema: schema
            }]
        });
        return this.model = engine.editor.createModel(apiQueryText, 'json', marker);
    }

    render() {
        const { apiQueryText } = this.props;
        return <Editor language="json" onChange={this.valueChange} editorWillMount={this.editorWillMount} value={apiQueryText} />;
    }
}

export default QueryPanel;
