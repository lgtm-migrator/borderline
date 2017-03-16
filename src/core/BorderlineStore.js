/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import BorderlineApplication from './BorderlineApplication';

export default class BorderlineStore extends Component {

    // Custom name for container
    static displayName = 'BorderlineStore';

    render() {
        return (
            <Provider store={this.props.store}>
                <BorderlineApplication/>
            </Provider>
        );
    }
}
