import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { Redirect } from 'react-router-dom'
import { stateAware } from 'utilities/storeManager'
import { actions } from 'containers/Session/flux'
import style from './style.css';

class Login extends Component {

    // Custom name for container
    static displayName = 'Login';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    state = {
        redirectToReferrer: false
    }

    login = (e) => {
        e.preventDefault();
        this.context.dispatch(actions.sessionLogin({
            username: this.refs.username.value,
            password: this.refs.password.value
        }));
    }

    render() {

        const { location, isAuthenticated } = this.props
        const { from } = location.state || { from: { pathname: '/' } }

        if (isAuthenticated === true) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div className={style.login}>
                <p>You must log in to view the page at {from.pathname}</p>
                <input type="text" placeholder="Username" ref="username" /><br />
                <input type="password" placeholder="Password" ref="password" /><br />
                <button onClick={this.login}>Log in</button>
            </div>
        )
    }
}

export default stateAware(state => ({
    isAuthenticated: state.ok
}))(Login)

