import { of, concat, interval, from } from 'rxjs';
import { mergeMap, map, mapTo, skipWhile, first, defaultIfEmpty, every, filter, tap } from 'rxjs/operators';
import { Constants } from 'borderline-utils';
import { api } from 'api';
import { VennIcon, VennPanel, StepStage } from './containers/WorkflowStep';
import BusinessHandler from './business';

const types = {

    TRANSMART_STEP_HYDRATE: 'TRANSMART_STEP_HYDRATE',
    TRANSMART_STEP_HYDRATE_SUCCESS: 'TRANSMART_STEP_HYDRATE_SUCCESS',
    TRANSMART_STEP_CLEAR: 'TRANSMART_STEP_CLEAR',
    TRANSMART_STEP_EXECUTE_SUCCESS: 'TRANSMART_STEP_EXECUTE_SUCCESS',
    TRANSMART_STEP_EXECUTE_FAILURE: 'TRANSMART_STEP_EXECUTE_FAILURE',
    TRANSMART_FETCH_RESULT_SUCCESS: 'TRANSMART_FETCH_RESULT_SUCCESS',
    TRANSMART_FETCH_RESULT_FAILURE: 'TRANSMART_FETCH_RESULT_FAILURE',
    TRANSMART_QUERY_PANEL_UPDATE: 'TRANSMART_QUERY_PANEL_UPDATE',
    TRANSMART_QUERY_EXECUTE: 'TRANSMART_QUERY_EXECUTE',
    TRANSMART_QUERY_EXECUTE_SUCCESS: 'TRANSMART_QUERY_EXECUTE_SUCCESS',
    TRANSMART_QUERY_EXECUTE_FAILURE: 'TRANSMART_QUERY_EXECUTE_FAILURE',
    TRANSMART_QUERY_POLL: 'TRANSMART_QUERY_POLL',
    TRANSMART_QUERY_LOAD: 'TRANSMART_QUERY_LOAD',
    TRANSMART_QUERY_LOAD_SUCCESS: 'TRANSMART_QUERY_LOAD_SUCCESS',
    TRANSMART_QUERY_LOAD_FAILURE: 'TRANSMART_QUERY_LOAD_FAILURE',
    TRANSMART_QUERY_FINISHED_SUCCESS: 'TRANSMART_QUERY_FINISHED_SUCCESS',
    TRANSMART_QUERY_FINISHED_FAILURE: 'TRANSMART_QUERY_FINISHED_FAILURE',
    TRANSMART_QUERIES_DID_LOAD: 'TRANSMART_QUERIES_DID_LOAD'
};

