/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component } from 'react';

import editorLoader from '../../utilities/EditorLoader';

class TextEditor extends Component {

    componentWillMount() {
        this.setState({
            value: ''
        });
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
            <div className={borderline.styles.relativeExpand} ref={(slot) => { this.slot = slot; }} />
        );
    }
}

export default TextEditor;
