/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

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

    render() {
        const { children } = this.props;
        return (
            <BorderlineScene scene={'core'} seed={inspectorFlux}>
                <InspectorContext>
                    <ExtensionsInjector />
                    {children ? Children.only(children) : null}
                </InspectorContext>
            </BorderlineScene>
        );
    }
}
