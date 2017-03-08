/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import Immutable, { Map } from 'immutable';
import pageTypes from './types';

export default {
    pageReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case pageTypes.PAGE_DOCK:
                return pageDock(state, action);
            case pageTypes.PAGE_MENU_TOGGLE:
                return pageMenuToggle(state, action);
            case '@@core/session/SESSION_LOGOUT':
                return logoutCleanup(state);
            default:
                return state;
        }
    }
};

const pageDock = (state, action) => {

    let future = state.toJS();
    future.pages = future.pages || [];
    future.pages.push({
        name: action.name,
        particule: action.particule,
        view: action.view,
        icon: action.icon,
        origin: action.__origin__
    });
        console.error('pageDock > ', future); // eslint-disable-line no-console
    return Immutable.fromJS(future);
};

const pageMenuToggle = (state, action) => {

    let future = state.toJS();
    future.expand = action.state !== undefined ? action.state : !future.expand;
    return Immutable.fromJS(future);
};

const logoutCleanup = (state) => {

    let future = state.toJS();
    future.pages = [];
    return Immutable.fromJS(future);
};
