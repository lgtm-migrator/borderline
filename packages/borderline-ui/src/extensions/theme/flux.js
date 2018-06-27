import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import StatusIndicator from './containers/StatusIndicator';

export const actions = {

    dockToStatusBar: () => ({
        type: '@@core/pager/STATUS_DOCK',
        view: StatusIndicator
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() => of(actions.dockToStatusBar())))

};

export const reducers = {
};

export default {
    actions,
    epics,
    reducers
};
