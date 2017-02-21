import React, { Component } from 'react';

import editorLoader from '../utilities/EditorLoader';
import editorStyles from '../styles/TextEditor.css';

class TextEditor extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            value: ''
        };
    }

    componentDidMount() {
        this.disposed = false;
        this.setState({
            value: this.props.value || ''
        });
        editorLoader.getPromise().then(() => {
            if (this.disposed)
                return;
            this.init();
        });
    }

    componentWillUpdate() {
        if (this.editor)
            this.setState({
                value: this.editor.getValue()
            });
    }

    componentDidUpdate() {
        if (this.editor)
            this.editor.setValue(this.props.value);
    }

    componentWillUnmount() {
        if (this.editor)
            this.editor.dispose();
        this.disposed = true;
    }

    init() {
        this.editor = window.monaco.editor.create(this.slot, {
            value: this.state.value,
            language: this.props.language,
            theme: 'vs-dark',
            contextmenu: false,
            quickSuggestions: false,
            automaticLayout: true
        });
    }

    render() {
        return (
            <div className={editorStyles.editor} ref={(slot) => { this.slot = slot; }} />
        );
    }
}

export default TextEditor;
