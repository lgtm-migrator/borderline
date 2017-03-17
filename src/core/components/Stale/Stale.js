/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component } from 'react';

import staleStyles from './styles/Stale.css';
import errorIcon from './images/errorIcon.svg';

export default class Stale extends Component {

    // Custom name for container
    static displayName = 'Stale';

    render() {
        const Icon = borderline.components.svg;
        const Wrapper = borderline.components.wrapper;
        return (
            <Wrapper relative className={staleStyles.stale} >
                <div className={staleStyles.fab}>
                    <Icon src={errorIcon} />
                </div>
            </Wrapper>
        );
    }
}
