/*---------------------------------------------------------------------------------------------
 * @license
 * Copyright Florian Guitton (f.guitton@imperial.ac.uk). All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { WebSocketService } from './shared/websocket.service';
import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'borderline',
    template: 'Hello World',
})

export class BorderlineComponent {

    constructor() {
        WebSocketService.initialize();
    }

}
