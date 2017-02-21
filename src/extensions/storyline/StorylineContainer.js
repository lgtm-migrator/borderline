/* global borderline:true */
import React, { Component } from 'react';

import containerStyles from './styles/Container.css';

class StorylineContainer extends Component {

    componentDidMount() {
    }

    render() {
        let TextEditor = borderline.components.textEditor;
        return (
            <TextEditor value='var jean = 1337 || "debugger";' language='javascript' className={containerStyles.box} />
        );
    }
}

export default StorylineContainer;
