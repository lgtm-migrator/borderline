import { forkJoin, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

const prefix = '/api';

export const api = {

    fetchCurrentSession: () => query('/whoami', {
        method: 'GET'
    }),

    userLogin: (credentials) => query('/login', {
        method: 'POST',
        body: credentials
    }),

    userLogout: () => query('/logout', {
        method: 'POST'
    }),

    fetchExtensionsList: () => query('/extension_store', {
        method: 'GET'
    }),

    fetchExtension: (id) => query(`/extensions/${id}/client`, {
        method: 'GET'
    }),

    fetchWorkflowsList: () => query('/workflow', {
        method: 'GET'
    }),

    fetchStepsList: (workflow) => query(`/workflow/${workflow}/step`, {
        method: 'GET'
    }),

    createWorkflow: (workflow) => query('/workflow', {
        method: 'PUT',
        body: workflow
    }),

    createStep: (workflow, step) => query(`/workflow/${workflow}/step`, {
        method: 'PUT',
        body: step
    }),

    loadWorkflow: (wid) => query(`/workflow/${wid}`, {
        method: 'GET'
    })
};

const query = (url, params = {}) => from(fetch(`${prefix}${url}`, defaults(params)))
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

const unbolt = (payload) => {
    return payload;
};

const bolt = (payload) => {
    return JSON.stringify(payload);
};

export default api;
