/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, Children, PropTypes as T } from 'react';
import InspectorContext from './InspectorContext';
import ExtensionsInjector from './ExtensionsInjector';
import BorderlineScene from '../BorderlineScene';
import inspectorFlux from './flux';

// Container delcaration
export default class InspectorManager extends Component {

    // Custom name for container
    static displayName = 'InspectorManager';

    // Typechecking for container's props
    static propTypes = {
        children: T.element
    };

    constructor(props, context) {
        super(props, context);
    }

    shouldComponentUpdate() {
        console.warn('InspectorManager > shouldComponentUpdate'); // eslint-disable-line no-console
        return true;
    }

    render() {
        console.info('InspectorManager > render'); // eslint-disable-line no-console
        const { children } = this.props;
        const Wrapper = borderline.components.wrapper;
        return (
            <BorderlineScene scene={'core'} seed={inspectorFlux}>
                <InspectorContext>
                    <Wrapper>
                        <ExtensionsInjector />
                        {children ? Children.only(children) : null}
                    </Wrapper>
                </InspectorContext>
            </BorderlineScene>
        );
    }
}
