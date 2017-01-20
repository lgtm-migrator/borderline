import React, { PureComponent } from 'react';

class StatusBarComponent extends PureComponent {

    render() {
        return (
            <div>Status : {this.props.status}</div>
        );
    }
}

export default StatusBarComponent;
