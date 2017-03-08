/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, Children, PropTypes as T } from 'react';
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

    shouldComponentUpdate() {
        console.warn('SessionManager > shouldComponentUpdate'); // eslint-disable-line no-console
    }

    render() {
        console.info('SessionManager > render'); // eslint-disable-line no-console
        const { children } = this.props;
        const Wrapper = borderline.components.wrapper;
        return (
            <BorderlineScene scene={'core'} seed={sessionFlux}>
                <SessionContext>
                    <Wrapper absolute>
                        <Authenticated>
                            <Wrapper>
                                {children ? Children.map(children, child => child) : null}
                            </Wrapper>
                        </Authenticated>
                        <NotAuthenticated>
                            <LoginScreen />
                        </NotAuthenticated>
                    </Wrapper>
                </SessionContext>
            </BorderlineScene>
        );
    }
}
