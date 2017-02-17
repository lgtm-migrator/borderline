import React, { PureComponent } from 'react';

import loaderStyles from '../styles/Loader.css';

class StatusBarComponent extends PureComponent {

    render() {
        return (
            <div className={loaderStyles.loader}></div>
        );
    }
}

export default StatusBarComponent;
