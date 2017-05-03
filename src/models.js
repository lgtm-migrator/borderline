const endpointModel = {
    sourceType: "",
    sourceName: "",
    sourceHost: "",
    sourcePort: 8080,
    public: false
};

const credentialsModel = {
    _id: "",
    username: "",
    password: ""
};

const queryModel = {
    _id: "",
    credentials: credentialsModel,
    endpoint: endpointModel,
    query: {}
};


module.exports = {
    endpointModel: endpointModel,
    credentialsModel: credentialsModel,
    queryModel: queryModel
};