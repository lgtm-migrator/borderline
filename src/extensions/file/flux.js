import { of, concat, from } from 'rxjs';
import { mergeMap, map, mapTo, defaultIfEmpty, every, filter } from 'rxjs/operators';
import { Constants } from 'borderline-utils';
import { api } from 'api';
import { UploadStage, TextStage } from './containers/WorkflowStep';
import BusinessHandler from './business';

const types = {

    FILE_STEP_HYDRATE: 'FILE_STEP_HYDRATE',
    FILE_STEP_HYDRATE_SUCCESS: 'FILE_STEP_HYDRATE_SUCCESS',
    FILE_STEP_CLEAR: 'FILE_STEP_CLEAR',
    FILE_STEP_EXECUTE_SUCCESS: 'FILE_STEP_EXECUTE_SUCCESS',
    FILE_STEP_EXECUTE_FAILURE: 'FILE_STEP_EXECUTE_FAILURE',
    FILE_FETCH_RESULT_SUCCESS: 'FILE_FETCH_RESULT_SUCCESS',
    FILE_FETCH_RESULT_FAILURE: 'FILE_FETCH_RESULT_FAILURE',
    FILE_QUERY_PANEL_UPDATE: 'FILE_QUERY_PANEL_UPDATE',
    FILE_UPLOAD_PATH_UPDATE: 'FILE_UPLOAD_PATH_UPDATE',
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

    saveFileHook: (fileState) => ({
        type: types.FILE_UPLOAD_PATH_UPDATE,
        fileState: fileState
    }),

    saveStep: (step) => ({
        type: '@@extensions/workflow/STEP_UPDATE',
        step: step
    }),

    executeStepSuccess: (data) => ({
        type: types.FILE_STEP_EXECUTE_SUCCESS,
        data: data
    }),

    executeStepFailure: () => ({
        type: types.FILE_STEP_EXECUTE_FAILURE
    }),

    executeQuery: (query) => ({
        type: types.FILE_QUERY_EXECUTE,
        query: query
    }),

    executeQuerySuccess: (qid, data) => ({
        type: types.FILE_QUERY_EXECUTE_SUCCESS,
        qid: qid,
        data: data
    }),

    executeQueryFailure: (qid) => ({
        type: types.FILE_QUERY_EXECUTE_FAILURE,
        qid: qid
    }),

    pollQuery: (qid) => ({
        type: types.FILE_QUERY_POLL,
        qid: qid
    }),

    finishedQuerySuccess: (data) => ({
        type: types.FILE_QUERY_FINISHED_SUCCESS,
        data: data
    }),

    finishedQueryFailure: () => ({
        type: types.FILE_QUERY_FINISHED_FAILURE
    }),

    queriesDidLoad: () => ({
        type: types.FILE_QUERIES_DID_LOAD
    }),

    queryUnitLoad: (qid) => ({
        type: types.FILE_QUERY_LOAD,
        qid: qid
    }),

    queryUnitLoadSuccess: (data) => ({
        type: types.FILE_QUERY_LOAD_SUCCESS,
        data: data
    }),

    queryUnitLoadFailure: () => ({
        type: types.FILE_QUERY_LOAD_FAILURE
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
            .pipe(mergeMap(() => {
                if (state.stepObject.extension === 'file/upload')
                    return from(Object.keys(state.queryList))
                        .pipe(defaultIfEmpty(null), map(qid =>
                            qid === null ? actions.queriesDidLoad() : actions.queryUnitLoad(qid)
                        ));
                else
                    return of(actions.updateStepStatus(state.stepObject._id, 'finished'));
            })),

    queryUnitLoad:
        (action) => action.ofType(types.FILE_QUERY_LOAD)
            .pipe(mergeMap((action) =>
                api.fetchQuery(action.qid)
                    .pipe(map(response => response.ok === true ? actions.queryUnitLoadSuccess(response.data) : actions.queryUnitLoadFailure()))
            )),

    queryUnitLoadSuccess:
        (action, state) => action.ofType(types.FILE_QUERY_LOAD_SUCCESS)
            .pipe(mergeMap(() =>
                from(Object.values(state.queryList))
                    .pipe(
                        every(query => query.loaded === true),
                        filter(loaded => loaded === true)
                    ).pipe(mapTo(actions.queriesDidLoad()))
            )
            ),

    queriesDidLoad:
        (action, state) => action.ofType(types.FILE_QUERIES_DID_LOAD)
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, state.currentState)),
                of(actions.saveStep(state.stepObject))
            ))),

    queryPanelUpdate:
        (action, state) => action.ofType(types.FILE_QUERY_PANEL_UPDATE)
            .pipe(mergeMap(() => of(actions.saveStep(state.stepObject)))),

    fileUploadPathUpdate:
        (action, state) => action.ofType(types.FILE_UPLOAD_PATH_UPDATE)
            .pipe(mergeMap(() => of(actions.saveStep(state.stepObject)))),

    executeStep:
        (action, state) => action.ofType('EXECUTE_STEP')
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'planning')),
                api.createQuery(BusinessHandler.composeQuery(state.stepObject))
                    .pipe(map(response => response.ok === true ? actions.executeStepSuccess(response.data) : actions.executeStepFailure()))
            ))),

    executeStepSuccess:
        (action, state) => action.ofType(types.FILE_STEP_EXECUTE_SUCCESS)
            .pipe(mergeMap((action) => concat(
                of(actions.executeQuery(action.data)),
                of(actions.saveStep(state.stepObject))
            ))),

    executeQuery:
        (action, state) => action.ofType(types.FILE_QUERY_EXECUTE)
            .pipe(mergeMap((action) => {
                if (state.stepObject.context === undefined || state.stepObject.context.fileState === undefined)
                    return concat(
                        of(actions.updateStepStatus(state.stepObject._id, 'finished')),
                        of(actions.executeQueryFailure(action.query._id))
                    );
                let form = new FormData();
                form.append('file', state.stepObject.context.fileState.file);
                form.append('nocache', false);
                return concat(
                    of(actions.updateStepStatus(state.stepObject._id, 'querying')),
                    api.executeFormDataQuery(action.query._id, form)
                        .pipe(map(response => response.ok === true ? actions.executeQuerySuccess(action.query._id, response.data) : actions.executeQueryFailure(action.query._id)))
                )
            })),

    executeQuerySuccess:
        (action) => action.ofType(types.FILE_QUERY_EXECUTE_SUCCESS)
            .pipe(mergeMap((action) => of(actions.pollQuery(action.qid)))),

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
                case types.FILE_UPLOAD_PATH_UPDATE:
                    return fileUploadPathUpdate(state, action);
                case types.FILE_STEP_EXECUTE_SUCCESS:
                    return executeStepSuccess(state, action);
                case types.FILE_QUERY_FINISHED_SUCCESS:
                    return finisedQuerySuccess(state, action);
                case types.FILE_QUERY_LOAD_SUCCESS:
                    return queryUnitLoadSuccess(state, action);
                case types.FILE_QUERIES_DID_LOAD:
                    return queriesDidLoad(state);
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

