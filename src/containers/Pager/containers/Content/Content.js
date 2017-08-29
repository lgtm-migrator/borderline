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
                <Route key={key} path={`/${views[key].path}`} render={ () =>
                    <Enclave key={key} domain={'extensions'} modelName={key} >
                        <Content />
                    </Enclave>
                } />
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
