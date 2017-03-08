/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component } from 'react';

// Container delcaration
export default class Content extends Component {

    // Custom name for container
    static displayName = 'Content';

    constructor(props, context) {
        super(props, context);
    }

    render() {
        console.info('Content > render'); // eslint-disable-line no-console
        return (
            <div>Content</div>
        );
    }
}
