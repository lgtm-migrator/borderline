/*---------------------------------------------------------------------------------------------
 * @license
 * Copyright Florian Guitton (f.guitton@imperial.ac.uk). All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as Rx from 'rxjs/Rx';

export class WebSocketService {

    private static _socket: any;

    public static initialize() {
        this._socket = Rx.Observable.webSocket({
            closeObserver: {
                next: () => console.log('close'),
            },
            openObserver: {
                error: (e: any) => console.error(e),
                next: () => console.log('open'),
            },
            resultSelector: (e: any) => e.data,
            url: 'ws://echo.websocket.org',
        });

        this._socket.subscribe(
            (e: any) => console.log(`res: ${e}`),
            (e: any) => console.error(e),
            () => console.log('complete')
        );

        this._socket.multiplex(() => 'handshake_start', () => 'handshake_end', () => true)
            .subscribe(null, null, () => console.log('handshake_complete'));

        this._socket.multiplex(() => 'query_start', () => 'query_end', () => true)
            .takeUntil(Rx.Observable.interval(1000).take(2))
            .subscribe(null, null, () => console.log('query_complete'));
    }
}
