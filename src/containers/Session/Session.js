import { Component } from 'react';
import { default as T } from 'prop-types';
import { reducers, epics } from './flux'

class Session extends Component {

    // Custom name for container
    static displayName = 'Session';
    get name() {
        return 'Session';
    }

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    // Custom properties for borderline model
    static modelName = 'session';
    static modelEpics = epics;
    static modelReducers = reducers;

    render() {
        const { children } = this.props;
        return children ? children : null;
    }
}

export default Session
