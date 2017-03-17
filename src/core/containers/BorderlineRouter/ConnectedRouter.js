/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component, Children, PropTypes as T } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MountedRoute from './MountedRoute';

// Container delcaration
export default class ConnectedRouter extends Component {

    // Custom name for container
    static displayName = 'ConnectedRouter';

    // Typechecking for container's props
    static propTypes = {
        children: T.element
    };

    render() {
        const { children } = this.props;
        return (
            <Router>
                <Route render={({ location }) => (
                    <MountedRoute destination={location}>
                        {children ? Children.only(children) : null}
                    </MountedRoute>
                )} />
            </Router>
        );
    }
}
