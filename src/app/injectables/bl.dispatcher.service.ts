import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs/Rx';

import { IBorderMessage } from '../interfaces/bl.message.interface';

import { BorderWebsocketService } from './bl.websocket.service';

@Injectable()
export class BorderDispatcherService {

    private subject: Subject<IBorderMessage>;

    constructor(websocket: BorderWebsocketService) {
        this.subject = websocket.getSubject();
        this.subject.subscribe(message => this.dispatch(message));
    }

    private dispatch(message) {
        console.log(message.data);
    }

    public advertise(name, payload) {
        console.log('advertisement in progress for ' + name);
        this.subject.next({
            verb: name,
            payload: payload
        });
    }

    public register(name, callback) {
        console.log('registration in progress for ' + name);
    }

    /*

        let counter = Observable.interval(1000);
        counter.subscribe(
            num => {
                this.sentMessage = 'Websocket Message ' + num;
                this.socket.next(this.sentMessage);
            }
        );

    */
}
