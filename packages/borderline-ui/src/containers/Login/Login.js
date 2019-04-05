import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { Redirect } from 'react-router-dom';
import LoadBar from 'components/LoadBar';
import { stateAware } from 'utilities/storeManager';
import { actions } from 'containers/Session/flux';
import style from './style.module.css';

@stateAware(state => ({
    isAuthenticated: state.ok,
    isProcessing: state.working,
    hasAttempted: state.attempts > 0,
    error: state.error
}))
class Login extends Component {

    // Custom name for container
    static displayName = 'Login';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    login = (e) => {
        e.preventDefault();
        this.context.dispatch(actions.sessionLogin({
            username: this.refs.username.value,
            password: this.refs.password.value
        }));
    }

    render() {

        const { location, isAuthenticated, isProcessing, hasAttempted, error } = this.props;
        const { from } = location.state || { from: { pathname: '/' } };

        if (from.pathname === '/logout')
            from.pathname = '/';

        if (isAuthenticated === true) {
            return (
                <Redirect to={from} />
            );
        }

        return (
            <div className={style.box}>
                <div className={style.title}>
                    <span>borderline<strong>:</strong></span>
                </div>
                <form className={style.form} onSubmit={this.login.bind(this)}>
                    <input type="text" placeholder="Username" ref="username" /><br />
                    <input type="password" placeholder="Password" ref="password" /><br />
                    {isProcessing ? (<LoadBar />) : (<button type="submit">Login</button>)}<br />
                    {hasAttempted && error !== undefined ? <div className={style.error}>{error}</div> : null}
                </form>
            </div>
        );
    }
}

export default Login;

