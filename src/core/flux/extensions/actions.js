import fluxTypes from './types';

export default {

    borderlineBoot: () => ({
        type: fluxTypes.BORDERLINE_BOOT
    }),

    borderlineReady: () => ({
        type: fluxTypes.BORDERLINE_READY
    }),

    loadExtensions: () => ({
        type: fluxTypes.EXTENSIONS_WILL_LOAD
    }),

    extensionsLoad: () => ({
        type: fluxTypes.EXTENSIONS_LOAD
    }),

    extensionsSuccess: (list) => ({
        type: fluxTypes.EXTENSIONS_SUCCESS,
        list: list
    }),

    extensionsLoaded: () => ({
        type: fluxTypes.EXTENSIONS_DID_LOAD
    }),

    loadSingleExtension: (id) => ({
        type: fluxTypes.SINGLE_EXTENSION_LOAD,
        id: id
    }),

    singleExtensionSucces: (id, subapp) => ({
        type: fluxTypes.SINGLE_EXTENSION_SUCCESS,
        id: id,
        subapp: subapp
    }),

    singleExtensionLoaded: (id) => ({
        type: fluxTypes.SINGLE_EXTENSION_DID_LOAD,
        id: id
    }),

    singleExtensionCorrupted: (name) => ({
        type: fluxTypes.SINGLE_EXTENSION_CORRUPT,
        name: name
    }),

    extensionsWillInvoke: () => ({
        type: fluxTypes.EXTENSIONS_WILL_INVOKE
    }),

    extensionsInvoke: () => ({
        type: fluxTypes.EXTENSIONS_INVOKE
    }),

    extensionsDidInvoke: () => ({
        type: fluxTypes.EXTENSIONS_DID_INVOKE
    })
};
