/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import BorderlineStore from './BorderlineStore';
import storeManager from './utilities/StoreManager';
import batchingStrategy from './utilities/BatchingStrategy';

export default class BorderlineBootstrap {

    constructor() {
        this.startBorderline();
    }

    startBorderline() {

        // We apply a custom batching strategy
        batchingStrategy.inject();

        // We fetch the anchor of our app the the HTML template
        const root = document.getElementById('root');

        // We render the application
        ReactDOM.render(
            <AppContainer>
                <BorderlineStore store={storeManager.getStore()} />
            </AppContainer>,
            root
        );

        if (module.hot) {
            module.hot.accept('./BorderlineStore', () => {

                // Upon hot reload we fetch a new instance of the application and render it
                var HotBorderlineStore = require('./BorderlineStore').default;
                ReactDOM.render(
                    <AppContainer>
                        <HotBorderlineStore store={storeManager.getStore()} />
                    </AppContainer>,
                    root
                );
            });
        }
    }
}
