import { of, concat } from 'rxjs';
import { mergeMap, mapTo } from 'rxjs/operators';
import { UploadStage } from './containers/WorkflowStep';
import { TextStage } from './containers/WorkflowStep';

const types = {

    FILE_STEP_HYDRATE: 'FILE_STEP_HYDRATE',
    FILE_STEP_HYDRATE_SUCCESS: 'FILE_STEP_HYDRATE_SUCCESS',
    FILE_STEP_CLEAR: 'FILE_STEP_CLEAR',
    FILE_STEP_EXECUTE_SUCCESS: 'FILE_STEP_EXECUTE_SUCCESS',
    FILE_STEP_EXECUTE_FAILURE: 'FILE_STEP_EXECUTE_FAILURE',
    FILE_FETCH_RESULT_SUCCESS: 'FILE_FETCH_RESULT_SUCCESS',
    FILE_FETCH_RESULT_FAILURE: 'FILE_FETCH_RESULT_FAILURE',
    FILE_QUERY_PANEL_UPDATE: 'FILE_QUERY_PANEL_UPDATE',
    FILE_QUERY_EXECUTE: 'FILE_QUERY_EXECUTE',
    FILE_QUERY_EXECUTE_SUCCESS: 'FILE_QUERY_EXECUTE_SUCCESS',
    FILE_QUERY_EXECUTE_FAILURE: 'FILE_QUERY_EXECUTE_FAILURE',
    FILE_QUERY_POLL: 'FILE_QUERY_POLL',
    FILE_QUERY_LOAD: 'FILE_QUERY_LOAD',
    FILE_QUERY_LOAD_SUCCESS: 'FILE_QUERY_LOAD_SUCCESS',
    FILE_QUERY_LOAD_FAILURE: 'FILE_QUERY_LOAD_FAILURE',
    FILE_QUERY_FINISHED_SUCCESS: 'FILE_QUERY_FINISHED_SUCCESS',
    FILE_QUERY_FINISHED_FAILURE: 'FILE_QUERY_FINISHED_FAILURE',
    FILE_QUERIES_DID_LOAD: 'FILE_QUERIES_DID_LOAD'
};

export const actions = {

    dockUploadToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'File Upload',
            identifier: 'upload',
            inputs: [null],
            outputs: ['text_result'],
            stage: UploadStage
        }
    }),

    dockTextToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'Free Text',
            identifier: 'text',
            inputs: [null, 'text_result'],
            outputs: ['text_result'],
            stage: TextStage
        }
    }),

    getCurrentStep: () => ({
        type: '@@extensions/workflow/STEP_FETCH',
        replyTo: types.FILE_STEP_HYDRATE
    }),

    clearCurrentStep: () => ({
        type: types.FILE_STEP_CLEAR
    }),

    updateStepStatus: (step, name, data) => ({
        type: '@@extensions/workflow/STEP_STATUS_UPDATE',
        status: {
            step: step,
            name: name,
            data: data
        }
    }),

    saveFileText: (fileText) => ({
        type: types.FILE_QUERY_PANEL_UPDATE,
        fileText: fileText
    }),

    saveStep: (step) => ({
        type: '@@extensions/workflow/STEP_UPDATE',
        step: step
    }),

    receiveStepSuccess: () => ({
        type: types.FILE_STEP_HYDRATE_SUCCESS
    }),

    fetchResultSuccess: (data) => ({
        type: types.FILE_FETCH_RESULT_SUCCESS,
        data: data
    }),

    fetchResultFailure: () => ({
        type: types.FILE_FETCH_RESULT_SUCCESS
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

    receiveStep:
        (action) => action.ofType(types.FILE_STEP_HYDRATE)
            .pipe(mapTo(actions.receiveStepSuccess())),

    receiveStepSuccess:
        (action, state) => action.ofType(types.FILE_STEP_HYDRATE_SUCCESS)
            .pipe(mergeMap(() => of(actions.updateStepStatus(state.stepObject._id, 'finished')))),

    queryPanelUpdate:
        (action, state) => action.ofType(types.FILE_QUERY_PANEL_UPDATE)
            .pipe(mergeMap(() => of(actions.saveStep(state.stepObject)))),

    fetchResult:
        (action, state) => action.ofType('FETCH_STEP_RESULT')
            .pipe(mergeMap((action) => of({ type: `@@extensions/${action.__origin__}/STEP_RESULT`, result: state.previousStepObject.context.fileText })))
};

const initial = {
    previousStepObject: null,
    stepObject: null,
    queryList: {}
};

export const reducers = {

    fileReducer:
        (state = initial, action) => {

            switch (action.type) {
                case types.FILE_STEP_HYDRATE:
                    return hydrateFile(state, action);
                case types.FILE_QUERY_PANEL_UPDATE:
                    return queryPanelUpdate(state, action);
                case types.FILE_STEP_CLEAR:
                    return clearCurrentStep(state);
                case 'STOP':
                    return initial;
                default:
                    return state;
            }
        }
};

const hydrateFile = (state, action) => {
    state.stepObject = action.step;
    if (state.stepObject.context.fileText === undefined)
        state.stepObject.context.fileText = state.stepObject.context.input || '';
    return state;
};

const clearCurrentStep = (state) => {
    state.previousStepObject = state.stepObject;
    state.stepObject = {};
    state.queryList = {};
    return state;
};

const queryPanelUpdate = (state, action) => {
    if (state.stepObject.context === undefined)
        state.stepObject.context = {};
    state.stepObject.context.fileText = action.fileText;
    state.stepObject.context.changeFromOriginal = true;
    return state;
};
