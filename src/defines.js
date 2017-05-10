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
            dataId: ""
        },
        std: {
            dataSize: 0,
            dataId: ""
        },
        isGridFS: false, // rm
        dataSize: 0, // rm
        data: {} // rm
    }
};

module.exports = {
    queryCollectionName: 'borderline_middleware_queries',
    queryGridFSCollectionName: 'borderline_middleware_gridFS',
    thresholdGridFS: Math.pow(10, 7), //10 Mo
    endpointModel: endpointModel,
    credentialsModel: credentialsModel,
    queryModel: queryModel
};