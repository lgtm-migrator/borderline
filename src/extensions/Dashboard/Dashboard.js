import { Component } from 'react';
import { default as T } from 'prop-types';
import { epics } from './flux';

class Dashboard extends Component {

    // Custom name for container
    static displayName = 'Dashboard';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    // Custom properties for borderline model
    static modelName = 'dashboard';
    static modelEpics = epics;

    render() {
        const { children } = this.props;
        return children ? children : null;
    }
}

export default Dashboard;
