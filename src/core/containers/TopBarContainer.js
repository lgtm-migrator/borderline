import React, { Component } from 'react';
import { Link } from 'react-router';

import StoreConnectable from '../decorators/StoreConnectable';
import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/TopBar.css';

@StoreConnectable(store => ({
    list: store.subAppsState.toJS().subapps
}))
class TopBarContainer extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            subappLinks: null,
        };
    }

    componentWillMount() {
        this.createSubappLinks();
    }

    componentWillUpdate() {
        this.createSubappLinks();
    }

    createSubappLinks() {
        let pathname = this.props.pathname || '';
        this.state.subappLinks = Object.keys(this.props.list || {}).map((key, value) => {
            return (
                <Link to={`${pathname}/${key}`} key={key} className={styles.subappbutton} activeClassName={styles.subappbuttonactive}>
                    {key}
                </Link>
            )
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
