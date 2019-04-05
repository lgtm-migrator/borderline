class BusinessHandler {

    // Temporary query data injector
    static composeQuery = (__unused__stepObject) => {
        let query = Object.assign({}, __toRemove__queryModel);
        return query;
    }

}

const __toRemove__queryModel = {
    'endpoint': {
        'type': 'File'
    },
    'credentials': {},
    'input': []
};

export default BusinessHandler;
