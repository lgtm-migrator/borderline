import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import StepLoader from './StepLoader';

class StepNavigation extends Component {

    // Custom name for container
    static displayName = 'StepNavigation';

    render() {

        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${match.url}/step/:sid`} component={StepLoader} />
                <Route component={StepLoader} />
            </Switch>
        );
    }
}

export default StepNavigation;
