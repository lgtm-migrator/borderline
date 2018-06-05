import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import Editor from 'components/Editor';
import style from './style.module.css';

class View extends Component {

    // Custom name for container
    static displayName = 'View';

    render() {

        const { match } = this.props;
        return [
            <div key='menu' className={style.menu}>
                <NavLink to={`${match.url}/select`} activeClassName={style.active} className={style.button}>
                    Data Selection
                </NavLink>
                <NavLink to={`${match.url}/analysis`} activeClassName={style.active} className={style.button}>
                    Analysis
                </NavLink>
                <NavLink to={`${match.url}/result`} activeClassName={style.active} className={style.button}>
                    Result
                </NavLink>
            </div>,
            <div key='panel' className={style.panel}>
                <Switch>
                    <Route path={`${match.url}/select`} component={() => <div>Coucou Select</div>} />
                    <Route path={`${match.url}/analysis`} component={() => <Editor language="r" />} />
                    <Route path={`${match.url}/result`} component={() => <div>Storm Result</div>} />
                </Switch>
            </div>
        ];
    }
}

export default View;
