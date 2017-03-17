/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import StoreContainer from './StoreContainer';
import pageIcon from './images/pageIcon.svg';

export default {
    onReady:
    (action) => action.ofType('START')
        .mapTo({
            type: '@@core/page/PAGE_DOCK',
            name: 'Extensions',
            particule: 'store',
            view: StoreContainer,
            icon: pageIcon
        })
};
