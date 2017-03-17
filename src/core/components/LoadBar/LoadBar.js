/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { PureComponent } from 'react';

import loaderStyles from './styles/LoadBar.css';

class LoadBar extends PureComponent {

    render() {
        return (
            <div className={loaderStyles.loader}></div>
        );
    }
}

export default LoadBar;
