import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Enclave from 'containers/Enclave';
import Navigation from './containers/Navigation';
import Content from './containers/Content';
import StatusBar from './containers/StatusBar';
import { reducers } from './flux';

class Pager extends Component {

    // Custom name for container
    static displayName = 'Pager';

    // Custom properties for borderline model
    static modelName = 'pager';
    static modelReducers = reducers;

    render() {
        return (
            <>
                <Helmet>
                    <title>Borderline Interface</title>
                </Helmet>
                <Navigation key={'navigation'}/>
                <Content key={'content'} />
                <StatusBar key={'status'} />
                <Enclave key={'inspector'} model={ import('containers/Inspector') } />
            </>
        );
    }
}

export default Pager;
