import { api } from 'api';
import NavigationButton from './containers/NavigationButton';
import View from './containers/View';

const types = {

    WORKFLOW_LOAD: 'WORKFLOW_LOAD',
    WORKFLOW_LOAD_SUCCESS: 'WORKFLOW_LOAD_SUCCESS',
    WORKFLOW_LOAD_FAILURE: 'WORKFLOW_LOAD_FAILURE',
    WORKFLOW_SET_CURRENT: 'WORKFLOW_SET_CURRENT',
    WORKFLOW_CREATE: 'WORKFLOW_CREATE',
    WORKFLOW_CREATE_SUCCESS: 'WORKFLOW_CREATE_SUCCESS',
    WORKFLOW_CREATE_FAILURE: 'WORKFLOW_CREATE_FAILURE'
};

export const actions = {

    dockToPager: () => ({
        type: '@@core/pager/PAGE_DOCK',
        path: 'workflow',
        icon: NavigationButton,
        view: View
    }),

    workflowsLoad: () => ({
        type: types.WORKFLOW_LOAD
    }),

    workflowsLoadSuccess: (data) => ({
        type: types.WORKFLOW_LOAD_SUCCESS,        
        data: data
    }),

    workflowsLoadFailure: (data) => ({
        type: types.WORKFLOW_LOAD_SUCCESS,        
        data: data
    }),

    setCurrentWorkflow: (wid) => ({
        type: types.WORKFLOW_SET_CURRENT,        
        workflow: wid
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
        workflow: data
    })
};

export const epics = {

    enclaveBoot:
    (action) => action.ofType('START')
        .mapTo(actions.dockToPager()),

    workflowsLoad:
    (action) => action.ofType(types.WORKFLOW_LOAD)
        .mergeMap(() =>
            api.fetchWorkflowsList()
                .map(response => response.ok === true ? actions.workflowsLoadSuccess(response.data) : actions.workflowsLoadFailure())
        ),

    workflowsCreate:
    (action) => action.ofType(types.WORKFLOW_CREATE)
        .mergeMap((action) =>
            api.createWorkflow(action.workflow)
                .map(response => response.ok === true ? actions.workflowCreateSuccess(response.data) : actions.workflowCreateFailure())
        ),
};

const initial = {
    currentWorkflow: null,
    newWorkflow: null,
    lastLoaded: new Date(0),
    workflowLoading: false,
    workflowsLoading: false,
    workflowsList: {}
};

export const reducers = {

    workflowReducer:
    (state = initial, action) => {

        switch (action.type) {
            case 'STOP':
                return initial;
            case types.WORKFLOW_LOAD:
                return workflowsLoad(state);
            case types.WORKFLOW_LOAD_SUCCESS:
                return workflowsLoadSuccess(state, action);
            case types.WORKFLOW_LOAD_FAILURE:
                return workflowsLoadFailure(state, action);
            case types.WORKFLOW_SET_CURRENT:
                return setCurrentWorkflow(state, action);
            case types.WORKFLOW_CREATE:
                return workflowCreate(state);
            case types.WORKFLOW_CREATE_SUCCESS:
                return workflowCreateSuccess(state, action);
            case types.WORKFLOW_CREATE_FAILURE:
                return workflowCreateFailure(state, action);
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

const workflowsLoad = (state) => {
    state.workflowsLoading = true;
    return state;
};

const workflowsLoadSuccess = (state, action) => {
    state.workflowsLoading = false;
    state.workflowsList = {};
    action.data.forEach(workflow => {
        state.workflowsList[workflow._id] = workflow
    });
    state.lastLoaded = new Date();
    return state;
};

const workflowsLoadFailure = (state, action) => {
    state.workflowsLoading = false;
    state.error = action.data.error;
    return state;
};

const setCurrentWorkflow = (state, action) => {
    state.currentWorkflow = action.workflow;
    return state;
};

const workflowCreate = (state) => {
    state.workflowLoading = true;
    return state;
};

const workflowCreateSuccess = (state, action) => {
    state.workflowLoading = false;
    console.log(action);
    state.workflowsList[action.workflow._id] = action.workflow;
    state.newWorkflow = action.workflow._id;
    return state;
};

const workflowCreateFailure = (state, action) => {
    state.workflowLoading = false;
    state.error = action.data.error;
    return state;
};

const workflowForgetNew = (state) => {
    state.newWorkflow = null;
    return state;
}