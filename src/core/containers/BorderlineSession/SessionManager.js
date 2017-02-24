/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component, Children, PropTypes as T } from 'react';
import Body from '../../components/Body';
import SessionContext from './SessionContext';
import Authenticated from './Authenticated';
import NotAuthenticated from './NotAuthenticated';
import LoginScreen from './LoginScreen';
import BorderlineScene from '../BorderlineScene';
import sessionFlux from './flux';

// Container delcaration
export default class SessionManager extends Component {

    // Custom name for container
    static displayName = 'SessionManager';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        // console.info('SessionManager > render'); // eslint-disable-line no-console
        let { children } = this.props;
        return (
            <BorderlineScene scene={'core'} seed={sessionFlux}>
                <SessionContext>
                    <Body>
                        <Authenticated>
                            <div>{children ? Children.map(children, child => child) : null}</div>
                        </Authenticated>
                        <NotAuthenticated>
                            <LoginScreen />
                        </NotAuthenticated>
                    </Body>
                </SessionContext>
            </BorderlineScene>
        );
    }
}
