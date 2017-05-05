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
    credentials: credentialsModel,
    endpoint: endpointModel,
    query: {}
};

const cacheModel = {
    query: "",
    data: {}
};


module.exports = {
    queryCollectionName: 'borderline_middleware_queries',
    cacheCollectionName: 'borderline_middleware_cache',
    endpointModel: endpointModel,
    credentialsModel: credentialsModel,
    queryModel: queryModel,
    cacheModel: cacheModel
};