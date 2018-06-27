import React, { Component } from 'react';
import Editor from 'components/Editor';

class TextStage extends Component {

    // Custom name for container
    static displayName = 'TextStage';

    render() {
        return (
            <Editor />
        );
    }
}

export default TextStage;
