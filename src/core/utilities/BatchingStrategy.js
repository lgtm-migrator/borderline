/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import React from 'react';
import ReactDOM from 'react-dom';
import ReactUpdates from 'react-dom/lib/ReactUpdates';
import ReactDefaultBatchingStrategy from 'react-dom/lib/ReactDefaultBatchingStrategy';

import Stale from '../components/Stale';

let isHandlingError = false;
let staleContainer = null;
const BatchingStrategy = {

    // this is part of the BatchingStrategy API. simply pass along
    // what the default batching strategy would do
    get isBatchingUpdates() {
        return ReactDefaultBatchingStrategy.isBatchingUpdates;
    },

    batchedUpdates(...args) {
        try {
            if (args[2] instanceof Element)
                staleContainer = args[2];
            ReactDefaultBatchingStrategy.batchedUpdates(...args);
        } catch (e) {
            if (isHandlingError) {
                // our error handling code threw an error. just throw now
                throw e;
            }
            isHandlingError = true;
            try {
                ReactDOM.render(<Stale />, staleContainer);
                if (process.env.NODE_ENV === 'development')
                    console.error('An error occured while rendering an extension:\n', e); // eslint-disable-line no-console
            } finally {
                isHandlingError = false;
            }
        }
    },
};

export default {
    inject: () => {
        ReactUpdates.injection.injectBatchingStrategy(BatchingStrategy);
    }
};
