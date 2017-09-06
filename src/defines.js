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

const registryModel = {
    type: 'borderline-component',
    version: '0.0.1',
    timestamp: '',
    expires_in: 0,
    port: 4242,
    ip: 'localhost'
};


const userModel = {
    username: '',
    password: '',
    admin: false
};

const dataSourceModel = {
    sourceType: '',
    sourceName: '',
    sourceHost: '',
    sourcePort: 8080,
    public: false,
    users: []
};

const extensionModel = {
    enabled: true,
    name: '',
    description: '',
    author: '',
    build: '',
    version: '0.0.1'
};

const stepModel = {
    create: '', //Datetime
    update: '', //Datetime
    workflow: '',
    user: '',
    extension: '',
    action: '',
    context: {}
};

const workflowStepModel = {
    parent: null,
    children: []
};

const workflowModel = {
    create: '', //Datetime
    update: '', //Datetime
    owner: '',
    read: [],
    write: [],
    graph: workflowStepModel
};


module.exports = {
    globalRegistryCollectionName: 'borderline_global_registry',
    globalStorageCollectionName: 'borderline_global_storage',
    userCollectionName: 'borderline_server_users',
    workflowCollectionName: 'borderline_server_workflows',
    stepCollectionName: 'borderline_server_steps',
    dataSourcesCollectionName: 'borderline_server_data_sources',
    extensionsCollectionName: 'borderline_server_extensions',
    sessionCollectionName: 'borderline_server_sessions',
    sessionTimeout: 6 * (24 * 60 * 60), // 6 Days
    registryUpdateInterval: 5 * 1000, // 5 * 1000 ms = 5 seconds
    registryModel: registryModel,
    userModel: userModel,
    dataSourceModel: dataSourceModel,
    extensionModel:extensionModel,
    stepModel : stepModel,
    workflowStepModel: workflowStepModel,
    workflowModel: workflowModel,
    errorStacker: ErrorStack
};
