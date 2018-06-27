import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Enclave from 'containers/Enclave';
import { stateAware } from 'utilities/storeManager';
import style from './style.module.css';

@stateAware(state => ({
    buttons: state.pages || []
}))
class Navigation extends Component {

    render() {
        const { buttons } = this.props;
        const links = Object.keys(buttons).map(key => {
            const Component = buttons[key].icon;
            if (Component === undefined || Component === null)
                return null;
            return (
                <Enclave key={`${buttons[key].origin}|${buttons[key].path}`} domain={'extensions'} modelName={buttons[key].origin} >
                    <NavLink to={`/${buttons[key].path}`} activeClassName={style.active} >
                        <Component />
                    </NavLink>
                </Enclave>
            );
        });
        return (
            <div className={style.navigation}>
                {links}
            </div>
        );
    }
}

export default Navigation;
