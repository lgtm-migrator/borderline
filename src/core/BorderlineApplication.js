/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component } from 'react';

import Body from './components/Body';
import BorderlineInspector from './containers/BorderlineInspector';
import BorderlineSession from './containers/BorderlineSession';
import BorderlineRouter from './containers/BorderlineRouter';
import BorderlinePager from './containers/BorderlinePager';

// import SidebarExample from './SidebarRouterTest';

// Declaraction of the Borderline class
export default class BorderlineApplication extends Component {

    // Custom name for container
    static displayName = 'BorderlineApplication';

    componentDidUpdate() {
        console.log('BorderlineApplication > componentDidUpdate'); // eslint-disable-line no-console
    }

    // Here we do the top level rendering of our application
    render() {
        return (
            <Body>
                        <BorderlineRouter>
                <BorderlineSession>
                    <BorderlineInspector>
                            <BorderlinePager />
                    </BorderlineInspector>
                </BorderlineSession>
                        </BorderlineRouter>
            </Body>
        );
    }
}
