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
                    <LoginForm />
                </div>
            </div>
        );
    }
}

import sessionActions from '../flux/session/actions';

@storeManager.injectStates('session', session => ({
    isProcessing: session ? !!session.toJS().working : true
}))
class LoginForm extends Component {

    sumbit(e) {
        e.preventDefault();
        console.info(this.refs); // eslint-disable-line no-console
        this.props.dispatch(sessionActions.sessionLogin({
            username: this.refs.username.value,
            password: this.refs.password.value
        }));
    }

    render() {
        const { isProcessing } = this.props;
        return (
            <form className={loginStyles.form} onSubmit={this.sumbit.bind(this)}>
                <input type="text" placeholder="Username" ref="username" /><br />
                <input type="password" placeholder="Password" ref="password" /><br />
                {isProcessing ? (<Loader />) : (<button type="submit">Login</button>)}<br />
                <span>I forgot my password</span>
            </form>
        );
    }
}

export default LoginContainer;
