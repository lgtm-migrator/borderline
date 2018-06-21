import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import Editor from 'components/Editor';
import { actions } from '../../../../flux';
import schema from './schema.json';

@stateAware(state => ({
    stepObject: state.stepObject
}))
class QueryPanel extends Component {

    // Custom name for container
    static displayName = 'QueryPanel';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        const { stepObject } = this.props;
        this.editorValue = stepObject.context.apiQueryText || '';
        this.prevEditorValue = this.editorValue;
        this.autoSave = setInterval(this.saveQueryDescription, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.autoSave);
        this.saveQueryDescription();
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
        const { stepObject } = this.props;
        let marker = 'transmart_API_query.json';
        engine.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [{
                fileMatch: [marker],
                schema: schema
            }]
        });
        return engine.editor.createModel(stepObject.context.apiQueryText || '', 'json', marker);
    }

    render() {
        return <Editor language="json" onChange={this.valueChange} editorWillMount={this.editorWillMount} />;
    }
}

export default QueryPanel;
