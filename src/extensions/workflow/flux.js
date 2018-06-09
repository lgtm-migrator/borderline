import { api } from 'api';
import NavigationButton from './containers/NavigationButton';
import View from './containers/View';

const types = {

    STEPS_LIST_LOAD: 'STEPS_LIST_LOAD',
    STEPS_LIST_LOAD_SUCCESS: 'STEPS_LIST_LOAD_SUCCESS',
    STEPS_LIST_LOAD_FAILURE: 'STEPS_LIST_LOAD_FAILURE',
    WORKFLOWS_LIST_LOAD: 'WORKFLOWS_LIST_LOAD',
    WORKFLOWS_LIST_LOAD_SUCCESS: 'WORKFLOWS_LIST_LOAD_SUCCESS',
    WORKFLOWS_LIST_LOAD_FAILURE: 'WORKFLOWS_LIST_LOAD_FAILURE',
    WORKFLOW_LOAD: 'WORKFLOW_LOAD',
    WORKFLOW_LOAD_SUCCESS: 'WORKFLOW_LOAD_SUCCESS',
    WORKFLOW_LOAD_FAILURE: 'WORKFLOW_LOAD_FAILURE',
    WORKFLOW_CREATE: 'WORKFLOW_CREATE',
    WORKFLOW_CREATE_SUCCESS: 'WORKFLOW_CREATE_SUCCESS',
    WORKFLOW_CREATE_FAILURE: 'WORKFLOW_CREATE_FAILURE',
    WORKFLOW_PIN: 'WORKFLOW_PIN',
    WORKFLOW_UNPIN: 'WORKFLOW_UNPIN'
};

