import React, { Component } from 'react'
import { default as T } from 'prop-types';
import { NavLink } from 'react-router-dom'
import Enclave from 'containers/Enclave'
import { stateAware } from 'utilities/storeManager'
import './style.css'

class Navigation extends Component {

    static contextTypes = {
        router: T.object
    }

    render() {
        const { buttons } = this.props
        const panels = Object.keys(buttons).map(key => {
            const Component = buttons[key].icon
            return <NavLink key={key} to={`/${buttons[key].path}`} activeClassName="active" >
                <Enclave key={key} domain={'extensions'} modelName={key} >
                    <Component />
                </Enclave>
            </NavLink>
        });
        return (
            <div className="navigation">
                {panels}
            </div>
        )
    }
}

export default stateAware(state => (state => ({
    buttons: state.pages || []
}))(state !== undefined && state.toJS !== undefined ? state.toJS() : {}))(Navigation)
