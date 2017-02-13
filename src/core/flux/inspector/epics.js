import { Observable } from 'rxjs';
import PluginContext from '../../utilities/PluginContext';
import inspectorTypes from './types';
import inspectorActions from './actions';
import systemExtensions from '../../../extensions';

export default {

    sessionValid:
    (action) => action.ofType('@@core/session/SESSION_VALID')
        .mapTo(inspectorActions.extensionsWillLoad()),

    extensionListFromWillLoad:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_WILL_LOAD)
        .mapTo(inspectorActions.extensionsLoad()),

    extensionRetrieveLoad:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_LOAD)
        .mergeMap(() =>
            // Observable.from(fetch('/plugin_store')
            //     .then(response => response.json()))
            //     .map(response => actions.subAppsSuccess(response))
            Observable.of(inspectorActions.extensionsSuccess([]))
        ),

    extensionDownloadFromLoad:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_SUCCESS)
        .mergeMap(action =>
            Observable.from(action.list).defaultIfEmpty(null).map(id =>
                id === null ? inspectorActions.extensionsDidLoad() : inspectorActions.extensionUnitLoad(id)
            )
        ),

    extensionRetrieveSingle:
    (action) => action.ofType(inspectorTypes.EXTENSION_UNIT_LOAD)
        .mergeMap(action =>
            // Observable.from(fetch('/plugin')
            //     .then(response => response.json()))
            //     .map(response => actions.singleSubAppSucces(action.id, response))
            Observable.of(inspectorActions.extensionUnitSucces(action.id, {}))
        ),

    extensionSingleComplete:
    (action, state) => action.ofType(inspectorTypes.EXTENSION_UNIT_SUCCESS)
        .mergeMap(action =>
            Observable.concat(
                Observable.of(inspectorActions.extensionUnitDidLoad(action.id)),
                Observable.from(Object.values(state.retrieve().toJS().extensions))
                    .every(subapp => subapp.loaded === true)
                    .filter(loaded => loaded === true)
                    .mapTo(inspectorActions.extensionsDidLoad())
            )
        ),

    extensionDidLoad:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_DID_LOAD)
        .mapTo(inspectorActions.extensionsWillInvoke()),

    extensionWillInvoke:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_WILL_INVOKE)
        .mapTo(inspectorActions.extensionsInvoke()),

    extensionInvoke:
    (action, state) => action.ofType(inspectorTypes.EXTENSIONS_INVOKE)
        .mergeMap(() => {
            let results = [];
            let extensions = state.retrieve().toJS().extensions || {};
            let stack = Object.assign({}, extensions, systemExtensions);
            Object.keys(stack).map((key) => {
                try {
                    new PluginContext(stack[key]);
                } catch (exception) {
                    results.push(inspectorActions.extensionUnitCorrupted(key));
                    if (process.env.NODE_ENV === 'development')
                        console.error(exception); // eslint-disable-line no-console
                }
            });
            results.push(inspectorActions.extensionsDidInvoke());
            return Observable.from(results);
        }),

    extensionDidInvoke:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_DID_INVOKE)
        .mapTo({ type: '@@all/borderline/READY' })
};
