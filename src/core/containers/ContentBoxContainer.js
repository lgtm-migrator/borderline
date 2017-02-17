import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';

import { dispatchProxy } from '../utilities/PluginContext';
import storeManager from '../utilities/StoreManager';
import contentBoxStyles from '../styles/ContentBox.css';
import layoutStyles from '../styles/Layout.css';
import errorIcon from '../styles/images/errorIcon.svg';

@storeManager.injectStates('page', (page) => ({
    pages: page ? page.toJS().pages || [] : []
}))
class ContentBoxContainer extends Component {

    constructor() {
        super(...arguments);
    }

    render() {
        const { pages, pathname = '' } = this.props;
        return (
            <div className={contentBoxStyles.stage}>
                <div className={layoutStyles.wrap}>
                    {pages.map((component) => (
                        <Route path={`${pathname}/${component.particule}`} exact={true} component={() => (
                            <ContentBoxMountingContainer component={component} />
                        )} key={`${component.particule}_${(Math.random() * 1e32).toString(36)}}`} />
                    ))}
                </div>
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
            let View = this.props.component.view;
            ReactDOM.render(<View dispatch={dispatchProxy(this.props.component.origin)} />, this.slot);
        } catch (e) {
            if (process.env.NODE_END !== 'production')
                console.error(e); // eslint-disable-line no-console
            ReactDOM.render(<ContentBoxStaleContainer />, this.slot);
        }
    }

    render() {
        return (
            <div className={contentBoxStyles.box} ref={(slot) => { this.slot = slot; }} />
        );
    }
}

class ContentBoxStaleContainer extends Component {

    render() {
        return (
            <div className={`${contentBoxStyles.stale} ${contentBoxStyles.box}`} >
                <div className={contentBoxStyles.fab} dangerouslySetInnerHTML={{ __html: errorIcon }}></div>
            </div>
        );
    }
}

export default ContentBoxContainer;