export const actions = {

    dockToPager: () => ({
        type: '@@core/pager/PAGE_DOCK',
        path: 'workflow',
        icon: NavigationButton,
        view: View
    }),

    stepsListLoad: () => ({
        type: types.STEPS_LIST_LOAD
    }),

    stepsListLoadSuccess: (data) => ({
        type: types.STEPS_LIST_LOAD_SUCCESS,
        data: data
    }),

    stepsListLoadFailure: (data) => ({
        type: types.STEPS_LIST_LOAD_FAILURE,
        data: data
    }),

    workflowsListLoad: () => ({
        type: types.WORKFLOWS_LIST_LOAD
    }),

    workflowsListLoadSuccess: (data) => ({
        type: types.WORKFLOWS_LIST_LOAD_SUCCESS,
        data: data
    }),

    workflowsListLoadFailure: (data) => ({
        type: types.WORKFLOWS_LIST_LOAD_FAILURE,
        data: data
    }),

    workflowLoad: (wid) => ({
        type: types.WORKFLOW_LOAD,
        workflow: wid
    }),

    workflowLoadSuccess: (data) => ({
        type: types.WORKFLOW_LOAD_SUCCESS,
        workflow: data
    }),

    workflowLoadFailure: (data) => ({
        type: types.WORKFLOW_LOAD_FAILURE,
        data: data
    }),

    workflowCreate: (data) => ({
        type: types.WORKFLOW_CREATE,
        workflow: data
    }),

    workflowCreateSuccess: (data) => ({
        type: types.WORKFLOW_CREATE_SUCCESS,
        workflow: data
    }),

    workflowCreateFailure: (data) => ({
        type: types.WORKFLOW_CREATE_FAILURE,
        data: data
    }),

    workflowPin: (wid) => ({
        type: types.WORKFLOW_PIN,
        workflow: wid
    }),

    workflowUnpin: (wid) => ({
        type: types.WORKFLOW_UNPIN,
        workflow: wid
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .mapTo(actions.dockToPager()),

    workflowsListLoad:
        (action) => action.ofType(types.WORKFLOWS_LIST_LOAD)
            .mergeMap(() =>
                api.fetchWorkflowsList()
                    .map(response => response.ok === true ? actions.workflowsListLoadSuccess(response.data) : actions.workflowsListLoadFailure())
            ),

    workflowsCreate:
        (action) => action.ofType(types.WORKFLOW_CREATE)
            .mergeMap((action) =>
                api.createWorkflow(action.workflow)
                    .map(response => response.ok === true ? actions.workflowCreateSuccess(response.data) : actions.workflowCreateFailure())
            ),

    workflowLoad:
        (action) => action.ofType(types.WORKFLOW_LOAD)
            .mergeMap((action) =>
                api.loadWorkflow(action.workflow)
                    .map(response => response.ok === true ? actions.workflowLoadSuccess(response.data) : actions.workflowLoadFailure())
            ),
};

const initial = {
    currentWorkflow: null,
    currentStep: null,
    newWorkflow: null,
    stepsListLoading: false,
    stepsLastLoaded: new Date(0),
    stepsList: {},
    workflowsListLoading: false,
    workflowsLastLoaded: new Date(0),
    workflowsList: {},
    workflowLoading: false,
    workflowPins: {}
};

export const reducers = {

    workflowReducer:
        (state = initial, action) => {

            switch (action.type) {
                case 'STOP':
                    return initial;
                case types.WORKFLOWS_LIST_LOAD:
                    return workflowsListLoad(state);
                case types.WORKFLOWS_LIST_LOAD_SUCCESS:
                    return workflowsListLoadSuccess(state, action);
                case types.WORKFLOWS_LIST_LOAD_FAILURE:
                    return workflowsListLoadFailure(state, action);
                case types.WORKFLOW_LOAD:
                    return workflowLoad(state, action);
                case types.WORKFLOW_LOAD_SUCCESS:
                    return workflowLoadSuccess(state, action);
                case types.WORKFLOW_LOAD_FAILURE:
                    return workflowLoadFailure(state, action);
                case types.WORKFLOW_CREATE:
                    return workflowCreate(state);
                case types.WORKFLOW_CREATE_SUCCESS:
                    return workflowCreateSuccess(state, action);
                case types.WORKFLOW_CREATE_FAILURE:
                    return workflowCreateFailure(state, action);
                case types.WORKFLOW_PIN:
                    return workflowPin(state, action);
                case types.WORKFLOW_UNPIN:
                    return workflowUnpin(state, action);
                case '@@router/LOCATION_CHANGE':
                    return workflowForgetNew(state);
                default:
                    return state;
            }
        }
};

export default {
    actions,
    epics,
    reducers
};

const workflowsListLoad = (state) => {
    state.workflowsListLoading = true;
    return state;
};

const workflowsListLoadSuccess = (state, action) => {
    state.workflowsListLoading = false;
    state.workflowsList = {};
    action.data.forEach(workflow => {
        state.workflowsList[workflow._id] = workflow;
    });
    state.workflowsLastLoaded = new Date();
    return state;
};

const workflowsListLoadFailure = (state, action) => {
    state.workflowsListLoading = false;
    state.error = action.data.error;
    return state;
};

const workflowLoad = (state) => {
    state.currentWorkflow = null;
    state.workflowLoading = true;
    return state;
};

const workflowLoadSuccess = (state, action) => {
    state.workflowLoading = false;
    state.workflowsList[action.workflow._id] = action.workflow;
    state.currentWorkflow = action.workflow._id;
    return state;
};

const workflowLoadFailure = (state, action) => {
    state.workflowLoading = false;
    state.error = action.data.error;
    return state;
};

const workflowCreate = (state) => {
    state.workflowLoading = true;
    return state;
};

const workflowCreateSuccess = (state, action) => {
    state.workflowLoading = false;
    state.workflowsList[action.workflow._id] = action.workflow;
    state.newWorkflow = action.workflow._id;
    return state;
};

const workflowCreateFailure = (state, action) => {
    state.workflowLoading = false;
    state.error = action.data.error;
    return state;
};

const workflowPin = (state, action) => {
    state.workflowPins[action.workflow] = true;
    state.currentWorkflow = action.workflow;
    return state;
};

const workflowUnpin = (state, action) => {
    state.workflowPins[action.workflow] = false;
    return state;
};

const workflowForgetNew = (state) => {
    state.newWorkflow = null;
    return state;
};