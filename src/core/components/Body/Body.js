/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { Component, Children, PropTypes as T } from 'react';
import bodyStyles from './styles/Body.css';

export default class Body extends Component {

    // Custom name for container
    static displayName = 'InspectorManager';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    componentDidMount() {
        document.documentElement.classList.add(bodyStyles.general);
    }

    render() {
        const { children } = this.props;
        return children ? Children.only(this.props.children) : null;
    }
}
