/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, Children, PropTypes as T } from 'react';

// Container delcaration
@borderline.stateAware('InspectorContext')
export default class InspectorContext extends Component {

    // Custom name for container
    static displayName = 'InspectorContext';

    // Typechecking for container's props
    static propTypes = {
        children: T.array
    };

    // Types for available context
    static contextTypes = {
        model: T.string
    };

    // Typechecking for children's context
    static childContextTypes = {
        extensions: T.object
    };

    constructor(props, context) {
        super(props, context);
        this.extensions = {};
    }

    getChildContext() {
        return {
            extensions: this.extensions
        };
    }

    componentWillUpdate(next) {
        let state = next.state ? next.state[this.context.model] : null;
        this.extensions = state ? state.toJS() : {};
    }

    shouldComponentUpdate() {
        return !(this.extensions && this.extensions.ok);
    }

    render() {
        if (!(this.extensions && this.extensions.ok))
            return null;
        const { children } = this.props;
        const Wrapper = borderline.components.wrapper;
        return (
            <Wrapper>
                {children ? Children.map(children, child => child) : null}
            </Wrapper>
        );
    }
}
