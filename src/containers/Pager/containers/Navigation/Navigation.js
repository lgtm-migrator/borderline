import React, { Component } from 'react'
import { default as T } from 'prop-types';
import { NavLink } from 'react-router-dom'
import Enclave from 'containers/Enclave'
import { stateAware } from 'utilities/storeManager'
import style from './style.css';

class Navigation extends Component {

    static contextTypes = {
        router: T.object
    }

    render() {
        const { buttons } = this.props
        const panels = Object.keys(buttons).map(key => {
            const Component = buttons[key].icon
            return <NavLink key={key} to={`/${buttons[key].path}`} activeClassName={style.active} >
                <Enclave key={key} domain={'extensions'} modelName={key} >
                    <Component />
                </Enclave>
            </NavLink>
        });
        return (
            <div className={style.navigation}>
                {panels}
            </div>
        )
    }
}

export default stateAware(state => ({
    buttons: state.pages || []
}))(Navigation)
