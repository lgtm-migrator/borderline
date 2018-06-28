import { forkJoin, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { bolt, unbolt } from './crypto';

const prefix = '/api';

export const api = {

    fetchCurrentSession: () => networkQuery('/whoami', {
        method: 'GET'
    }),

    userLogin: (credentials) => networkQuery('/login', {
        method: 'POST',
        body: credentials
    }),

    userLogout: () => networkQuery('/logout', {
        method: 'POST'
    }),

    fetchExtensionsList: () => networkQuery('/extension_store', {
        method: 'GET'
    }),

    fetchExtension: (id) => networkQuery(`/extensions/${id}/client`, {
        method: 'GET'
    }),

    fetchWorkflowsList: () => networkQuery('/workflow', {
        method: 'GET'
    }),

    fetchStepsList: (workflow) => networkQuery(`/workflow/${workflow}/step`, {
        method: 'GET'
    }),

    createWorkflow: (workflow) => networkQuery('/workflow', {
        method: 'PUT',
        body: workflow
    }),

    createStep: (workflow, step) => networkQuery(`/workflow/${workflow}/step`, {
        method: 'PUT',
        body: step
    }),

    updateStep: (step) => networkQuery(`/workflow/${step.workflow}/step/${step._id}`, {
        method: 'POST',
        body: step
    }),

    loadWorkflow: (wid) => networkQuery(`/workflow/${wid}`, {
        method: 'GET'
    }),

    createQuery: (query) => networkQuery('/query/new', {
        method: 'POST',
        body: query
    }),

    executeQuery: (qid) => networkQuery(`/query/${qid}/execute`, {
        method: 'POST'
    }),

    fetchQuery: (qid) => networkQuery(`/query/${qid}`, {
        method: 'GET'
    }),

    fetchQueryStatus: (qid) => networkQuery(`/query/${qid}/status`, {
        method: 'GET'
    }),

    fetchQueryOutput: (qid) => networkQuery(`/query/${qid}/output`, {
        method: 'GET'
    }),
};

const networkQuery = (url, params = {}) => from(fetch(`${prefix}${url}`, defaults(params)))
    .pipe(mergeMap(response =>
        forkJoin(
            of({
                ok: response.ok,
                status: response.status
            }),
            response.json()
        )), map(values => Object.assign({}, values[0], { data: unbolt(values[1]) })));

const defaults = (params) => {
    params.credentials = 'include';
    params.headers = Object.assign(params.headers || {}, {
        'Content-Type': 'application/json; charset=UTF-8'
    });
    if (params.body)
        params.body = bolt(params.body);
    return params;
};

export default api;
