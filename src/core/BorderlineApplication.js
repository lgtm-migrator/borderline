/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component } from 'react';

import BorderlineSession from './containers/BorderlineSession';

// Declaraction of the Borderline class
export default class BorderlineApplication extends Component {

    // Custom name for container
    static displayName = 'BorderlineApplication';

    // Here we do the top level rendering of our application
    render() {
        return (
            <BorderlineSession>
                <span>Logged in !</span>
                {/* <ContentBox />
                    <MainNavigation />
                    <LoginBox dispatch={dispatchProxy('session', 'core')} /> */}
            </BorderlineSession>
        );
    }
}
