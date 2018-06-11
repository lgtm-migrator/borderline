import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import style from './style.module.css';

@stateAware(state => ({
    currentStep: state.currentStep,
    stepsList: state.stepsList[state.currentWorkflow]
}))
class StepList extends Component {

    // Custom name for container
    static displayName = 'StepList';

    render() {
        const { stepsList, currentStep } = this.props;
        return (
            <Route component={({ match: { url } }) => Object.keys(stepsList).map((sid) =>
                <Link to={`${url.substr(0, url.lastIndexOf('/'))}/${sid}`} className={`${style.stepButton} ${sid === currentStep ? style.stepActive : ''}`} key={sid}>
                    {stepsList[sid].extension}
                </Link>
            )} />
        );
    }
}

export default StepList;
