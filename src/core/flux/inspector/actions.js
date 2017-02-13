import inspectorTypes from './types';

export default {

    extensionsWillLoad: () => ({
        type: inspectorTypes.EXTENSIONS_WILL_LOAD
    }),

    extensionsLoad: () => ({
        type: inspectorTypes.EXTENSIONS_LOAD
    }),

    extensionsSuccess: (list) => ({
        type: inspectorTypes.EXTENSIONS_SUCCESS,
        list: list
    }),

    extensionsDidLoad: () => ({
        type: inspectorTypes.EXTENSIONS_DID_LOAD
    }),

    extensionUnitLoad: (id) => ({
        type: inspectorTypes.EXTENSION_UNIT_LOAD,
        id: id
    }),

    extensionUnitSucces: (id, subapp) => ({
        type: inspectorTypes.EXTENSION_UNIT_SUCCESS,
        id: id,
        subapp: subapp
    }),

    extensionUnitDidLoad: (id) => ({
        type: inspectorTypes.EXTENSION_UNIT_DID_LOAD,
        id: id
    }),

    extensionUnitCorrupted: (name) => ({
        type: inspectorTypes.EXTENSION_UNIT_CORRUPTED,
        name: name
    }),

    extensionsWillInvoke: () => ({
        type: inspectorTypes.EXTENSIONS_WILL_INVOKE
    }),

    extensionsInvoke: () => ({
        type: inspectorTypes.EXTENSIONS_INVOKE
    }),

    extensionsDidInvoke: () => ({
        type: inspectorTypes.EXTENSIONS_DID_INVOKE
    })
};
