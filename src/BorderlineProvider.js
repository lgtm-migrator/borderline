import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { history, store, stateAware } from 'utilities/storeManager';
import BorderlineApplication from 'BorderlineApplication';

class BorderlineProvider extends React.Component {

    // Custom name for container
    static displayName = 'BorderlineProvider';

    componentWillMount() {
        window.stateAware = stateAware;
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {

        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                     <BorderlineApplication />
                </ConnectedRouter>
            </Provider>
        )
    }
}

export default BorderlineProvider;
