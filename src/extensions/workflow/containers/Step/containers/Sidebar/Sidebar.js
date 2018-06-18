import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import SVG from 'components/SVG';
import StepList from './StepList';
import logo from './images/logo.svg';
import style from './style.module.css';

@stateAware(state => ({
    stepTypes: state.stepTypes,
    stepsList: state.stepsList,
    currentWorkflow: state.currentWorkflow,
    currentStep: state.currentStep
}))
class Sidebar extends Component {

    // Custom name for container
    static displayName = 'Sidebar';

    render() {

        const { stepsList, currentWorkflow, currentStep, stepTypes, match: { url } } = this.props;
        if (stepsList[currentWorkflow] === undefined || currentStep === null || stepsList[currentWorkflow][currentStep] === undefined)
            return null;
        const step = stepsList[currentWorkflow][currentStep];
        if (step === undefined || stepTypes[step.extension] === undefined)
            return null;
        const buttons = stepTypes[step.extension].sidebar || {};

        return (
            <div className={style.sidebar}>
                <div className={style.menu}>
                    {Object.keys(buttons).map((key) => {
                        const Icon = buttons[key].icon;
                        return <NavLink to={`${url}/${buttons[key].path}`} key={key} activeClassName={style.navActive} className={style.navButton}>
                            <Icon className={style.logo} />
                        </NavLink>;
                    })}
                    <NavLink exact to={`${url}`} activeClassName={style.navActive} className={style.navButton}>
                        <SVG src={logo} className={style.logo} />
                    </NavLink>
                </div>
                <div className={style.panel}>
                    <Switch>
                        {Object.keys(buttons).map((key) => {
                            const Panel = buttons[key].panel;
                            return <Route path={`${url}/${buttons[key].path}`} key={key} component={Panel} />;
                        })}
                        <Route render={StepList} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Sidebar;
