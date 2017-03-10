/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, PropTypes as T } from 'react';
import BorderlineScene from '../BorderlineScene';

// Container delcaration
export default class ExtensionsInjector extends Component {

    // Custom name for container
    static displayName = 'ExtensionAnchors';

    // Types for available context
    static contextTypes = {
        extensions: T.object
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        let { list } = this.context.extensions;
        const Wrapper = borderline.components.wrapper;
        return (
            <Wrapper absolute>
                {Object.keys(list).map(id => (
                    <BorderlineScene model={id} seed={list[id].seed} key={`_ext__${id}`}/>
                ))}
            </Wrapper>
        );
    }
}
