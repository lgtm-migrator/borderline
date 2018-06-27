import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Enclave from 'containers/Enclave';
import { stateAware } from 'utilities/storeManager';
import style from './style.module.css';

@stateAware(state => ({
    views: state.pages || []
}))
class Content extends Component {

    render() {
        const { views } = this.props;
        const panels = Object.keys(views).map(key => {
            const Content = views[key].view;
            return (
                <Enclave key={`${views[key].origin}`} domain={'extensions'} modelName={views[key].origin} >
                    <Route path={`/${views[key].path}`} render={props => <Content {...props} />} />
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
