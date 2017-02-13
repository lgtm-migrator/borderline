import { Observable } from 'rxjs';

const unbolt = (payload) => {
    return payload;
};

const bolt = (payload) => {
    return JSON.stringify(payload);
};

export default {

    fetchCurrentSession: () => Observable.from(fetch('/whoami', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    }).then(response => unbolt(response))),

    userLogin: (credentials) => Observable.from(fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: bolt(credentials)
    }).then(response => unbolt(response))),
};
