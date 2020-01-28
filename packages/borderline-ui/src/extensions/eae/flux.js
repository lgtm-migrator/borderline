import { of, concat, interval, from } from 'rxjs';
import { mergeMap, map, mapTo, skipWhile, first, defaultIfEmpty, every, filter } from 'rxjs/operators';
import { Constants } from '@borderline/utils';
import { api } from 'api';
// import NavigationButton from './containers/NavigationButton';
import StatusIndicator from './containers/StatusIndicator';
import View from './containers/View';
import { AnalysesIcon, AnalysesPanel, StepStage } from './containers/WorkflowStep';
import BusinessHandler from './business';

const types = {

    EAE_STEP_HYDRATE: 'EAE_STEP_HYDRATE',
    EAE_STEP_HYDRATE_SUCCESS: 'EAE_STEP_HYDRATE_SUCCESS',
    EAE_STEP_CLEAR: 'EAE_STEP_CLEAR',
    EAE_STEP_EXECUTE_SUCCESS: 'EAE_STEP_EXECUTE_SUCCESS',
    EAE_STEP_EXECUTE_FAILURE: 'EAE_STEP_EXECUTE_FAILURE',
    EAE_FETCH_RESULT_SUCCESS: 'EAE_FETCH_RESULT_SUCCESS',
    EAE_FETCH_RESULT_FAILURE: 'EAE_FETCH_RESULT_FAILURE',
    EAE_QUERY_PANEL_UPDATE: 'EAE_QUERY_PANEL_UPDATE',
    EAE_QUERY_EXECUTE: 'EAE_QUERY_EXECUTE',
    EAE_QUERY_EXECUTE_SUCCESS: 'EAE_QUERY_EXECUTE_SUCCESS',
    EAE_QUERY_EXECUTE_FAILURE: 'EAE_QUERY_EXECUTE_FAILURE',
    EAE_QUERY_POLL: 'EAE_QUERY_POLL',
    EAE_QUERY_LOAD: 'EAE_QUERY_LOAD',
    EAE_QUERY_LOAD_SUCCESS: 'EAE_QUERY_LOAD_SUCCESS',
    EAE_QUERY_LOAD_FAILURE: 'EAE_QUERY_LOAD_FAILURE',
    EAE_QUERY_FINISHED_SUCCESS: 'EAE_QUERY_FINISHED_SUCCESS',
    EAE_QUERY_FINISHED_FAILURE: 'EAE_QUERY_FINISHED_FAILURE',
    EAE_QUERIES_DID_LOAD: 'EAE_QUERIES_DID_LOAD',
    EAE_CODE_SWITCH: 'EAE_CODE_SWITCH',
    DOCK_ANALYSIS: 'DOCK_ANALYSIS'
};

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
            identifier: 'text',
            inputs: ['object_result', 'text_result', 'eae_result'],
            outputs: ['object_result', 'text_result'],
            sidebar: {
                analyses: {
                    path: 'analyses',
                    icon: AnalysesIcon,
                    panel: AnalysesPanel
                }
            },
            stage: StepStage
        }
    }),

    getCurrentStep: () => ({
        type: '@@extensions/workflow/STEP_FETCH',
        replyTo: types.EAE_STEP_HYDRATE
    }),

    clearCurrentStep: () => ({
        type: types.EAE_STEP_CLEAR
    }),

    updateStepStatus: (step, name, data) => ({
        type: '@@extensions/workflow/STEP_STATUS_UPDATE',
        status: {
            step: step,
            name: name,
            data: data
        }
    }),

    saveQueryDescription: (analysisCodeText) => ({
        type: types.EAE_QUERY_PANEL_UPDATE,
        analysisCodeText: analysisCodeText
    }),

    saveStep: (step) => ({
        type: '@@extensions/workflow/STEP_UPDATE',
        step: step
    }),

    executeStepSuccess: (data) => ({
        type: types.EAE_STEP_EXECUTE_SUCCESS,
        data: data
    }),

    executeStepFailure: (error) => ({
        type: types.EAE_STEP_EXECUTE_FAILURE,
        error: error
    }),

    executeQuery: (query) => ({
        type: types.EAE_QUERY_EXECUTE,
        query: query
    }),

    executeQuerySuccess: (qid, data) => ({
        type: types.EAE_QUERY_EXECUTE_SUCCESS,
        qid: qid,
        data: data
    }),

    executeQueryFailure: (qid, error) => ({
        type: types.EAE_QUERY_EXECUTE_FAILURE,
        qid: qid,
        error: error
    }),

    pollQuery: (qid) => ({
        type: types.EAE_QUERY_POLL,
        qid: qid
    }),

    finishedQuerySuccess: (data) => ({
        type: types.EAE_QUERY_FINISHED_SUCCESS,
        data: data
    }),

    finishedQueryFailure: (error) => ({
        type: types.EAE_QUERY_FINISHED_FAILURE,
        error: error
    }),

    queriesDidLoad: () => ({
        type: types.EAE_QUERIES_DID_LOAD
    }),

    queryUnitLoad: (qid) => ({
        type: types.EAE_QUERY_LOAD,
        qid: qid
    }),

    queryUnitLoadSuccess: (data) => ({
        type: types.EAE_QUERY_LOAD_SUCCESS,
        data: data
    }),

    queryUnitLoadFailure: (error) => ({
        type: types.EAE_QUERY_LOAD_FAILURE,
        error: error
    }),

    receiveStepSuccess: () => ({
        type: types.EAE_STEP_HYDRATE_SUCCESS
    }),

    fetchResultSuccess: (data) => ({
        type: types.EAE_FETCH_RESULT_SUCCESS,
        data: data
    }),

    fetchResultFailure: (error) => ({
        type: types.EAE_FETCH_RESULT_FAILRE,
        error: error
    }),

    changeAnalysisCode: (name) => ({
        type: types.EAE_CODE_SWITCH,
        name: name
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
            .pipe(mergeMap(() => of(actions.dockToWorkflow()))),

    receiveStep:
        (action) => action.ofType(types.EAE_STEP_HYDRATE)
            .pipe(mapTo(actions.receiveStepSuccess())),

    receiveStepSuccess:
        (action, state) => action.ofType(types.EAE_STEP_HYDRATE_SUCCESS)
            .pipe(mergeMap(() =>
                from(Object.keys(state.queryList))
                    .pipe(defaultIfEmpty(null), map(qid =>
                        qid === null ? actions.queriesDidLoad() : actions.queryUnitLoad(qid)
                    ))
            )),

    queryUnitLoad:
        (action) => action.ofType(types.EAE_QUERY_LOAD)
            .pipe(mergeMap((action) =>
                api.fetchQuery(action.qid)
                    .pipe(map(response => response.ok === true ? actions.queryUnitLoadSuccess(response.data) : actions.queryUnitLoadFailure()))
            )),

    queryUnitLoadSuccess:
        (action, state) => action.ofType(types.EAE_QUERY_LOAD_SUCCESS)
            .pipe(mergeMap(() =>
                from(Object.values(state.queryList))
                    .pipe(
                        every(query => query.loaded === true),
                        filter(loaded => loaded === true)
                    ).pipe(mapTo(actions.queriesDidLoad()))
            )
            ),

    queriesDidLoad:
        (action, state) => action.ofType(types.EAE_QUERIES_DID_LOAD)
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, state.currentState)),
                of(actions.saveStep(state.stepObject))
            ))),

    queryPanelUpdate:
        (action, state) => action.ofType(types.EAE_QUERY_PANEL_UPDATE)
            .pipe(mergeMap(() => of(actions.saveStep(state.stepObject)))),

    executeStep:
        (action, state) => action.ofType('EXECUTE_STEP')
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'planning')),
                api.createQuery(BusinessHandler.composeQuery(state.stepObject))
                    .pipe(map(response => response.ok === true ? actions.executeStepSuccess(response.data) : actions.executeStepFailure()))
            ))),

    executeStepSuccess:
        (action, state) => action.ofType(types.EAE_STEP_EXECUTE_SUCCESS)
            .pipe(mergeMap((action) => concat(
                of(actions.executeQuery(action.data)),
                of(actions.saveStep(state.stepObject))
            ))),

    executeQuery:
        (action, state) => action.ofType(types.EAE_QUERY_EXECUTE)
            .pipe(mergeMap((action) => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'querying')),
                api.executeQuery(action.query._id)
                    .pipe(map(response => response.ok === true ? actions.executeQuerySuccess(action.query._id, response.data) : actions.executeQueryFailure(action.query._id)))
            ))),

    executeQuerySuccess:
        (action) => action.ofType(types.EAE_QUERY_EXECUTE_SUCCESS)
            .pipe(mergeMap((action) => of(actions.pollQuery(action.qid)))),

    pollQuery:
        (action) => action.ofType(types.EAE_QUERY_POLL)
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
                            Constants.BL_QUERY_STATUS_EXECUTE,
                            Constants.BL_QUERY_STATUS_TERMINATE
                        ].includes(result.status)),
                        first(),
                        mergeMap(() => api.fetchQuery(action.qid)
                            .pipe(map(response => {
                                if (response.ok !== true)
                                    return actions.finishedQueryFailure(response.data);
                                if (response.data.status.status === Constants.BL_QUERY_STATUS_ERROR) {
                                    return actions.finishedQueryFailure(response.data.status.error);
                                }
                                return actions.finishedQuerySuccess(response.data);
                            }))),
                    ),
                )
            ),

    finishedQuerySuccess:
        (action, state) => action.ofType(types.EAE_QUERY_FINISHED_SUCCESS)
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'finished')),
                of(actions.saveStep(state.stepObject))
            ))),

    finishedQueryFailure:
        (action, state) => action.ofType(types.EAE_QUERY_FINISHED_FAILURE)
            .pipe(mergeMap((action) => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'finished')),
                of({
                    type: '@@core/pager/ERROR_DISPLAY',
                    error: action.error
                })))),

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
                if (action.format === 'object_result')
                    return of(actions.fetchResultSuccess({ result: state.previousStepObject.context.queries[qid].output, to: action.__origin__ }));
                return api.fetchQueryOutput(qid)
                    .pipe(map(response => response.ok === true ? actions.fetchResultSuccess({ result: response.data, to: action.__origin__ }) : actions.fetchResultFailure()));
            })),

    fetchResultSuccess:
        (action) => action.ofType(types.EAE_FETCH_RESULT_SUCCESS)
            .pipe(mergeMap((action) => of({ type: `@@extensions/${action.data.to}/STEP_RESULT`, result: action.data.result }))),

    eaeCodeSwitch:
        (action, state) => action.ofType(types.EAE_CODE_SWITCH)
            .pipe(mergeMap(() => of(actions.saveStep(state.stepObject))))
};

