import { Observable } from 'rxjs';
// import NavigationButton from './containers/NavigationButton';
import StatusIndicator from './containers/StatusIndicator';
import View from './containers/View';

export const actions = {

    dockToPager: () => ({
        type: '@@core/pager/PAGE_DOCK',
        path: 'eae',
        // icon: NavigationButton,
        view: View
    }),

    dockToStatusBar: () => ({
        type: '@@core/pager/STATUS_DOCK',
        view: StatusIndicator
    })
};

export const epics = {

    enclaveBoot:
    (action) => action.ofType('START')
        .mergeMap(() =>
            Observable.concat(
                Observable.of(actions.dockToPager()),
                Observable.of(actions.dockToStatusBar())
            )),

};

export const reducers = {
};

export default {
    actions,
    epics,
    reducers
};
