/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React, { Component, PropTypes as T } from 'react';
import { Route, Link } from 'react-router-dom';


import navigationStyles from './Navigation.css';
import logoutIcon from './images/logoutIcon.svg';
import searchIcon from './images/searchIcon.svg';
import menuTitleIcon from './images/menuTitleIcon.svg';
import menuIcon from './images/menuIcon.svg';


// Container delcaration
export default class Navigation extends Component {

    // Custom name for container
    static displayName = 'Navigation';

    // Types for available context
    static contextTypes = {
        dispatch: T.func,
        pages: T.array,
        expanded: T.bool
    };

    constructor(props, context) {
        super(props, context);
    }

    shouldComponentUpdate() {
        console.warn('Navigation > shouldComponentUpdate'); // eslint-disable-line no-console
        return true;
        // return !(this.session && this.session.ok);
    }

    render() {
        console.info('Navigation > render', this.context); // eslint-disable-line no-console
        const { pathname = '' } = this.props;
        const { pages, expanded = []} = this.context;
        return (
            <div className={`${navigationStyles.bar} ${expanded ? navigationStyles.expand : ''}`}>
                {expanded}
                <ExpandMenuButtonContainer expanded={expanded} />
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
                <LogoutButtonContainer />
            </div>
        );
    }
}

class ExpandMenuButtonContainer extends Component {

    expand(e) {
        e.preventDefault();
        // this.props.dispatch(pageActions.pageMenuToggle());
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
        // this.props.dispatch(sessionActions.sessionLogout());
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
