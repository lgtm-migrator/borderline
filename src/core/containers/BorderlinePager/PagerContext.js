/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import { Component, Children, PropTypes as T } from 'react';

// Container delcaration
@borderline.stateAware('PagerContext')
export default class PagerContext extends Component {

    // Custom name for container
    static displayName = 'PagerContext';

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
        pages: T.array,
        expanded: T.bool
    };

    constructor(props, context) {
        super(props, context);
        this.pages = [];
        this.expanded = false;
    }

    getChildContext() {
        return {
            pages: this.pages,
            expanded: this.expanded
        };
    }

    componentWillUpdate(next) {
        let state = next.state ? next.state[this.context.model] : null;
        this.pages = state ? state.toJS().pages || [] : [];
        this.expanded = state ? state.toJS().expand || false : false;
    }

    shouldComponentUpdate(next) {
        let state = next.state ? next.state[this.context.model] : null;
        let pages = state ? state.toJS().pages || [] : [];
        let expanded = state ? state.toJS().expand || false : false;
        return (this.expanded != expanded || this.pages.length != pages.length);
    }

    render() {
        const { children } = this.props;
        return children ? Children.only(children) : null;
    }
}
