class BusinessHandler {

    // Temporary query data injector
    static composeQuery = (stepObject) => {
        let query = Object.assign({}, __toRemove__queryModel);
        query.input[0].metadata = JSON.parse(stepObject.context.apiQueryText);
        return query;
    }

}

const __toRemove__queryModel = {
    'endpoint': {
        'type': 'TS17_1',
        'name': 'Transmart',
        'protocol': 'http',
        'host': 'tm171-release-pg.thehyve.net',
        'baseUrl': '',
        'port': 80,
        'public': false
    },
    'credentials': {
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
