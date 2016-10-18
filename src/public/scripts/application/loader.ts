/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton <f.guitton@imperial.ac.uk>. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare const System: any;

/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
class Loader {

    public static initialize(global: any) {
        System.config({
            // map tells the System loader where to look for things
            map: {
                // our app is within the app folder
                borderline: 'app:borderline.js',
                // angular bundles
                '@angular/core': 'lib:@angular/core/bundles/core.umd.js',
                '@angular/common': 'lib:@angular/common/bundles/common.umd.js',
                '@angular/compiler': 'lib:@angular/compiler/bundles/compiler.umd.js',
                '@angular/platform-browser': 'lib:@angular/platform-browser/bundles/platform-browser.umd.js',
                '@angular/platform-browser-dynamic': 'lib:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
                '@angular/http': 'lib:@angular/http/bundles/http.umd.js',
                '@angular/router': 'lib:@angular/router/bundles/router.umd.js',
                '@angular/forms': 'lib:@angular/forms/bundles/forms.umd.js',
                // other libraries
                'reflect-metadata': 'lib:reflect-metadata/Reflect.js',
                rxjs: 'lib:rxjs',
                'zone.js': 'lib:zone.js/dist/zone.js',
            },
            // packages tells the System loader how to load when no filename and/or no extension
            packages: {
                app: {
                    defaultExtension: 'js',
                },
                lib: {
                    defaultExtension: 'js',
                },
            },
            paths: {
                // paths serve as alias
                'lib:': 'j/vendor/',
                'app:': 'j/application/',
            },
        });
    }
}

Loader.initialize(this);
