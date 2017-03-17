/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

class EditorLoader {

    constructor() {

        this.promise = new Promise(resolve => {

            if (typeof (window.monaco) === 'object') {
                resolve();
                return;
            }

            let onGotAmdLoader = () => window.require(['vs/editor/editor.main'], () => resolve());

            if (!window.require) {

                let loaderScript = document.createElement('script');
                loaderScript.type = 'text/javascript';
                loaderScript.src = 'vs/loader.js';
                loaderScript.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(loaderScript);
            } else {
                onGotAmdLoader();
            }
        });
    }

    getPromise() {
        return this.promise;
    }
}

const editorLoader = new EditorLoader();
export default editorLoader;
