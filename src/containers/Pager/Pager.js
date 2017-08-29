import React, { Component } from 'react';
import Enclave from 'containers/Enclave';
import Navigation from './containers/Navigation';
import Content from './containers/Content';
import { reducers } from './flux';

class Pager extends Component {

    // Custom name for container
    static displayName = 'Pager';

    // Custom properties for borderline model
    static modelName = 'pager';
    static modelReducers = reducers;

    render() {
        return [
            <Navigation key={'navigation'}/>,
            <Content key={'content'} />,
            <Enclave key={'inspector'} model={ import('containers/Inspector') } />
        ];
    }
}

export default Pager;
