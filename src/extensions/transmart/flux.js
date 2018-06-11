import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { VennIcon, VennPanel, StepStage } from './containers/WorkflowStep';

export const actions = {

    dockToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'Transmart Cohort',
            input: [],
            output: ['tm_result'],
            sidebar: {
                analyses: {
                    path: '/van',
                    icon: VennIcon,
                    panel: VennPanel
                }
            },
            stage: StepStage
        }
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() => of(actions.dockToWorkflow())))

};

export const reducers = {
};

export default {
    actions,
    epics,
    reducers
};
