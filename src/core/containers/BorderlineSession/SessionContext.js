/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import { Component, Children, PropTypes as T } from 'react';

// Container delcaration
@borderline.stateAware('SessionContext')
export default class SessionContext extends Component {

    // Custom name for container
    static displayName = 'SessionContext';

    // Typechecking for container's props
    static propTypes = {
        children: T.element
    };

    // Types for available context
    static contextTypes = {
        model: T.string
    };

    // Typechecking for children's context
    static childContextTypes = {
        session: T.object
    };

    constructor(props, context) {
        super(props, context);
        this.session = {};
    }

    getChildContext() {
        return {
            session: this.session
        };
    }

    componentWillUpdate(next) {
        let state = next.state ? next.state[this.context.model] : null;
        this.session = state ? state.toJS() : {};
    }

    shouldComponentUpdate() {
        return !(this.session && this.session.ok);
    }

    render() {
        const { children } = this.props;
        return children ? Children.only(children) : null;
    }
}
