const { api } = window;

class BusinessHandler {

    // Custom name for container
    static executeStep = (stepObject) => {
        return new Promise((resolve, reject) => {
            let query = Object.assign({}, __toRemove__queryModel);
            query.input.metadata = JSON.parse(stepObject.context.query);
            api.createQuery(query).toPromise().then(response => {
                if (response.ok === false)
                    reject();
                console.log(response.data);
            });
        });
    }

}

const __toRemove__queryModel = {
    'endpoint': {
        'type': 'TS171',
        'name': 'Transmart',
        'protocol': 'http',
        'host': 'tm171-release-pg.thehyve.net',
        'baseUrl': '',
        'port': 80,
        'public': false
    },
    'credentials': {
        '_id': '',
        'username': 'admin',
        'password': 'admin'
    },
    'input': [
        {
            'metadata': {},
            'cache': {}
        }
    ]
};

export default BusinessHandler;
