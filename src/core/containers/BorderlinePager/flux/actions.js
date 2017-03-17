/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import pageTypes from './types';

export default {

    pageMenuToggle: (state) => ({
        type: pageTypes.PAGE_MENU_TOGGLE,
        state: state
    })
};
