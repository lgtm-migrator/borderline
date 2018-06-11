import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { StepStage } from './containers/WorkflowStep';

export const actions = {

    dockToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'File Upload',
            identifier: 'file',
            input: [],
            output: ['file_result'],
            stage: StepStage
        }
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() => of(actions.dockToWorkflow()))),

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
