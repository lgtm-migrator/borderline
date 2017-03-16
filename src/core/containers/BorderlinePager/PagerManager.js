/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component } from 'react';
import Navigation from './Navigation';
import Content from './Content';
import BorderlineScene from '../BorderlineScene';
import pageFlux from './flux';
// import SidebarExample from './SidebarRouterTest';

// Container delcaration
export default class PagerManager extends Component {

    // Custom name for container
    static displayName = 'PagerManager';

    componentWillUpdate(next) {
        console.debug('PagerManager > componentWillUpdate', next); // eslint-disable-line no-console
    }

    // shouldComponentUpdate() {
    //     console.log('Navigation > shouldComponentUpdate'); // eslint-disable-line no-console
    //     return true;
    // }

    render() {
        console.log('PagerManager > render'); // eslint-disable-line no-console
        const Wrapper = borderline.components.wrapper;
        return (
            <BorderlineScene scene={'core'} seed={pageFlux}>
                <Wrapper relative>
                    {/* <SidebarExample/>*/}
                    <Content />
                    <Navigation />
                </Wrapper>
            </BorderlineScene>
        );
    }
}
