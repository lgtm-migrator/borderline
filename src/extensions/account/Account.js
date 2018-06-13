import { Component } from 'react';
import { epics, reducers } from './flux';

class Account extends Component {

    // Custom name for container
    static displayName = 'Account';

    // Custom properties for borderline model
    static modelName = 'account';
    static modelEpics = epics;
    static modelReducers = reducers;

    render() {
        return null;
    }
}

export default Account;
