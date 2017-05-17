const endpointModel = {
    sourceType: "",
    sourceName: "",
    sourceHost: "",
    sourcePort: 8080,
    public: false
};

const credentialsModel = {
    username: "",
    password: ""
};

const queryModel = {
    endpoint: endpointModel,
    credentials: credentialsModel,
    input: {
        local: {},
        std: {}
    },
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
    var error = {};
    var error_message = '';

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
    queryCollectionName: 'borderline_middleware_queries',
    queryGridFSCollectionName: 'borderline_middleware_gridFS',
    thresholdGridFS: Math.pow(10, 7), //10 Mo
    endpointModel: endpointModel,
    credentialsModel: credentialsModel,
    queryModel: queryModel,
    errorStacker: ErrorStack
};