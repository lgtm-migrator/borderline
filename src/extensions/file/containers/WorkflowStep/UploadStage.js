import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { stateAware } from 'utilities/storeManager';
import { actions } from '../../flux';
import style from './style.module.css';

@stateAware(state => ({
    fileState: state.stepObject !== undefined && state.stepObject !== null && state.stepObject.context !== undefined ? state.stepObject.context.fileState : {}
}))
class UploadStage extends Component {

    // Custom name for container
    static displayName = 'UploadStage';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    constructor(props) {
        super(props);
        this.state = {
            file: [],
        };
    }

    componentDidMount() {
        this.context.dispatch(actions.getCurrentStep());
    }

    fileChanged = (e) => {
        let fileState = {
            filename: e.target.value,
            file: e.target.files[0],
            size: e.target.files[0].size,
            type: e.target.files[0].type,
            lastModified: e.target.files[0].lastModified
        };
        this.context.dispatch(actions.saveFileHook(fileState));
    }

    pickFile = (e) => {
        e.preventDefault();
        this.refs.filePicker.click();
    }

    render() {
        const { fileState } = this.props;
        let details = null;
        if (fileState !== undefined)
            details = <>
                <h2>Current file on record</h2>
                <br />
                <span>File name: {this.props.fileState.filename}</span>
                <span>File size: {this.props.fileState.size}</span>
                <span>File type: {this.props.fileState.type}</span>
                <span>Last modified: {new Date(this.props.fileState.lastModified).toString()}</span>
            </>;
        return (
            <div className={style.uploadForm}>
                {details}
                <br /><br />
                <h2>Upload a different file</h2>
                <br />
                <button onClick={this.pickFile.bind(this)}>Pick a file</button>
                <input type="file" ref={'filePicker'} onChange={this.fileChanged.bind(this)} />
            </div>
        );
    }
}

export default UploadStage;
