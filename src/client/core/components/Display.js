import React, { PureComponent } from 'react';
import styles from './Style.css'

class Display extends PureComponent {
    render() {
        return (
            <h2 className={styles[this.props.color]}>Counter : {this.props.value}</h2>
        );
    }
}

export default Display;
