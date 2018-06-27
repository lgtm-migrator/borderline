import React, { Component } from 'react';
import SVG from 'components/SVG';
import style from './style.module.css';
import logo from './images/logo.svg';

class StatusIndicator extends Component {

    // Custom name for container
    static displayName = 'StatusIndicator';

    constructor(props) {
        super(props);
        this.documentHandle = document.querySelector('html');
        this.toogleInfo = this.toogleInfo.bind(this);
        this.colorOut = this.colorOut.bind(this);
        this.handle = React.createRef();
        this.state = {
            showPalette: false,
            position: new DOMRect()
        };
    }

    toogleInfo = () => {
        this.colorBackup = [
            Number.parseInt(window.getComputedStyle(this.documentHandle).getPropertyValue('--color-accent-h'), 10),
            Number.parseInt(window.getComputedStyle(this.documentHandle).getPropertyValue('--color-accent-s'), 10),
            Number.parseInt(window.getComputedStyle(this.documentHandle).getPropertyValue('--color-accent-l'), 10)
        ];
        this.setState({
            showPalette: !this.state.showPalette,
            position: this.handle.current.getBoundingClientRect()
        });
    }

    colorHover = (color) => {
        this.colorApply(color);
    }

    colorOut = () => {
        this.colorApply(this.colorBackup);
    }

    colorSelect = (color) => {
        this.colorBackup = color;
        this.colorApply(color);
        this.setState({
            showPalette: false
        });
    }

    colorApply = (color) => {
        this.documentHandle.style.setProperty('--color-accent-h', color[0]);
        this.documentHandle.style.setProperty('--color-accent-s', `${color[1]}%`);
        this.documentHandle.style.setProperty('--color-accent-l', `${color[2]}%`);
    }

    render() {
        const { position: { x, width }, showPalette } = this.state;
        const left = x + width / 2 - 20;
        const colors = [
            [4, 90, 58], [340, 82, 53], [291, 64, 42], [262, 52, 47], [231, 48, 48], [207, 90, 54],
            [199, 98, 48], [188, 64, 44], [174, 100, 29], [122, 39, 49], [88, 46, 69], [66, 70, 54],
            [54, 100, 62], [45, 100, 51], [36, 100, 50], [14, 100, 57], [16, 25, 38], [200, 18, 46]];
        return (
            <div className={style.status} onClick={this.toogleInfo} ref={this.handle}>
                <SVG src={logo} className={style.logo} />
                <div className={`${showPalette === false ? style.hidePalette : ''} ${style.paletteBox}`} style={{ left: left }} >
                    <h2>How is your mood today ?</h2>
                    <br /><br />
                    {colors.map((color, index) =>
                        <span className={style.colorBubble} key={index} style={{ backgroundColor: `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)` }} onMouseEnter={this.colorHover.bind(null, color)} onMouseLeave={this.colorOut} onClick={this.colorSelect.bind(null, color)}></span>
                    )}
                </div>
            </div>
        );
    }
}

export default StatusIndicator;
