import React, { Component } from 'react';

import storeManager from '../utilities/StoreManager';
import Loader from '../components/LoaderComponent';

import loginStyles from '../styles/Login.css';
import layoutStyles from '../styles/Layout.css';

@storeManager.injectStates('session', session => ({
    isSessionValid: session ? !!session.toJS().ok : false
}))
class LoginContainer extends Component {

    render() {
        const { isSessionValid } = this.props;
        return (
            <div className={`${layoutStyles.expand} ${loginStyles.screen} ${isSessionValid ? loginStyles.hide : ''}`}>
                <div className={loginStyles.box}>
                    <div className={loginStyles.title}>
                        <span>borderline<strong>:</strong></span>
                    </div>
                    <LoginForm dispatch={this.props.dispatch} />
                </div>
            </div>
        );
    }
}

import sessionActions from '../flux/session/actions';

@storeManager.injectStates('session', session => {
    let s = session && session.toJS ? session.toJS() : {};
    return {
        isProcessing: session ? !!s.working : true,
        hasAttempted: session ? !!s.attempts : false,
        error: session ? s.error ? s.error.error : false : false,
    };
})
class LoginForm extends Component {

    sumbit(e) {
        e.preventDefault();
        this.props.dispatch(sessionActions.sessionLogin({
            username: this.refs.username.value,
            password: this.refs.password.value
        }));
    }

    render() {
        const { isProcessing, hasAttempted, error } = this.props;
        return (
            <form className={loginStyles.form} onSubmit={this.sumbit.bind(this)}>
                <input type="text" placeholder="Username" ref="username" /><br />
                <input type="password" placeholder="Password" ref="password" /><br />
                {isProcessing ? (<Loader />) : (<button type="submit">Login</button>)}<br />
                {hasAttempted && error ? (<div className={loginStyles.error}>{error}</div>) : ''}<br />
                <span>I forgot my password</span>
            </form>
        );
    }
}

export default LoginContainer;
