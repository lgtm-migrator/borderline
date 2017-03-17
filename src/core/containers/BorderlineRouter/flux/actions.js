/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import routerTypes from './types';

export default {

    routerLocationChange: (location) => ({
        type: routerTypes.LOCATION_CHANGE,
        location: location
    })
};