const initial = {
    previousStepObject: null,
    stepObject: null,
    queryList: {},
    adhocAnalysis: {}
};

export const reducers = {

    eaeReducer:
        (state = initial, action) => {

            switch (action.type) {
                case types.EAE_STEP_HYDRATE:
                    return hydrateEAE(state, action);
                case types.EAE_QUERY_PANEL_UPDATE:
                    return queryPanelUpdate(state, action);
                case types.EAE_STEP_EXECUTE_SUCCESS:
                    return executeStepSuccess(state, action);
                case types.EAE_QUERY_FINISHED_SUCCESS:
                    return finisedQuerySuccess(state, action);
                case types.EAE_QUERY_LOAD_SUCCESS:
                    return queryUnitLoadSuccess(state, action);
                case types.EAE_QUERIES_DID_LOAD:
                    return queriesDidLoad(state);
                case types.EAE_STEP_CLEAR:
                    return clearCurrentStep(state);
                case types.EAE_CODE_SWITCH:
                    return eaeCodeSwitch(state, action);
                case types.DOCK_ANALYSIS:
                    return dockAnalysis(state, action);
                case 'STOP':
                    return initial;
                default:
                    return state;
            }
        }
};

const hydrateEAE = (state, action) => {
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
    state.stepObject.context.analysisCodeText = action.analysisCodeText;
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
    state.stepObject.context.queries[action.data._id] = action.data;
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

const eaeCodeSwitch = (state, action) => {
    state.stepObject.context.analysisCodeText = state.adhocAnalysis[action.name].code;
    return state;
};

const dockAnalysis = (state, action) => {
    state.adhocAnalysis[action.analysis.name] = action.analysis;
    return state;
};