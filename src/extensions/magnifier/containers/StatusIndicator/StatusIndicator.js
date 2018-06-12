import React, { Component } from 'react';
import SVG from 'components/SVG';
import style from './style.module.css';
import inLogo from './images/in.svg';
import outLogo from './images/out.svg';

class StatusIndicator extends Component {

    // Custom name for container
    static displayName = 'StatusIndicator';

    constructor(props) {
        super(props);
        this.handle = React.createRef();
        this.state = {
            zoomLevel: 100
        };
    }

    zoomIn = () => {
        this.setState({
            zoomLevel: this.zoom(this.state.zoomLevel + 10)
        });
    }

    zoomOut = () => {
        this.setState({
            zoomLevel: this.zoom(this.state.zoomLevel - 10)
        });
    }

    zoomApply = (e) => {
        e.preventDefault();
        this.setState({
            zoomLevel: this.zoom(Number.parseInt(this.refs.zoomLevelRequest.value))
        });
    }

    zoom = (targetZoomLevel) => {
        const currentZoomLevel = this.state.zoomLevel;
        if (typeof targetZoomLevel !== 'number' || targetZoomLevel < 10)
            return currentZoomLevel;
        const styleAnchor = window.getComputedStyle(document.querySelector('html'));
        const currentFontSize = Number.parseFloat(styleAnchor.getPropertyValue('--font-size'));
        const targetFontSize = targetZoomLevel * currentFontSize / currentZoomLevel;
        if (typeof targetFontSize !== 'number' || targetFontSize.isNaN === true)
            return currentZoomLevel;
        document.querySelector('html').style.setProperty('--font-size', `${targetFontSize}px`);
        return targetZoomLevel;
    }

    render() {
        return (
            <div className={style.status}>
                <SVG src={outLogo} className={style.logo} onClick={this.zoomOut.bind(this)} />
                <form className={style.zoomForm} onSubmit={this.zoomApply.bind(this)}>
                    <input type="text" defaultValue={this.state.zoomLevel} ref="zoomLevelRequest" className={style.zoomValue} />
                </form>
                <SVG src={inLogo} className={style.logo} onClick={this.zoomIn.bind(this)} />
            </div>
        );
    }
}

export default StatusIndicator;
