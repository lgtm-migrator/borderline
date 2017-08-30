const registryModel = {
    type: 'borderline-component',
    version: '0.0.1',
    timestamp: '',
    expires_in: 0,
    port: 4242,
    ip: 'localhost'
};

const endpointModel = {
    sourceType: '',
    sourceName: '',
    sourceHost: '',
    sourcePort: 8080,
    public: false
};

const credentialsModel = {
    username: '',
    password: ''
};

const executionModel = {
    status: 'unknown',
    start: null,
    end: null,
    info: ''
};

const queryModel = {
    endpoint: endpointModel,
    credentials: credentialsModel,
    input: {
        local: {},
        std: {}
    },
    status: executionModel,
    output: {
        local: {
            dataSize: 0,
            dataId: null
        },
        std: {
            dataSize: 0,
            dataId: null
        }
    }
};

function ErrorStack(error_obj, error_stack) {
    let error = {};
    let error_message = '';

    //Extract current error message
    if (typeof error_obj === 'string')
        error_message = error_obj;
    else if (typeof error_obj === 'object' && error_obj.hasOwnProperty('message'))
        error_message = error_obj.message;
    else if (typeof error_obj === 'object' && error_obj.hasOwnProperty('error'))
        error_message = error_obj.error;
    else if (error_obj === undefined || error_obj === null)
        error_message = 'Undefined';
    else
        error_message = error_obj.toString();
    error.error =  error_message;

    //Extract error stack
    if (error_stack === undefined && error_obj.hasOwnProperty('stack'))
        error_stack = error_obj.stack;
    if (error_stack !== undefined) {
        if (error_stack instanceof Error)
            error.stack = { error: error_stack.message };
        else
            error.stack = error_stack;
    }

    return error;
}

module.exports = {
    globalRegistryCollectionName: 'borderline_global_registry',
    globalStorageCollectionName: 'borderline_global_storage',
    queryCollectionName: 'borderline_middleware_queries',
    endpointTypes: ['TS171', 'eHS', 'File'],
    executionModel: executionModel,
    endpointModel: endpointModel,
    credentialsModel: credentialsModel,
    queryModel: queryModel,
    registryUpdateInterval: 60 * 1000, // 60 * 1000 ms = 1 minute
    registryModel: registryModel,
    errorStacker: ErrorStack
};
