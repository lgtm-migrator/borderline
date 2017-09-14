import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Enclave from 'containers/Enclave';
import { stateAware } from 'utilities/storeManager';
import style from './style.css';

@stateAware(state => ({
    views: state.pages || []
}))
class Content extends Component {

    render() {
        const { views } = this.props;
        const panels = Object.keys(views).map(key => {
            const Content = views[key].view;
            return (
                <Enclave key={`${Math.random().toString(36).substr(2, 5)}|${views[key].origin}`} domain={'extensions'} modelName={views[key].origin} >
                    <Route path={`/${views[key].path}`} component={Content} />
                </Enclave>
            );
        });
        return (
            <div className={style.content}>
                {panels}
            </div>
        );
    }
}

export default Content;
