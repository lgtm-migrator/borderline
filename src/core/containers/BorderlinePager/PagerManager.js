/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import React, { Component } from 'react';
import BorderlineInspector from '../BorderlineInspector';
import PagerContext from './PagerContext';
import Navigation from './Navigation';
import Content from './Content';
import BorderlineScene from '../BorderlineScene';
import pageFlux from './flux';

// Container delcaration
export default class PagerManager extends Component {

    // Custom name for container
    static displayName = 'PagerManager';

    constructor(props, context) {
        super(props, context);
    }

    shouldComponentUpdate() {
        console.warn('PagerManager > shouldComponentUpdate'); // eslint-disable-line no-console
        return true;
    }

    render() {
        console.info('PagerManager > render'); // eslint-disable-line no-console
        const Wrapper = borderline.components.wrapper;
        return (
            <BorderlineScene scene={'core'} seed={pageFlux}>
                <PagerContext>
                    <BorderlineInspector>
                        <Wrapper>
                            <Content />
                            <Content />
                            <Navigation />
                        </Wrapper>
                    </BorderlineInspector>
                </PagerContext>
            </BorderlineScene>
        );
    }
}
