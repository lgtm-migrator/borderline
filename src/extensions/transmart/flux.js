import { of, from, concat } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { VennIcon, VennPanel, StepStage } from './containers/WorkflowStep';
import BusinessHandler from './business';

const types = {

    TRANSMART_STEP_HYDRATE: 'TRANSMART_STEP_HYDRATE',
    TRANSMART_STEP_CLEAR: 'TRANSMART_STEP_CLEAR',
    TRANSMART_QUERY_PANEL_UPDATE: 'TRANSMART_QUERY_PANEL_UPDATE'
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

    saveQueryDescription: (query) => ({
        type: types.TRANSMART_QUERY_PANEL_UPDATE,
        query: query
    }),

    saveStep: (step) => ({
        type: '@@extensions/workflow/STEP_UPDATE',
        step: step
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() => of(actions.dockToWorkflow()))),

    workflowStarted:
        (action) => action.ofType('@@extensions/workflow/STARTED')
            .pipe(mergeMap(() => of(actions.dockToWorkflow()))),

    receiveStep:
        (action, state) => action.ofType(types.TRANSMART_STEP_HYDRATE)
            .pipe(mergeMap(() => of(actions.updateStepStatus(state.stepObject._id, 'ready')))),

    queryPanelUpdate:
        (action, state) => action.ofType(types.TRANSMART_QUERY_PANEL_UPDATE)
            .pipe(mergeMap(() => of(actions.saveStep(state.stepObject)))),

    executeStep:
        (action, state) => action.ofType('EXECUTE_STEP')
            .pipe(mergeMap(() => concat(
                of(actions.updateStepStatus(state.stepObject._id, 'preparing')),
                from(BusinessHandler.executeStep(state.stepObject)).pipe(map(() => actions.updateStepStatus(state.stepObject._id, 'prepared', { result: 42 })))
            )))

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
    state.stepObject.context.query = action.query;
    return state;
};

export default {
    actions,
    epics,
    reducers
};
