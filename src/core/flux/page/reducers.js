import Immutable, { Map } from 'immutable';
import pageTypes from './types';

export default {
    pageReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case pageTypes.PAGE_DOCK:
                return pageDock(state, action);
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
    return Immutable.fromJS(future);
};
