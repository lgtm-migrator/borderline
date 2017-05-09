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
    input: {},
    output: {
        isGridFS: false,
        dataSize: 0,
        data: {}
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