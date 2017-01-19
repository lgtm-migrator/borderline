import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Borderline from './Borderline';

class BorderlineProvider extends Component {

    render() {
        return (
            <Provider store={ this.props.store }>
                <Borderline />
            </Provider>
        );
    }
}

export default BorderlineProvider;
