import React, { Component } from 'react';
import { stateAware } from 'utilities/storeManager';

@stateAware(state => ({
    user: state.user
}))
class View extends Component {

    // Custom name for container
    static displayName = 'View';

    render() {
        if (this.props.user === undefined)
            return null;
        const { _id, username, admin } = this.props.user;
        return <div>View {username} ({_id}) is {admin ? 'admin' : 'not admin'}</div>;
    }
}

export default View;
