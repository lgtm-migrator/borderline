
const registryModel = {
    type: 'borderline-component',
    version: '0.0.1',
    lastUpdate: '',
    port: 4242,
    ip: 'localhost',
    hostname: 'localhost',
    system: {
        arch: 'unknown',
        type: 'unknown',
        platform: 'unknown',
        version: '0.0'
    },
    cpu: {
        cores: [
        ],
        loadavg: [0, 0, 0]
    },
    memory: {
        total: 0,
        free: 0
    }
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
    name: '',
    description: '',
    author: '',
    build: '',
    version: '0.0.1',
    enabled: {}
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

const dataModel = {
    label: '',
    metadata: {
    },
    cache: {
        dataSize: '0 b',
        storageId: ''
    }
};

const queryModel = {
    endpoint: dataSourceModel,
    credentials: credentialsModel,
    status: executionModel,
    input: dataModel,
    output: dataModel
};

module.exports = {
    global_registryCollectionName: 'borderline_global_registry',
    global_storageCollectionName: 'borderline_global_storage',
    global_sessionCollectionName: 'borderline_global_sessions',

    server_userCollectionName: 'borderline_server_users',
    server_workflowCollectionName: 'borderline_server_workflows',
    server_stepCollectionName: 'borderline_server_steps',
    server_dataSourcesCollectionName: 'borderline_server_data_sources',
    server_extensionsCollectionName: 'borderline_server_extensions',
    middleware_queryCollectionName: 'borderline_middleware_queries',

    serverServiceName: 'borderline-server-panzer',
    middlewareServiceName: 'borderline-middleware-flammenwerfer',
    sessionTimeout: 6 * (24 * 60 * 60), // 6 Days
    registryUpdateInterval: 5 * 1000, // 5 * 1000 ms = 5 seconds
    extensionUpdateInterval: 10 * 1000, // 10 * 1000 ms = 10 seconds
    extensionManifestFilename: 'manifest.json',

    registryModel: registryModel,
    userModel: userModel,
    dataSourceModel: dataSourceModel,
    extensionModel:extensionModel,
    stepModel : stepModel,
    workflowStepModel: workflowStepModel,
    workflowModel: workflowModel,
    executionModel: executionModel,
    credentialsModel: credentialsModel,
    dataModel: dataModel,
    queryModel: queryModel,
};