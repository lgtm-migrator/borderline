import React, { PureComponent, Children } from 'react';

import styles from '../styles/WrapClear.css';

class WrapClearComponent extends PureComponent {

    render() {
        return (
            <div className={`${styles.wrap} ${this.props.className}`}>
                {Children.map(this.props.children, child => child)}
            </div>
        );
    }
}

export default WrapClearComponent;
