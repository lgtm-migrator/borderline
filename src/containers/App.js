import React from 'react';
import { Route, Link } from 'react-router-dom'

class App extends React.Component {

    requireAuth(nextState, replace, callback) {
        console.log('PLOP')
        const token = window.sessionStorage.token;
        if (!token) {
            replace('/login');
            callback();
            return;
        }
        fetch('/api/auth/check', { headers: { 'Authorization': token } })
            .then(res => callback())
            .catch(err => {
                replace('/login');
                callback();
            })
    }

    logout(nextState, replace) {
        delete window.sessionStorage.token;
    }

    render() {
        return (
            <div>
                <header>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </header>

                <main>
                    <Route exact path="/login" onEnter={this.logout} component={() => <div>Login</div>} />
                    <Route exact path="/" onEnter={this.requireAuth} component={() => <div>Main</div>} />
                </main>
            </div>
        );
    }
}

export default App;
