/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline:true */

import React, { Component } from 'react';

import containerStyles from './styles/Container.css';

class StorylineContainer extends Component {

    render() {
        let TextEditor = borderline.components.textEditor;
        return (
            <TextEditor value='var jean = 1337 || "debugger";' language='javascript' className={containerStyles.box} />
        );
    }
}

export default StorylineContainer;
