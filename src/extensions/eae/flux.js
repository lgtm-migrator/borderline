import { of, concat } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// import NavigationButton from './containers/NavigationButton';
import StatusIndicator from './containers/StatusIndicator';
import View from './containers/View';
import { AnalysesIcon, AnalysesPanel, StepStage } from './containers/WorkflowStep';

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
    }),

    dockToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'EAE Analysis',
            input: ['tm_result', 'file_result', 'eae_result'],
            output: ['eae_result'],
            sidebar: {
                analyses: {
                    path: '/analyses',
                    icon: AnalysesIcon,
                    panel: AnalysesPanel
                }
            },
            stage: StepStage
        }
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() =>
                concat(
                    of(actions.dockToPager()),
                    of(actions.dockToStatusBar()),
                    of(actions.dockToWorkflow())
                ))),

    workflowStarted:
        (action) => action.ofType('@@extensions/workflow/STARTED')
            .pipe(mergeMap(() => of(actions.dockToWorkflow())))

};

export const reducers = {
};

export default {
    actions,
    epics,
    reducers
};
