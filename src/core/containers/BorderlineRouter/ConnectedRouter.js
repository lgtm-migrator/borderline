/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component, Children, PropTypes as T } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routerActions from './flux/actions';

// Container delcaration
export default class ConnectedRouter extends Component {

    // Custom name for container
    static displayName = 'ConnectedRouter';

    // Typechecking for container's props
    static propTypes = {
        children: T.element
    };

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    render() {
        const { children } = this.props;
        return (
            <Router>
                 <Route render={({ location }) => {
                    if (this.location != location) {
                        this.location = location;
                        console.error('ConnectedRouter', location); // eslint-disable-line no-console
                        this.context.dispatch(routerActions.routerLocationChange(location));
                    }
                    return children ? Children.only(children) : null;
                }} />
                {/*{children ? Children.only(children) : null}*/}
            </Router>
        );
    }
}
