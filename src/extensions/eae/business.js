import { Constants } from 'borderline-utils';

class BusinessHandler {

    // Temporary query data injector
    static composeQuery = (stepObject) => {
        let query = Object.assign({}, __toRemove__queryModel);
        query.input[0].metadata = {
            code: stepObject.context.analysisCodeText,
            job: {
                type: 'python2',
                params: [stepObject.context.input[0].cache.storageId],
                swiftData: {
                    [`${Constants.BL_GLOBAL_COLLECTION_STORAGE}`]: [stepObject.context.input[0].cache.storageId]
                }
            }
        };
        return query;
    }

}

const __toRemove__queryModel = {
    'endpoint': {
        'type': 'EAE2_0',
        'name': 'Test deployement',
        'protocol': 'http',
        'host': '146.169.33.21',
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
