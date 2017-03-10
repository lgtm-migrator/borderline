/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

export * from './core/utilities/InterfaceDescriptor';
import { Observable } from 'rxjs';

// This file should export the outside facing APIs available on global scope
// It is important that we place here all the elements to be exposed for plugin creation
// All will be available in a global scope UMD compatible variable called 'borderline'

// The 'borderline' global is most certainly not yet available upon startup
// We use Observable to check at an interval and then carry on

let wait = Observable.interval(100)
    .filter(() => window.borderline && window.borderline.apiVersion)
    .subscribe(() => {
        wait.unsubscribe();
        window.b = window.borderline;
        window.c = window.nativeConsole = window.console;
        window.console = {
            log: (...args) => (process.env.NODE_ENV !== 'production' ? window.c.log(...args) : null),
            info: (...args) => window.c.info(...args),
            warn: (...args) => window.c.warn(...args),
            error: (...args) => window.c.error(...args),
            debug: (...args) => (process.env.NODE_ENV !== 'production' ? window.c.debug(...args) : null)
        };
        window.alert = () => null;
        window.prompt = () => null;
        let BorderlineBootstrap = require('./core/BorderlineBootstrap').default;
        new BorderlineBootstrap();
    });
