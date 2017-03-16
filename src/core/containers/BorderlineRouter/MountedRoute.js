/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { Component, Children, PropTypes as T } from 'react';
import routerActions from './flux/actions';

// Container delcaration
export default class MountedRoute extends Component {

    // Custom name for container
    static displayName = 'MountedRoute';

    // Typechecking for container's props
    static propTypes = {
        children: T.element
    };

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentDidMount() {
        this.advertise();
    }

    componentDidUpdate() {
        this.advertise();
    }

    advertise() {
        if (this.location != this.props.destination.pathname) {
            this.location = this.props.destination.pathname;
            this.context.dispatch(routerActions.routerLocationChange(this.location));
        }
    }

    render() {
        const { children } = this.props;
        return children ? Children.only(children) : null;
    }
}