export const actions = {

    dockToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'Transmart Cohort',
            identifier: 'cohort',
            inputs: [null],
            outputs: ['tm_object_result', 'text_result'],
            sidebar: {
                analyses: {
                    path: 'van',
                    icon: VennIcon,
                    panel: VennPanel
                }
            },
            stage: StepStage
        }
    }),

    getCurrentStep: () => ({
        type: '@@extensions/workflow/STEP_FETCH',
        replyTo: types.TRANSMART_STEP_HYDRATE
    }),

    clearCurrentStep: () => ({
        type: types.TRANSMART_STEP_CLEAR
    }),

    updateStepStatus: (step, name, data) => ({
        type: '@@extensions/workflow/STEP_STATUS_UPDATE',
        status: {
            step: step,
            name: name,
            data: data
        }
    }),

    saveQueryDescription: (apiQueryText) => ({
        type: types.TRANSMART_QUERY_PANEL_UPDATE,
        apiQueryText: apiQueryText
    }),

    saveStep: (step) => ({
        type: '@@extensions/workflow/STEP_UPDATE',
        step: step
    }),

    executeStepSuccess: (data) => ({
        type: types.TRANSMART_STEP_EXECUTE_SUCCESS,
        data: data
    }),

    executeStepFailure: () => ({
        type: types.TRANSMART_STEP_EXECUTE_FAILURE
    }),

    executeQuery: (query) => ({
        type: types.TRANSMART_QUERY_EXECUTE,
        query: query
    }),

    executeQuerySuccess: (qid, data) => ({
        type: types.TRANSMART_QUERY_EXECUTE_SUCCESS,
        qid: qid,
        data: data
    }),

    executeQueryFailure: (qid) => ({
        type: types.TRANSMART_QUERY_EXECUTE_FAILURE,
        qid: qid
    }),

    pollQuery: (qid) => ({
        type: types.TRANSMART_QUERY_POLL,
        qid: qid
    }),

    finishedQuerySuccess: (data) => ({
        type: types.TRANSMART_QUERY_FINISHED_SUCCESS,
        data: data
    }),

    finishedQueryFailure: () => ({
        type: types.TRANSMART_QUERY_FINISHED_FAILURE
    }),

    queriesDidLoad: () => ({
        type: types.TRANSMART_QUERIES_DID_LOAD
    }),

    queryUnitLoad: (qid) => ({
        type: types.TRANSMART_QUERY_LOAD,
        qid: qid
    }),

    queryUnitLoadSuccess: (data) => ({
        type: types.TRANSMART_QUERY_LOAD_SUCCESS,
        data: data
    }),

    queryUnitLoadFailure: () => ({
        type: types.TRANSMART_QUERY_LOAD_FAILURE
    }),

    receiveStepSuccess: () => ({
        type: types.TRANSMART_STEP_HYDRATE_SUCCESS
    }),

    fetchResultSuccess: (data) => ({
        type: types.TRANSMART_FETCH_RESULT_SUCCESS,
        data: data
    }),

    fetchResultFailure: () => ({
        type: types.TRANSMART_FETCH_RESULT_SUCCESS
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mapTo(actions.dockToWorkflow())),

    workflowStarted:
        (action) => action.ofType('@@extensions/workflow/STARTED')
            .pipe(mapTo(actions.dockToWorkflow())),

    receiveStep:
        (action) => action.ofType(types.TRANSMART_STEP_HYDRATE)
            .pipe(mapTo(actions.receiveStepSuccess())),

    receiveStepSuccess:
        (action, state) => action.ofType(types.TRANSMART_STEP_HYDRATE_SUCCESS)
            .pipe(mergeMap(() =>
                from(Object.keys(state.queryList))
                    .pipe(defaultIfEmpty(null), map(qid =>
                        qid === null ? actions.queriesDidLoad() : actions.queryUnitLoad(qid)
                    ))
            )),

    queryUnitLoad:
        (action) => action.ofType(types.TRANSMART_QUERY_LOAD)
            .pipe(mergeMap((action) =>
                api.fetchQuery(action.qid)
                    .pipe(map(response => response.ok === true ? actions.queryUnitLoadSuccess(response.data) : actions.queryUnitLoadFailure()))
            )),

    queryUnitLoadSuccess:
        (action, state) => action.ofType(types.TRANSMART_QUERY_LOAD_SUCCESS)
            .pipe(mergeMap(() =>
                from(Object.values(state.queryList))
                    .pipe(
                        every(query => query.loaded === true),
                        filter(loaded => loaded === true)
                    ).pipe(mapTo(actions.queriesDidLoad()))
            )
            ),

    queriesDidLoad:
        (action, state) => action.ofType(types.TRANSMART_QUERIES_DID_LOAD)
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, state.currentState)),
                of(actions.saveStep(state.stepObject))
            ))),

    queryPanelUpdate:
        (action, state) => action.ofType(types.TRANSMART_QUERY_PANEL_UPDATE)
            .pipe(mergeMap(() => of(actions.saveStep(state.stepObject)))),

    executeStep:
        (action, state) => action.ofType('EXECUTE_STEP')
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'planning')),
                api.createQuery(BusinessHandler.composeQuery(state.stepObject))
                    .pipe(map(response => response.ok === true ? actions.executeStepSuccess(response.data) : actions.executeStepFailure()))
            ))),

    executeStepSuccess:
        (action, state) => action.ofType(types.TRANSMART_STEP_EXECUTE_SUCCESS)
            .pipe(mergeMap((action) => concat(
                of(actions.executeQuery(action.data)),
                of(actions.saveStep(state.stepObject))
            ))),

    executeQuery:
        (action, state) => action.ofType(types.TRANSMART_QUERY_EXECUTE)
            .pipe(mergeMap((action) => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'querying')),
                api.executeQuery(action.query._id)
                    .pipe(map(response => response.ok === true ? actions.executeQuerySuccess(action.query._id, response.data) : actions.executeQueryFailure(action.query._id)))
            ))),

    executeQuerySuccess:
        (action) => action.ofType(types.TRANSMART_QUERY_EXECUTE_SUCCESS)
            .pipe(mergeMap((action) => of(actions.pollQuery(action.qid)))),

    pollQuery:
        (action) => action.ofType(types.TRANSMART_QUERY_POLL)
            .pipe(
                mergeMap((action) => interval(1000)
                    .pipe(
                        mergeMap(() =>
                            api.fetchQueryStatus(action.qid)
                                .pipe(map(response => response.ok === true ? response.data : null))
                        ),
                        skipWhile(result => result === null || [
                            Constants.BL_QUERY_STATUS_UNKNOWN,
                            Constants.BL_QUERY_STATUS_INITIALIZE,
                            Constants.BL_QUERY_STATUS_EXECUTE
                        ].includes(result.status)),
                        first(),
                        mergeMap(() => api.fetchQuery(action.qid)
                            .pipe(map(response => response.ok === true ? actions.finishedQuerySuccess(response.data) : actions.finishedQueryFailure(response.data)))),
                ),
                )
            ),

    finishedQuerySuccess:
        (action, state) => action.ofType(types.TRANSMART_QUERY_FINISHED_SUCCESS)
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'finished')),
                of(actions.saveStep(state.stepObject))
            ))),

    fetchResult:
        (action, state) => action.ofType('FETCH_STEP_RESULT')
            .pipe(mergeMap((action) => {
                let qid;
                let status;
                let last = new Date(0);
                Object.keys(state.previousStepObject.context.queries).forEach((key) => {
                    status = state.previousStepObject.context.queries[key].status;
                    if (new Date(status.end).getTime() > last.getTime()) {
                        qid = key;
                        last = new Date(status.end);
                    }
                });
                if (action.format === 'tm_object_result')
                    return of(actions.fetchResultSuccess({ result: state.previousStepObject.context.queries[qid].output, to: action.__origin__ }));
                return api.fetchQueryOutput(qid)
                    .pipe(map(response => response.ok === true ? actions.fetchResultSuccess({ result: response.data, to: action.__origin__ }) : actions.fetchResultFailure()))
            })),

    fetchResultSuccess:
        (action) => action.ofType(types.TRANSMART_FETCH_RESULT_SUCCESS)
            .pipe(mergeMap((action) => of({ type: `@@extensions/${action.data.to}/STEP_RESULT`, result: action.data.result })))
};

