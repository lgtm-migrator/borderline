import { Observable } from 'rxjs';
import { api } from 'api';
import systemExtensions from 'extensions';

const types = {

    EXTENSIONS_LOAD: 'EXTENSIONS_LOAD',
    EXTENSIONS_SUCCESS: 'EXTENSIONS_SUCCESS',
    EXTENSIONS_FAILURE: 'EXTENSIONS_FAILURE',
    EXTENSIONS_DID_LOAD: 'EXTENSIONS_DID_LOAD',
    EXTENSION_UNIT_LOAD: 'EXTENSION_UNIT_LOAD',
    EXTENSION_UNIT_SUCCESS: 'EXTENSION_UNIT_SUCCESS',
    EXTENSION_UNIT_DID_LOAD: 'EXTENSION_UNIT_DID_LOAD',
    EXTENSION_UNIT_CORRUPTED: 'EXTENSION_UNIT_CORRUPTED'
};

export const actions = {

    extensionsWillLoad: () => ({
        type: types.EXTENSIONS_WILL_LOAD
    }),

    extensionsLoad: () => ({
        type: types.EXTENSIONS_LOAD
    }),

    extensionsSuccess: (list) => ({
        type: types.EXTENSIONS_SUCCESS,
        list: list
    }),

    extensionsFailure: () => ({
        type: types.EXTENSIONS_FAILURE
    }),

    extensionsDidLoad: () => ({
        type: types.EXTENSIONS_DID_LOAD
    }),

    extensionUnitLoad: (extension) => ({
        type: types.EXTENSION_UNIT_LOAD,
        extension: extension
    }),

    extensionUnitSucces: (extension) => ({
        type: types.EXTENSION_UNIT_SUCCESS,
        extension: extension
    }),

    extensionUnitDidLoad: (extension) => ({
        type: types.EXTENSION_UNIT_DID_LOAD,
        id: extension
    }),

    extensionUnitCorrupted: (name) => ({
        type: types.EXTENSION_UNIT_CORRUPTED,
        name: name
    }),

    extensionsWillInvoke: () => ({
        type: types.EXTENSIONS_WILL_INVOKE
    }),

    extensionsInvoke: () => ({
        type: types.EXTENSIONS_INVOKE
    }),

    extensionsDidInvoke: () => ({
        type: types.EXTENSIONS_DID_INVOKE
    })

};

export const epics = {

    enclaveBoot:
    (action) => action.ofType('START')
        .mapTo(actions.extensionsLoad()),

    extensionRetrieveLoad:
    (action) => action.ofType(types.EXTENSIONS_LOAD)
        .mergeMap(() =>
            api.fetchExtensionsList()
                .map(response => response.ok === true ? actions.extensionsSuccess(response.data.extensions) : actions.extensionsFailure())
        ),

    extensionDownloadFromLoad:
    (action) => action.ofType(types.EXTENSIONS_SUCCESS)
        .mergeMap(action =>
            Observable.from(action.list).defaultIfEmpty(null).map(extension =>
                extension === null ? actions.extensionsDidLoad() : actions.extensionUnitLoad(extension)
            )
        ),

    extensionPassthroughOnFail:
    (action) => action.ofType(types.EXTENSIONS_FAILURE)
        .mergeMap(() =>
            Observable.of(actions.extensionsDidLoad())
        ),

    extensionRetrieveSingle:
    (action) => action.ofType(types.EXTENSION_UNIT_LOAD)
        .mergeMap(action =>
            Observable.of(actions.extensionUnitSucces(action.extension))
        ),

    extensionSingleComplete:
    (action, state) => action.ofType(types.EXTENSION_UNIT_SUCCESS)
        .mergeMap(action =>
            Observable.concat(
                Observable.of(actions.extensionUnitDidLoad(action.extension)),
                Observable.from(Object.values(state.retrieve().toJS().list))
                    .every(extension => extension.loaded === true)
                    .filter(loaded => loaded === true)
                    .mapTo(actions.extensionsDidLoad())
            )
        )

};

export const reducers = {
    extensionReducer:
    (state = {
        ok: false,
        list: {}
    }, action) => {

        switch (action.type) {
            case types.EXTENSIONS_SUCCESS:
                return extensionsSuccess(state, action);
            case types.EXTENSIONS_DID_LOAD:
                return extensionsDidLoad(state);
            case types.EXTENSION_UNIT_SUCCESS:
                return extensionUnitSuccess(state, action);
            case 'STOP':
                return extensionCleanup(state);
            default:
                return state;
        }
    }
};

const extensionsSuccess = (state, action) => {
    Observable.from(action.list).map(extension =>
        state.list[extension.id] = {
            loaded: false
        }
    ).subscribe();
    let count = 0;
    Observable.from(systemExtensions).map(model =>
        state.list[`__sys${count++}__`] = {
            model: model,
            loaded: true
        }
    ).subscribe();
    return state;
};


const extensionsDidLoad = (state) => {
    state.ok = true;
    return state;
};

const extensionUnitSuccess = (state, action) => {
    state.list[action.extension.id].model = () => { };
    state.list[action.extension.id].loaded = true;
    return state;
};

const extensionCleanup = (state) => {
    state.ok = false;
    state.list = {};
    return state;
};

export default {
    actions,
    epics,
    reducers
};
