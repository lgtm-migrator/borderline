import React, { Component } from 'react';
import Enclave from 'containers/Enclave';
import { stateAware } from 'utilities/storeManager';
import style from './style.module.css';

@stateAware(state => ({
    statuses: state.statuses || []
}))
class StatusBar extends Component {

    render() {
        const { statuses } = this.props;
        const items = Object.keys(statuses).map(key => {
            const Component = statuses[key].view;
            return (
                <Enclave key={`${statuses[key].origin}|${key}`} domain={'extensions'} modelName={statuses[key].origin} >
                    <div className={style.statusItem}>
                        <Component />
                    </div>
                </Enclave>
            );
        });

        return (
            <div className={style.statusBar}>
                {items}
            </div>
        );
    }
}

export default StatusBar;
