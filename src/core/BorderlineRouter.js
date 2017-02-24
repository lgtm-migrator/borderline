/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BorderlineApplication from './BorderlineApplication';

export default class BorderlineRouter extends Component {

    // Custom name for container
    static displayName = 'BorderlineRouter';

    render() {
        return (
            <Router>
                <BorderlineApplication />
            </Router>
        );
    }
}
