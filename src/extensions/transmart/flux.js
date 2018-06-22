import { of, concat, interval } from 'rxjs';
import { mergeMap, map, mapTo, skipWhile, tap, first, last } from 'rxjs/operators';
import { Constants } from 'borderline-utils';
import { api } from 'api';
import { VennIcon, VennPanel, StepStage } from './containers/WorkflowStep';
import BusinessHandler from './business';

const types = {

    TRANSMART_STEP_HYDRATE: 'TRANSMART_STEP_HYDRATE',
    TRANSMART_STEP_CLEAR: 'TRANSMART_STEP_CLEAR',
    TRANSMART_STEP_EXECUTE_SUCCESS: 'TRANSMART_STEP_EXECUTE_SUCCESS',
    TRANSMART_STEP_EXECUTE_FAILURE: 'TRANSMART_STEP_EXECUTE_FAILURE',
    TRANSMART_QUERY_PANEL_UPDATE: 'TRANSMART_QUERY_PANEL_UPDATE',
    TRANSMART_QUERY_EXECUTE: 'TRANSMART_QUERY_EXECUTE',
    TRANSMART_QUERY_EXECUTE_SUCCESS: 'TRANSMART_QUERY_EXECUTE_SUCCESS',
    TRANSMART_QUERY_EXECUTE_FAILURE: 'TRANSMART_QUERY_EXECUTE_FAILURE',
    TRANSMART_QUERY_POLL: 'TRANSMART_QUERY_POLL',
    TRANSMART_QUERY_FINISHED_SUCCESS: 'TRANSMART_QUERY_FINISHED_SUCCESS',
    TRANSMART_QUERY_FINISHED_FAILURE: 'TRANSMART_QUERY_FINISHED_FAILURE'
};

export const actions = {

    dockToWorkflow: () => ({
        type: '@@extensions/workflow/STEP_TYPE_DOCK',
        profile: {
            name: 'Transmart Cohort',
            identifier: 'cohort',
            input: [],
            output: ['tm_result'],
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
        (action, state) => action.ofType(types.TRANSMART_STEP_HYDRATE)
            .pipe(mergeMap(() => of(actions.updateStepStatus(state.stepObject._id, 'ready')))),

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
};

const initial = {
    stepObject: null
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
                case 'STOP':
                    return initial;
                default:
                    return state;
            }
        }
};

const hydrateTransmart = (state, action) => {

    state.stepObject = action.step;
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
        output: action.data.output
    };
    return state;
};

const finisedQuerySuccess = (state, action) => {
    state.stepObject.context.queries[action.data._id]['output'] = action.data.output;
    return state;
};

export default {
    actions,
    epics,
    reducers
};
