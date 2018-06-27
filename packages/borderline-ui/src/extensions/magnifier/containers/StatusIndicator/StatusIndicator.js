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
        this.state = {
            zoomLevel: 100
        };
        this.lockingClientRect = null;
        this.lockingFontSize = null;
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.zoomApply = this.zoomApply.bind(this);
        this.magnifierIn = this.magnifierIn.bind(this);
        this.magnifierOut = this.magnifierOut.bind(this);
    }

    magnifierIn = () => {
        if (this.lockingClientRect === null) {
            let referenceStyle = window.getComputedStyle(this.refs.magnifierLodge);
            this.lockingClientRect = this.refs.magnifierLodge.getBoundingClientRect();
            this.lockingFontSize = Number.parseFloat(referenceStyle.getPropertyValue('--font-size'));
            this.refs.magnifierContainer.style.setProperty('position', 'fixed');
            this.refs.magnifierContainer.style.setProperty('top', `${this.lockingClientRect.top}px`);
            this.refs.magnifierContainer.style.setProperty('left', `${this.lockingClientRect.left}px`);
            this.refs.magnifierContainer.style.setProperty('height', `${this.lockingClientRect.height}px`);
            this.refs.magnifierContainer.style.setProperty('width', `${this.lockingClientRect.width}px`);
            this.refs.magnifierContainer.style.setProperty('font-size', `${this.lockingFontSize}px`);
            this.refs.magnifierContainer.classList.add(style.forced);
        }
    }

    magnifierOut = (e) => {
        if (e.clientX > this.lockingClientRect.left + this.lockingClientRect.width || e.clientX < this.lockingClientRect.left ||
            e.clientY > this.lockingClientRect.top + this.lockingClientRect.height || e.clientY < this.lockingClientRect.top) {
            this.refs.magnifierContainer.classList.remove(style.forced);
            this.lockingClientRect = null;
            this.lockingFontSize = null;
            this.refs.magnifierContainer.style.cssText = '';
        }
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
            zoomLevel: this.zoom(Number.parseInt(this.refs.zoomLevelRequest.value, 10))
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
            <div className={style.status} ref="magnifierLodge" onMouseLeave={this.magnifierOut} onMouseEnter={this.magnifierIn}>
                <div className={style.container} ref="magnifierContainer">
                    <SVG src={outLogo} className={style.logo} onClick={this.zoomOut} />
                    <form className={style.zoomForm} onSubmit={this.zoomApply}>
                        <input type="text" value={this.state.zoomLevel} ref="zoomLevelRequest" onChange={() => { }} className={style.zoomValue} />
                    </form>
                    <SVG src={inLogo} className={style.logo} onClick={this.zoomIn} />
                </div>
            </div>
        );
    }
}

export default StatusIndicator;
