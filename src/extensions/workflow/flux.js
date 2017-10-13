import NavigationButton from './containers/NavigationButton';
import View from './containers/View';

export const actions = {

    dockToPager: () => ({
        type: '@@core/pager/PAGE_DOCK',
        path: 'workflow',
        icon: NavigationButton,
        view: View
    })
};

export const epics = {

    enclaveBoot:
    (action) => action.ofType('START')
        .mapTo(actions.dockToPager())

};

const initial = {};

export const reducers = {

    accountReducer:
    (state = initial, action) => {

        switch (action.type) {
            case 'STOP':
                return initial;
            default:
                return state;
        }
    }
};

export default {
    actions,
    epics,
    reducers
};
