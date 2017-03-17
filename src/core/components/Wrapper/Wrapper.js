/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, Children, PropTypes as T } from 'react';

export default class Wrapper extends Component {

    // Custom name for container
    static displayName = 'Wrapper';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    shouldComponentUpdate() {
        return true;
    }

    render() {
        const { children } = this.props;
        if (children === undefined || children === null)
            return null;
        return (
            <div className={`${this.props.className || ''} ${borderline.styles[`${this.props.absolute ? 'absolute' : this.props.relative ? 'relative' : 'hidden'}Expand`]}`}>
                {children instanceof Array ? Children.map(children, child => child) : Children.only(children)}
            </div>
        );
    }
}
