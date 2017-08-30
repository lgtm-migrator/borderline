import { Component } from 'react';
import { default as T } from 'prop-types';
import { epics } from './flux';

class EAE extends Component {

    // Custom name for container
    static displayName = 'EAE';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    // Custom properties for borderline model
    static modelName = 'EAE';
    static modelEpics = epics;

    render() {
        const { children } = this.props;
        return children ? children : null;
    }
}

export default EAE;
