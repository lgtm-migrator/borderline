import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Body from 'components/Body';
import Login from 'containers/Login';
import Enclave from 'containers/Enclave';
import PrivateRoute from 'containers/PrivateRoute';

class BorderlineApplication extends React.Component {

    // Custom name for container
    static displayName = 'BorderlineApplication';

    render() {
        return (
            <Body>
                <Enclave model={import('containers/Session')}>
                    <Switch>
                        <Route exact path="/public" component={() => <h3>Public</h3>} />
                        <Route exact path="/login" component={Login} />
                        <PrivateRoute>
                            <Enclave model={import('containers/Pager')} />
                        </PrivateRoute>
                    </Switch>
                </Enclave>
            </Body>
        );
    }
}

export default BorderlineApplication;
