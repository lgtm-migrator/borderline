import React, { Component } from 'react';
import { WorkflowNavigation } from '../Workflow';

class View extends Component {

    // Custom name for container
    static displayName = 'View';

    render() {

        return (
            <WorkflowNavigation {...this.props} />
        );
    }
}

export default View;
