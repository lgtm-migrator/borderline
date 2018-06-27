import React, { Component } from 'react';
import SVG from 'components/SVG';
import style from './style.module.css';
import logo from './images/logo.svg';

class StatusIndicator extends Component {

    // Custom name for container
    static displayName = 'StatusIndicator';

    constructor(props) {
        super(props);
        this.toogleInfo = this.toogleInfo.bind(this);
        this.handle = React.createRef();
        this.state = {
            showInfo: false,
            position: new DOMRect()
        };
    }

    toogleInfo = () => {
        this.setState({
            showInfo: !this.state.showInfo,
            position: this.handle.current.getBoundingClientRect()
        });
    }

    render() {
        const { position: { x, width }, showInfo } = this.state;
        const left = x + width / 2 - 20;
        return (
            <div className={style.status} onClick={this.toogleInfo} ref={this.handle}>
                <SVG src={logo} className={style.logo} />
                <div className={`${showInfo === false ? style.infoHide : ''} ${style.infoBox}`} style={{ left: left }} >
                    <h2>Let us know what you think !</h2>
                    <br /><br />
                    <span>Thank you for using Borderline ! We hope your experience with it is great. But if you are having issues we are happy to help, just <a target="_top" href="https://github.com/dsi-icl/borderline/issues/new">file an issue here</a></span>
                </div>
            </div>
        );
    }
}

export default StatusIndicator;
