import NavigationButton from './containers/NavigationButton'
import View from './containers/View'

export const actions = {

    dockToPager: () => ({
        type: '@@core/pager/PAGE_DOCK',
        path: 'eae',
        icon: NavigationButton,
        view: View
    })
};

export const epics = {

    enclaveBoot:
    (action) => action.ofType('START')
        .mapTo(actions.dockToPager()),

};

export const reducers = {
}

export default {
    actions,
    epics,
    reducers
};
