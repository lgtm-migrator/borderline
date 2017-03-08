/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component } from 'react';

import Body from './components/Body';
import BorderlineSession from './containers/BorderlineSession';
import BorderlinePager from './containers/BorderlinePager';

// Declaraction of the Borderline class
export default class BorderlineApplication extends Component {

    // Custom name for container
    static displayName = 'BorderlineApplication';

    // Here we do the top level rendering of our application
    render() {
        return (
            <Body>
                <BorderlineSession>
                    <BorderlinePager />
                </BorderlineSession>
            </Body>
        );
    }
}
