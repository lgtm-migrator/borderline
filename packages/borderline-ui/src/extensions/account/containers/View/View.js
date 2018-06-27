import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { stateAware } from 'utilities/storeManager';

@stateAware(state => ({
    user: state.user
}))
class View extends Component {

    // Custom name for container
    static displayName = 'View';

    render() {
        let status = null;
        if (this.props.user !== undefined) {
            const { _id, username, admin } = this.props.user;
            status = <div>View {username} ({_id}) is {admin ? 'admin' : 'not admin'}</div>;
        }
        return (
            <>
                <Helmet>
                    <title>Account</title>
                </Helmet>
                {status}
            </>
        );
    }
}

export default View;
