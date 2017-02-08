import React, { Component } from 'react';

import loginStyles from '../styles/Login.css';
import layoutStyles from '../styles/Layout.css';

class LoginContainer extends Component {

    render() {
        return (
            <div className={`${layoutStyles.expand} ${loginStyles.screen}`}>
                <div className={loginStyles.box}>
                    <div className={loginStyles.title}>
                        <span>borderline<strong>:</strong></span>
                    </div>
                    <div className={loginStyles.form}>
                        <input type="text" placeholder="Username" /><br /><br />
                        <input type="password" placeholder="Password" /><br /><br />
                        <button>Login</button><br /><br />
                        <span>I forgot my password</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginContainer;
