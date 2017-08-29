
import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { stateAware } from 'utilities/storeManager'

class PrivateRoute extends Component {

    // Custom name for container
    static displayName = 'PrivateRoute';

    render() {
        const { children, isAuthenticated, ...rest } = this.props;

        return <Route { ...rest } render={props =>
            isAuthenticated === true ? children : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
        } />
    }
}

export default stateAware(state => (state => ({
    isAuthenticated: state.ok
}))(state !== undefined && state.toJS !== undefined ? state.toJS() : {}))(PrivateRoute)
