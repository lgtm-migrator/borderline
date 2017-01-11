import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs/Rx';

import { IBorderMessage } from '../interfaces/bl.message.interface';

@Injectable()
export class BorderWebsocketService {

    private handle: Subject<IBorderMessage>;

    private createWebsocket(): Subject<IBorderMessage> {
        let socket = new WebSocket('wss://echo.websocket.org');
        let observable = Observable.create(
            (observer: Observer<IBorderMessage>) => {
                socket.onmessage = observer.next.bind(observer);
                socket.onerror = observer.error.bind(observer);
                socket.onclose = observer.complete.bind(observer);
                return socket.close.bind(socket);
            }
        );
        let observer = {
            next: (data: Object) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(data));
                }
            }
        };
        return Subject.create(observer, observable);
    }

    constructor() {
        this.handle = this.createWebsocket();
    }

    public getSubject(): Subject<IBorderMessage> {
        return this.handle;
    }

}
