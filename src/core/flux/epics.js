import { Observable } from 'rxjs';
import PluginContext from '../utilities/PluginContext';
import fluxTypes from './types';
import fluxActions from './actions';
import systemExtensions from '../../extensions';

export default {

    borderlineBoot:
    (action) => action.ofType(fluxTypes.BORDERLINE_BOOT)
        .mapTo(fluxActions.loadExtensions()),

    extensionListFromWillLoad:
    (action) => action.ofType(fluxTypes.EXTENSIONS_WILL_LOAD)
        .mapTo(fluxActions.extensionsLoad()),

    extensionRetrieveLoad:
    (action) => action.ofType(fluxTypes.EXTENSIONS_LOAD)
        .mergeMap(() =>
            // Observable.from(fetch('/plugin_store')
            //     .then(response => response.json()))
            //     .map(response => actions.subAppsSuccess(response))
            Observable.of(fluxActions.extensionsSuccess([]))
        ),

    extensionDownloadFromLoad:
    (action) => action.ofType(fluxTypes.EXTENSIONS_SUCCESS)
        .mergeMap(action =>
            Observable.from(action.list).defaultIfEmpty(null).map(id =>
                id === null ? fluxActions.extensionsLoaded() : fluxActions.loadSingleExtension(id)
            )
        ),

    extensionRetrieveSingle:
    (action) => action.ofType(fluxTypes.SINGLE_EXTENSION_LOAD)
        .mergeMap(action =>
            // Observable.from(fetch('/plugin')
            //     .then(response => response.json()))
            //     .map(response => actions.singleSubAppSucces(action.id, response))
            Observable.of(fluxActions.singleExtensionSucces(action.id, {}))
        ),

    extensionSingleComplete:
    (action, state) => action.ofType(fluxTypes.SINGLE_EXTENSION_SUCCESS)
        .mergeMap(action =>
            Observable.concat(
                Observable.of(fluxActions.singleExtensionLoaded(action.id)),
                Observable.from(Object.values(state.retrieve().toJS().extensions))
                    .every(subapp => subapp.loaded === true)
                    .filter(loaded => loaded === true)
                    .mapTo(fluxActions.extensionsLoaded())
            )
        ),

    extensionDidLoad:
    (action) => action.ofType(fluxTypes.EXTENSIONS_DID_LOAD)
        .mapTo(fluxActions.extensionsWillInvoke()),

    extensionWillInvoke:
    (action) => action.ofType(fluxTypes.EXTENSIONS_WILL_INVOKE)
        .mapTo(fluxActions.extensionsInvoke()),

    extensionInvoke:
    (action, state) => action.ofType(fluxTypes.EXTENSIONS_INVOKE)
        .mergeMap(() => {
            let results = [];
            let extensions = state.retrieve().toJS().extensions || {};
            Object.assign(extensions, systemExtensions);
            Object.keys(extensions).map((key) => {
                try {
                    new PluginContext(extensions[key]);
                } catch (exception) {
                    results.push(fluxActions.singleExtensionCorrupted(key));
                    if (process.env.NODE_ENV === 'development')
                        console.error(exception); // eslint-disable-line no-console
                }
            });
            results.push(fluxActions.extensionsDidInvoke());
            return Observable.from(results);
        }),

    extensionDidInvoke:
    (action) => action.ofType(fluxTypes.EXTENSIONS_DID_INVOKE)
        .mapTo(fluxActions.borderlineReady())
};
