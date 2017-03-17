/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { Children, Component, PropTypes as T } from 'react';

export default class Authenticated extends Component {

    // Custom name for container
    static displayName = 'Authenticated'

    // Types for available context
    static contextTypes = {
        session: T.object
    };

    render() {
        let {session} = this.context;
        let {children} = this.props;
        if (!session || !session.ok)
            return null;
        return children ? Children.only(children) : null;
    }
}
