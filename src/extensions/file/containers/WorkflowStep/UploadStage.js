import React, { Component } from 'react';

class UploadStage extends Component {

    // Custom name for container
    static displayName = 'UploadStage';

    render() {
        return (
            <input type="file" />
        );
    }
}

export default UploadStage;
