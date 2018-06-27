import React, { Component } from 'react';
import SVG from 'components/SVG';
import logo from './images/venn.svg';
import style from './style.module.css';

class AnalysesIcon extends Component {

    // Custom name for container
    static displayName = 'EAEAnalysesIcon';

    render() {
        return <SVG src={logo} className={style.logo} />;
    }
}

export default AnalysesIcon;
