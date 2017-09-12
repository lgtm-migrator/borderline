const defines = require('defines.js');
let ErrorStack = require('./error.js');
let RegistryModule = require('./registry.js');

module.exports = {
    Models: {
        BL_MODEL_REGISTRY: defines.registryModel,
        BL_MODEL_USER: defines.userModel,
        BL_MODEL_WORKFLOW: defines.workflowModel,
        BL_MODEL_STEP: defines.stepModel,
        BL_MODEL_EXTENSION: defines.extensionModel,
        BL_MODEL_DATA_SOURCE: defines.dataSourceModel
    },
    Constants: {
        BL_GLOBAL_COLLECTION_REGISTRY: defines.global_registryCollectionName,
        BL_GLOBAL_COLLECTION_SESSIONS: defines.global_sessionCollectionName,

        BL_SERVER_COLLECTION_USERS: defines.server_userCollectionName,
        BL_SERVER_COLLECTION_WORKFLOW: defines.server_workflowCollectionName,
        BL_SERVER_COLLECTION_STEPS: defines.server_stepCollectionName,
        BL_SERVER_COLLECTION_DATA_SOURCES: defines.server_dataSourcesCollectionName,
        BL_SERVER_COLLECTION_EXTENSIONS: defines.server_extensionsCollectionName,

        BL_DEFAULT_SESSION_TIMEOUT: defines.sessionTimeout,
        BL_DEFAULT_REGISTRY_FREQUENCY: defines.registryUpdateInterval,
        BL_DEFAULT_EXTENSION_FREQUENCY: defines.extensionUpdateInterval,
        BL_DEFAULT_EXTENSION_MANIFEST: defines.extensionManifestFilename
    },
    ErrorHelper: ErrorStack,
    RegistryHelper: RegistryModule
};