/*---------------------------------------------------------------------------------------------
 * @license
 * Copyright Florian Guitton (f.guitton@imperial.ac.uk). All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BorderlineModule } from './borderline.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(BorderlineModule).catch((err: any) => console.error(err));
