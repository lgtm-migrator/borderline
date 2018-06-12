import { of, concat } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UploadStage } from './containers/WorkflowStep';
import { TextStage } from './containers/WorkflowStep';

export const actions = {

    dockUploadToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'File Upload',
            identifier: 'upload',
            input: [],
            output: ['file_result'],
            stage: UploadStage
        }
    }),

    dockTextToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'Free Text',
            identifier: 'text',
            input: [],
            output: ['file_result'],
            stage: TextStage
        }
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() =>
                concat(
                    of(actions.dockUploadToWorkflow()),
                    of(actions.dockTextToWorkflow())
                )
            )),

    workflowStarted:
        (action) => action.ofType('@@extensions/workflow/STARTED')
            .pipe(mergeMap(() =>
                concat(
                    of(actions.dockUploadToWorkflow()),
                    of(actions.dockTextToWorkflow())
                )
            )),
};

export const reducers = {
};

export default {
    actions,
    epics,
    reducers
};
