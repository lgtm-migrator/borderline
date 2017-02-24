/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, Children } from 'react';

import bodyStyles from './Body.css';

export default class Body extends Component {

    componentDidMount() {
        document.documentElement.classList.add(bodyStyles.general);
    }

    render() {
        return (
            <div className={borderline.styles.relativeExpand}>
                {Children.map(this.props.children, child => child)}
            </div>
        );
    }
}
