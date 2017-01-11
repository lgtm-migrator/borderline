import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs/Rx';
import { IBorderMessage } from '../interfaces/bl.message.interface';
import { BorderWebsocketService } from './bl.websocket.service';

@Injectable()
export class BorderDispatcherService {

    private subject: Subject<IBorderMessage>;
    private registry: { [key: string]: Function[] };

    constructor(websocket: BorderWebsocketService) {
        this.registry = {};
        this.subject = websocket.getSubject();
        this.subject.subscribe((message: IBorderMessage) => {
            this.dispatch(message);
        }, this.error, this.complete);
    }

    private dispatch(message) {
        let verb = message.verb;
        if (this.registry === undefined || this.registry[verb] === undefined) {
            return;
        }
        for (let func of this.registry[verb]) {
            func();
        }
    }

    private error(message) {
        console.log('BorderDispatcherService Error', message);
    }

    private complete() {
        console.log('BorderDispatcherService Complete');
    }

    public advertise(verb, payload) {
        this.subject.next({
            verb: verb,
            payload: payload
        });
    }

    public register(verb: string, callback: Function) {
        if (this.registry[verb] === undefined) {
            this.registry[verb] = [];
        }
        this.registry[verb].push(callback);
    }
}
