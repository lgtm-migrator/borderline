import React, { PureComponent } from 'react';

import WrapClear from '../components/WrapClearComponent';
import styles from '../styles/TopBar.css';

class TopBarComponent extends PureComponent {

    render() {
        return (
            <div className={styles.backdrop}>
                <ul className={styles.topbar}>
                    <WrapClear>
                        <li className={styles.subappbutton}>Home</li>
                    </WrapClear>
                </ul>
            </div>
        );
    }
}

export default TopBarComponent;
