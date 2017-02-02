import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import storeManager from '../utilities/StoreManager';
import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/ContentBox.css';

@storeManager.injectStates('0000-00-000', (page) => ({
    list: page ? page.toJS().pages || [] : []
}))
class ContentBoxContainer extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            subappContainers: null,
        };
    }

    componentDidUpdate(prevProp) {
        if (prevProp.list.length != this.props.list.length)
            this.createSubappContainers();
    }

    createSubappContainers() {
        let pathname = this.props.pathname || '';
        this.setState({
            subappContainers: this.props.list.map((component) => {
                let View = component.view;
                return (
                    <Route path={`${pathname}/${component.particule}`} exact={true} component={() => (
                        <div className={styles.contentcontainer}><View /></div>
                    )} key={`${component.particule}d`} />
                );
            })
        });
    }

    render() {
        return (
            <div className={styles.contentbox}>
                <WrapClear>
                    {this.state.subappContainers}
                    <div className={styles.placeholder}>&#9640;</div>
                </WrapClear>
            </div>
        );
    }
}

export default ContentBoxContainer;
