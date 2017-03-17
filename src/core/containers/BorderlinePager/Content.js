/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component, PropTypes as T } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';

import BorderlineScene from '../BorderlineScene';
import contentBoxStyles from './styles/Content.css';

// Container delcaration
@borderline.stateAware('Content')
export default class Content extends Component {

    // Custom name for container
    static displayName = 'Content';

    // Types for available context
    static contextTypes = {
        model: T.string
    };

    componentWillMount() {
        this.pages = [];
        this.contracted = true;
    }

    componentWillUpdate(next) {
        let state = next.state ? next.state[this.context.model] : null;
        this.pages = state ? state.toJS().pages || [] : [];
        this.contracted = state ? !state.toJS().expand : true;
    }

    render() {
        const { pathname = '' } = this.props;
        const Wrapper = borderline.components.wrapper;
        return (
            <Wrapper relative className={`${contentBoxStyles.stage} ${this.contracted ? contentBoxStyles.contract : ''}`}>
                {this.pages.map((component) => (
                    <Route path={`${pathname}/${component.particule}`} exact={true} component={() => (
                        <ContentBoxMountingContainer component={component} />
                    )} key={`${component.particule}_${(Math.random() * 1e32).toString(36)}}`} />
                ))}
            </Wrapper>
        );
    }
}

class ContentBoxMountingContainer extends Component {

    componentDidMount() {
        this.renderView();
    }

    componentDidUpdate() {
        this.renderView();
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.slot);
    }

    renderView() {
        const { component } = this.props;
        this.view = ReactDOM.render(
            <BorderlineScene model={component.origin} position={'pager'}>
                <component.view />
            </BorderlineScene>, this.slot
        );
    }

    render() {
        return (
            <div className={contentBoxStyles.box} ref={(slot) => { this.slot = slot; }} />
        );
    }
}
