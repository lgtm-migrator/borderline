/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, PropTypes as T } from 'react';
import LoaderBar from '../../components/LoadBar';
import sessionActions from './flux/actions';
import loginStyles from './styles/Login.css';

// Container delcaration
export default class LoginScreen extends Component {

    // Custom name for container
    static displayName = 'LoginScreen';

    // Types for available context
    static contextTypes = {
        dispatch: T.func,
        session: T.object
    };

    sumbit(e) {
        e.preventDefault();
        this.context.dispatch(sessionActions.sessionLogin({
            username: this.refs.username.value,
            password: this.refs.password.value
        }));
    }

    render() {
        let isSessionValid = this.context.session.ok || false;
        let isProcessing = !!this.context.session.working;
        let hasAttempted = this.context.session.attempts > 0;
        let error = this.context.session.error || '';
        const Wrapper = borderline.components.wrapper;
        return (
            <Wrapper absolute className={`${loginStyles.screen} ${isSessionValid ? loginStyles.hide : ''}`}>
                <div className={loginStyles.box}>
                    <div className={loginStyles.title}>
                        <span>borderline<strong>:</strong></span>
                    </div>
                    <form className={loginStyles.form} onSubmit={this.sumbit.bind(this)}>
                        <input type="text" placeholder="Username" ref="username" /><br />
                        <input type="password" placeholder="Password" ref="password" /><br />
                        {isProcessing ? (<LoaderBar />) : (<button type="submit">Login</button>)}<br />
                        {hasAttempted && error ? (<div className={loginStyles.error}>{error}</div>) : ''}
                        {hasAttempted && error ? (<br />) : ''}
                        <span>I forgot my password</span>
                    </form>
                </div>
            </Wrapper>
        );
    }
}
