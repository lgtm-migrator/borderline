import { Observable } from 'rxjs';
import Immutable, { Map } from 'immutable';
import PluginContext from './PluginContext';
import * as api from './InterfaceDescriptor';

// We import system extensions here
// import ConstructionPlugin from '../../extensions/construction';
// import LocationPlugin from '../../extensions/location';
import DashboardPlugin from '../../extensions/dashboard';
// import StoryLinePlugin from '../../extensions/storyline';

const systemExtensions = {
    dashboard: DashboardPlugin,
    // storyLine: StoryLinePlugin
};

const activeExtensions = [];

class PluginInspector {

    constructor() {
        this.initialized = false;

        // We add hot reloading block here to prevent propagation
        if (module.hot) {
            return;
        }
    }

    discover() {

        console.info('Launching Plugin discovery ...'); // eslint-disable-line no-console

        // Here we prevent double initialization
        // We should make sure we handle reloading from there
        if (this.initialized)
            return;

        // For some unheard of reasons, borderline global is not yet available at this time.
        // We use Observable to delay the check and then carry on.
        let wait = Observable.interval(100)
            .filter(() => window.borderline && window.borderline.apiVersion)
            .subscribe(() => {
                wait.unsubscribe();
                this.injectFlux();
                this.initialized = true;
            });
    }

    injectFlux() {
        api.registerReducers(localReducers);
        api.registerEpics(localEpics);
        api.dispatch(localActions.loadExtensions());
    }
}

const localTypes = {
    EXTENSIONS_WILL_LOAD: '@@core/inspector/EXTENSIONS_WILL_LOAD',
    EXTENSIONS_DID_LOAD: '@@core/inspector/EXTENSIONS_DID_LOAD',
    EXTENSIONS_LISTING: '@@core/inspector/EXTENSIONS_LISTING',
    EXTENSIONS_SUCCESS: '@@core/inspector/EXTENSIONS_SUCCESS',
    SINGLE_EXTENSION_LOAD: '@@core/inspector/SINGLE_EXTENSION_LOAD',
    SINGLE_EXTENSION_SUCCESS: '@@core/inspector/SINGLE_EXTENSION_SUCCESS',
    SINGLE_EXTENSION_DID_LOAD: '@@core/inspector/SINGLE_EXTENSION_DID_LOAD',
    SINGLE_EXTENSION_CORRUPT: '@@core/inspector/SINGLE_EXTENSION_CORRUPT',
    EXTENSIONS_WILL_INVOKE: '@@core/inspector/EXTENSIONS_WILL_INVOKE',
    EXTENSIONS_INVOKE: '@@core/inspector/EXTENSIONS_INVOKE',
    EXTENSIONS_DID_INVOKE: '@@core/inspector/EXTENSIONS_DID_INVOKE',
    BORDERLINE_READY: '@@all/borderline/READY',
};

const localActions = {

    loadExtensions: () => ({
        type: localTypes.EXTENSIONS_WILL_LOAD
    }),

    extensionsListing: () => ({
        type: localTypes.EXTENSIONS_LISTING
    }),

    extensionsSuccess: (list) => ({
        type: localTypes.EXTENSIONS_SUCCESS,
        list: list
    }),

    extensionsLoaded: () => ({
        type: localTypes.EXTENSIONS_DID_LOAD
    }),

    loadSingleExtension: (id) => ({
        type: localTypes.SINGLE_EXTENSION_LOAD,
        id: id
    }),

    singleExtensionSucces: (id, subapp) => ({
        type: localTypes.SINGLE_EXTENSION_SUCCESS,
        id: id,
        subapp: subapp
    }),

    singleExtensionLoaded: (id) => ({
        type: localTypes.SINGLE_EXTENSION_DID_LOAD,
        id: id
    }),

    singleExtensionCorrupted: (name) => ({
        type: localTypes.SINGLE_EXTENSION_CORRUPT,
        name: name
    }),

    extensionsWillInvoke: () => ({
        type: localTypes.EXTENSIONS_WILL_INVOKE
    }),

    extensionsInvoke: () => ({
        type: localTypes.EXTENSIONS_INVOKE
    }),

    extensionsDidInvoke: () => ({
        type: localTypes.EXTENSIONS_DID_INVOKE
    }),

    borderlineReady: () => ({
        type: localTypes.BORDERLINE_READY
    })
};

