import React, { Component } from 'react';
import Enclave from 'containers/Enclave';
import { stateAware } from 'utilities/storeManager';

@stateAware(state => ({
    isDoneDiscoverying: state.ok,
    extensions: state.list
}))
class Injector extends Component {

    // Custom name for container
    static displayName = 'Injector';

    shouldComponentUpdate(nextProps) {
        return this.props.isDoneDiscoverying !== nextProps.isDoneDiscoverying;
    }

    render() {
        const { isDoneDiscoverying, extensions } = this.props;
        if (isDoneDiscoverying === true)
            return Object.keys(extensions).map((key) =>
                <Enclave key={key} domain={'extensions'} modelName={key} model={extensions[key].model} />
            );
        return null;
    }
}

export default Injector;
