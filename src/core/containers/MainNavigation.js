import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

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

export default MainNavigationContainer;
