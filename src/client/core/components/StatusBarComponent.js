import React, { PureComponent } from 'react';

import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/StatusBar.css';

class StatusBarComponent extends PureComponent {

    render() {
        return (
            <div className={styles.statusbar}>
                <WrapClear>
                    <div className={styles.statustext}>Status : {this.props.status}</div>
                </WrapClear>
            </div>
        );
    }
}

export default StatusBarComponent;
