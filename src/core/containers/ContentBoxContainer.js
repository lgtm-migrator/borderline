import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';

import storeManager from '../utilities/StoreManager';
import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/ContentBox.css';

@storeManager.injectStates('page', (page) => ({
    list: page ? page.toJS().pages || [] : []
}))
class ContentBoxContainer extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            subappContainers: null,
        };
    }

    componentDidMount() {
        this.createSubappContainers();
    }

    componentDidUpdate(prevProp) {
        if ((prevProp.list || []).length != (this.props.list || []).length)
            this.createSubappContainers();
    }

    createSubappContainers() {
        let pathname = this.props.pathname || '';
        this.setState({
            subappContainers: (this.props.list || []).map((component) => {
                return (
                    <Route path={`${pathname}/${component.particule}`} exact={true} component={() => (
                        <ContentBoxMountingContainer view={component.view} />
                    )} key={`${component.particule}_${(Math.random() * 1e32).toString(36)}}`} />
                );
            })
        });
    }

    render() {
        return (
            <div className={styles.contentbox}>
                <WrapClear>
                    {this.state.subappContainers}
                </WrapClear>
            </div>
        );
    }
}

class ContentBoxMountingContainer extends Component {

    componentDidMount() {
        this.renderView();
    }

    componentDidUpdate() {
        this.renderView();
    }

    renderView() {
        try {
            let View = this.props.view;
            ReactDOM.render(<View />, this.slot);
        } catch (e) {
            if (process.env.NODE_END !== 'production')
                console.error(e); // eslint-disable-line no-console
            ReactDOM.render(<ContentBoxStaleContainer />, this.slot);
        }
    }

    render() {
        return (
            <div className={styles.contentexpand} ref={(slot) => { this.slot = slot; }} />
        );
    }
}

class ContentBoxStaleContainer extends Component {

    render() {
        return (
            <div className={styles.contentstale} >△</div>
        );
    }
}

export default ContentBoxContainer;