const fileUploadPathUpdate = (state, action) => {
    if (state.stepObject.context === undefined)
        state.stepObject.context = {};
    state.stepObject.context.fileState = action.fileState;
    state.stepObject.context.changeFromOriginal = true;
    return state;
}

const queryPanelUpdate = (state, action) => {
    if (state.stepObject.context === undefined)
        state.stepObject.context = {};
    state.stepObject.context.fileText = action.fileText;
    state.stepObject.context.changeFromOriginal = true;
    return state;
};

const executeStepSuccess = (state, action) => {
    if (state.stepObject.context.queries === undefined)
        state.stepObject.context.queries = {};
    state.stepObject.context.queries[action.data._id] = {
        _id: action.data._id,
        status: action.data.status,
        output: action.data.output
    };
    return state;
};

const finisedQuerySuccess = (state, action) => {
    state.stepObject.context.queries[action.data._id]['output'] = action.data.output;
    return state;
};

const queryUnitLoadSuccess = (state, action) => {
    state.queryList[action.data._id].loaded = true;
    state.stepObject.context.queries[action.data._id] = {
        _id: action.data._id,
        status: action.data.status,
        output: action.data.output
    };
    return state;
};

const queriesDidLoad = (state) => {
    state.currentState = 'ready';
    if (state.stepObject.context !== undefined && state.stepObject.context.queries !== undefined)
        Object.values(state.stepObject.context.queries).forEach((query) => {
            if ([
                Constants.BL_QUERY_STATUS_UNKNOWN,
                Constants.BL_QUERY_STATUS_INITIALIZE,
                Constants.BL_QUERY_STATUS_EXECUTE,
                Constants.BL_QUERY_STATUS_TERMINATE
            ].includes(query.status))
                state.currentState = 'querying';
            else
                state.currentState = 'finished';
        });
    return state;
};