const localEpics = {

    extensionListFromWillLoad:
    (action) => action.ofType(localTypes.EXTENSIONS_WILL_LOAD)
        .mapTo(localActions.extensionsListing()),

    extensionRetreiveListing:
    (action) => action.ofType(localTypes.EXTENSIONS_LISTING)
        .mergeMap(() =>
            // Observable.from(fetch('/plugin_store')
            //     .then(response => response.json()))
            //     .map(response => actions.subAppsSuccess(response))
            Observable.of(localActions.extensionsSuccess([]))
        ),

    extensionDownloadFromListing:
    (action) => action.ofType(localTypes.EXTENSIONS_SUCCESS)
        .mergeMap(action =>
            Observable.from(action.list).defaultIfEmpty(null).map(id =>
                id === null ? localActions.extensionsLoaded() : localActions.loadSingleExtension(id)
            )
        ),

    extensionRetreiveSingle:
    (action) => action.ofType(localTypes.SINGLE_EXTENSION_LOAD)
        .mergeMap(action =>
            // Observable.from(fetch('/plugin')
            //     .then(response => response.json()))
            //     .map(response => actions.singleSubAppSucces(action.id, response))
            Observable.of(localActions.singleExtensionSucces(action.id, {}))
        ),

    extensionSingleComplete:
    (action, store) => action.ofType(localTypes.SINGLE_EXTENSION_SUCCESS)
        .mergeMap(action =>
            Observable.concat(
                Observable.of(localActions.singleExtensionLoaded(action.id)),
                Observable.from(Object.values(store.getState('extensionReducer')['extensionReducer'].toJS().extensions))
                    .every(subapp => subapp.loaded === true)
                    .filter(loaded => loaded === true)
                    .mapTo(localActions.extensionsLoaded())
            )
        ),

    extensionDidLoad:
    (action) => action.ofType(localTypes.EXTENSIONS_DID_LOAD)
        .mapTo(localActions.extensionsWillInvoke()),

    extensionWillInvoke:
    (action) => action.ofType(localTypes.EXTENSIONS_WILL_INVOKE)
        .mapTo(localActions.extensionsInvoke()),

    extensionInvoke:
    (action, store) => action.ofType(localTypes.EXTENSIONS_INVOKE)
        .mergeMap(() => {
            let results = [];
            let extensions = store.getState('extensionReducer')['extensionReducer'].toJS().extensions;
            Object.assign(extensions, systemExtensions);
            Object.keys(extensions).map((key) => {
                try {
                    let current = new PluginContext(extensions[key]);
                    activeExtensions.push(current);
                } catch (exception) {
                    results.push(localActions.singleExtensionCorrupted(key));
                    if (process.env.NODE_ENV === 'development')
                        console.error(exception); // eslint-disable-line no-console
                }
            });
            results.push(localActions.extensionsDidInvoke());
            return Observable.from(results);
        }),

    extensionDidInvoke:
    (action) => action.ofType(localTypes.EXTENSIONS_DID_INVOKE)
        .mapTo(localActions.borderlineReady())
};

const localReducers = {

    extensionReducer:
    (state = Map([]), action) => {

        switch (action.type) {
            case localTypes.EXTENSIONS_SUCCESS:
                return extensionsSuccess(state, action);
            case localTypes.SINGLE_EXTENSION_SUCCESS:
                return singleExtensionSuccess(state, action);
            default:
                return state;
        }
    }
};

const extensionsSuccess = (state, action) => {
    let future = state.toJS();
    future.extensions = future.extensions || {};
    Observable.from(action.list).map(id =>
        future.extensions[id] = {
            loaded: false
        }
    ).subscribe();
    return Immutable.fromJS(future);
};

const singleExtensionSuccess = (state, action) => {
    let future = state.toJS();
    future.extensions[action.id].module = action.subapp;
    future.extensions[action.id].loaded = true;
    return Immutable.fromJS(future);
};

const pluginInspector = new PluginInspector();
export default pluginInspector;
