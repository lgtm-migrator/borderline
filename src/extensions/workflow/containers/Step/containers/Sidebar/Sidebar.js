import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { stateAware } from 'utilities/storeManager';
import SVG from 'components/SVG';
import StepList from './StepList';
import logo from './images/logo.svg';
import style from './style.module.css';

@stateAware(state => ({
    stepTypes: state.stepTypes
}))
class Sidebar extends Component {

    // Custom name for container
    static displayName = 'Sidebar';

    render() {
        return (
            <Route component={({ match: { url } }) =>
                <div className={style.sidebar}>
                    <div className={style.menu}>
                        <NavLink to={`${url}/plop`} activeClassName={style.navActive} className={style.navButton}>
                            FG
                        </NavLink>
                        <NavLink exact to={`${url}`} activeClassName={style.navActive} className={style.navButton}>
                            <SVG src={logo} className={style.logo} />
                        </NavLink>
                    </div>
                    <div className={style.panel}>
                        <Switch>
                            <Route path={`${url}/plop`} component={() => <div>PLOP</div>} />
                            <Route component={StepList} />
                        </Switch>
                    </div>
                </div>
            } />
        );
    }
}

export default Sidebar;
