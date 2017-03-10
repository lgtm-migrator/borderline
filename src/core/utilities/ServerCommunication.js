/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import { Observable } from 'rxjs';

export default {

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

    fetchExtensionsList: () => query('/plugin_store', {
        method: 'GET'
    })
};

const query = (url, params = {}) => Observable.fromPromise(fetch(url, defaults(params)))
    .mergeMap(response =>
        Observable.forkJoin(
            Observable.of({
                ok: response.ok,
                type: response.type,
                status: response.status,
                headers: response.headers
            }),
            response.json()
        )).map(values => Object.assign({}, values[0], { data: unbolt(values[1]) }));

const defaults = (params) => {
    params.credentials = 'include';
    params.headers = Object.assign(params.headers || {}, {
        'Content-Type': 'application/json;charset=UTF-8'
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
