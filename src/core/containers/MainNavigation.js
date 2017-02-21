import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import { dispatchProxy } from '../utilities/PluginContext';
import pageActions from '../flux/page/actions';
import sessionActions from '../flux/session/actions';
import storeManager from '../utilities/StoreManager';
import navigationStyles from '../styles/MainNavigation.css';
import logoutIcon from '../styles/images/logoutIcon.svg';
import searchIcon from '../styles/images/searchIcon.svg';
import menuTitleIcon from '../styles/images/menuTitleIcon.svg';
import menuIcon from '../styles/images/menuIcon.svg';

import Icon from './SVGContainer';

@storeManager.injectStates('page', (page) => ({
    pages: page ? page.toJS().pages || [] : [],
    expanded: page ? page.toJS().expand || false : false
}))
class MainNavigationContainer extends Component {

    render() {
        const { pages, expanded, pathname = '' } = this.props;
        return (
            <div className={`${navigationStyles.bar} ${expanded ? navigationStyles.expand : ''}`}>
                {expanded}
                <ExpandMenuButtonContainer dispatch={dispatchProxy('page', 'core')} expanded={expanded} />
                <MainSearchBoxContainer />
                {pages.map((component) => (
                    <Route path={`${pathname}/${component.particule}`} exact={true} children={({ match }) => (
                        <Link to={`${pathname}/${component.particule}`} className={`${navigationStyles.button} ${match ? navigationStyles.active : ''}`}>
                            <div className={navigationStyles.link}>
                                <div className={navigationStyles.icon}>
                                    <Icon src={component.icon} />
                                </div>
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

class ExpandMenuButtonContainer extends Component {

    expand(e) {
        e.preventDefault();
        this.props.dispatch(pageActions.pageMenuToggle());
    }

    render() {
        const { expanded } = this.props;
        return (
            <div className={navigationStyles.button} onClick={this.expand.bind(this)}>
                <div className={navigationStyles.link}>
                    <div className={navigationStyles.icon}>
                        {expanded ? <Icon src={menuIcon} /> : <Icon src={menuTitleIcon} />}
                    </div>
                </div>
            </div>
        );
    }
}

class MainSearchBoxContainer extends Component {

    render() {
        return (
            <div className={navigationStyles.button}>
                <div className={navigationStyles.link}>
                    <div className={navigationStyles.icon}>
                        <Icon src={searchIcon} />
                    </div>
                    <div className={navigationStyles.title}>Search</div>
                </div>
            </div>
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
            <div className={`${navigationStyles.button} ${navigationStyles.logout}`} onClick={this.logout.bind(this)}>
                <div className={navigationStyles.link}>
                    <div className={navigationStyles.icon}>
                        <Icon src={logoutIcon} />
                    </div>
                    <div className={navigationStyles.title}>Logout</div>
                </div>
            </div>
        );
    }
}

export default MainNavigationContainer;