const initial = {
    previousStepObject: null,
    stepObject: null,
    queryList: {}
};

export const reducers = {

    transmartReducer:
        (state = initial, action) => {

            switch (action.type) {
                case types.TRANSMART_STEP_HYDRATE:
                    return hydrateTransmart(state, action);
                case types.TRANSMART_QUERY_PANEL_UPDATE:
                    return queryPanelUpdate(state, action);
                case types.TRANSMART_STEP_EXECUTE_SUCCESS:
                    return executeStepSuccess(state, action);
                case types.TRANSMART_QUERY_FINISHED_SUCCESS:
                    return finisedQuerySuccess(state, action);
                case types.TRANSMART_QUERY_LOAD_SUCCESS:
                    return queryUnitLoadSuccess(state, action);
                case types.TRANSMART_QUERIES_DID_LOAD:
                    return queriesDidLoad(state);
                case types.TRANSMART_STEP_CLEAR:
                    return clearCurrentStep(state);
                case 'STOP':
                    return initial;
                default:
                    return state;
            }
        }
};

const hydrateTransmart = (state, action) => {
    state.stepObject = action.step;
    state.queryList = {};
    if (state.stepObject.context !== undefined && state.stepObject.context.queries !== undefined)
        Object.keys(state.stepObject.context.queries).forEach((key) => {
            state.queryList[key] = {
                loaded: false
            };
        });
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
    state.stepObject.context.apiQueryText = action.apiQueryText;
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
        Object.values(state.stepObject.context.queries).map((query) => {
            if ([
                Constants.BL_QUERY_STATUS_UNKNOWN,
                Constants.BL_QUERY_STATUS_INITIALIZE,
                Constants.BL_QUERY_STATUS_EXECUTE
            ].includes(query.status))
                state.currentState = 'querying';
            else
                state.currentState = 'finished';
        });
    return state;
};

export default {
    actions,
    epics,
    reducers
};
