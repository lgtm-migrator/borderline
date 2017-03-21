/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */
/* global borderline */

import { Observable } from 'rxjs';
import inspectorTypes from './types';
import inspectorActions from './actions';
const { api } = borderline;

export default {

    sessionValid:
    (action) => action.ofType('START')
        .mapTo(inspectorActions.extensionsLoad()),

    extensionRetrieveLoad:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_LOAD)
        .mergeMap(() =>
            api.fetchExtensionsList()
                .map(response => response.ok ? inspectorActions.extensionsSuccess(response.data.plugins) : inspectorActions.extensionsFailure())
        ),

    extensionDownloadFromLoad:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_SUCCESS)
        .mergeMap(action =>
            Observable.from(action.list).defaultIfEmpty(null).map(extension =>
                extension === null ? inspectorActions.extensionsDidLoad() : inspectorActions.extensionUnitLoad(extension)
            )
        ),

    extensionPassthroughOnFail:
    (action) => action.ofType(inspectorTypes.EXTENSIONS_FAILURE)
        .mergeMap(() =>
            Observable.of(inspectorActions.extensionsDidLoad())
        ),

    extensionRetrieveSingle:
    (action) => action.ofType(inspectorTypes.EXTENSION_UNIT_LOAD)
        .mergeMap(action =>
            // Observable.from(fetch('/plugin')
            //     .then(response => response.json()))
            //     .map(response => actions.singleSubAppSucces(action.id, response))
            Observable.of(inspectorActions.extensionUnitSucces(action.extension))
        ),

    extensionSingleComplete:
    (action, state) => action.ofType(inspectorTypes.EXTENSION_UNIT_SUCCESS)
        .mergeMap(action =>
            Observable.concat(
                Observable.of(inspectorActions.extensionUnitDidLoad(action.extension)),
                Observable.from(Object.values(state.retrieve().toJS().list))
                    .every(extension => extension.loaded === true)
                    .filter(loaded => loaded === true)
                    .mapTo(inspectorActions.extensionsDidLoad())
            )
        )
};
