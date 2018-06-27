import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import StepLoader from './StepLoader';

class StepNavigation extends Component {

    // Custom name for container
    static displayName = 'StepNavigation';

    render() {

        const { match: { url } } = this.props;

        return (
            <Switch>
                <Route path={`${url}/step/:sid`} render={StepLoader} />
                <Route component={StepLoader} />
            </Switch>
        );
    }
}

export default StepNavigation;
