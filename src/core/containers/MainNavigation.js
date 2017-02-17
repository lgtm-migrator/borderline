import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import { dispatchProxy } from '../utilities/PluginContext';
import sessionActions from '../flux/session/actions';
import storeManager from '../utilities/StoreManager';
import navigationStyles from '../styles/MainNavigation.css';

@storeManager.injectStates('page', (page) => ({
    pages: page ? page.toJS().pages || [] : []
}))
class MainNavigationContainer extends Component {

    render() {
        const { pages, pathname = '' } = this.props;
        return (
            <div className={navigationStyles.bar}>
                <MainSearchBoxContainer />
                {pages.map((component) => (
                    <Route path={`${pathname}/${component.particule}`} exact={true} children={({ match }) => (
                        <Link to={`${pathname}/${component.particule}`} className={`${navigationStyles.button} ${match ? navigationStyles.active : ''}`}>
                            <div className={navigationStyles.link}>
                                <div className={navigationStyles.icon} dangerouslySetInnerHTML={{ __html: component.icon }} />
                                <div className={navigationStyles.title}>{component.name}</div>
                            </div>
                        </Link>
                    )} key={`${component.particule}_${(Math.random() * 1e32).toString(36)}}`} />
                ))}
                <LogoutButtonContainer dispatch={dispatchProxy('session', 'core')} />
            </div>
        );
    }
}

class MainSearchBoxContainer extends Component {

    render() {
        return (
            <div />
        );
    }
}

class LogoutButtonContainer extends Component {

    logout(e) {
        e.preventDefault();
        this.props.dispatch(sessionActions.sessionLogout());
    }

    render() {
        return (
            <div className={navigationStyles.button} onClick={this.logout.bind(this)}>
                <div className={navigationStyles.link}>
                    <div className={navigationStyles.icon} dangerouslySetInnerHTML={{ __html: 'L' }} />
                    <div className={navigationStyles.title}>Logout</div>
                </div>
            </div>
        );
    }
}

export default MainNavigationContainer;
