/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, Children, PropTypes as T } from 'react';

export default class Wrapper extends Component {

    // Custom name for container
    static displayName = 'InspectorManager';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    render() {
        return (
            <div className={borderline.styles[`${this.props.absolute ? 'absolute' : 'relative'}Expand`]}>
                {Children.map(this.props.children, child => child)}
            </div>
        );
    }
}
