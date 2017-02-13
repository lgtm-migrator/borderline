import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import storeManager from '../utilities/StoreManager';
import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/TopBar.css';

@storeManager.injectStates('page', (page) => ({
    list: page ? page.toJS().pages || [] : []
}))
class TopBarContainer extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            subappLinks: null,
        };
    }

    componentDidUpdate(prevProp) {
        if (prevProp.list.length != this.props.list.length)
            this.createSubappLinks();
    }

    createSubappLinks() {
        let pathname = this.props.pathname || '';
        this.setState({
            subappLinks: this.props.list.map((component) => (
                <Route path={`${pathname}/${component.particule}`} exact={true} children={({ match }) => (
                    <Link to={`${pathname}/${component.particule}`} className={match ? styles.subappbuttonactive : styles.subappbutton}>{component.name}</Link>
                )} key={`${component.particule}_${(Math.random() * 1e32).toString(36)}}`} />
            ))
        });
    }

    render() {
        return (
            <div className={styles.backdrop}>
                <div className={styles.topbar}>
                    <WrapClear>
                        {this.state.subappLinks}
                    </WrapClear>
                </div>
            </div>
        );
    }
}

export default TopBarContainer;
