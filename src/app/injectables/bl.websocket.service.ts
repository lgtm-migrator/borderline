import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs/Rx';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/observable/dom/WebSocketSubject';
import { IBorderMessage } from '../interfaces/bl.message.interface';

@Injectable()
export class BorderWebsocketService {

    private handle: Subject<IBorderMessage>;

    constructor() {
        this.handle = new BorderWebsocketSubject('wss://echo.websocket.org');
    }

    public getSubject(): Subject<IBorderMessage> {
        return this.handle;
    }
}

class BorderWebsocketSubject<IBorderMessage> extends Subject<IBorderMessage> {

    private reconnectionObservable: Observable<number>;
    private wsSubjectConfig: WebSocketSubjectConfig;
    private socket: WebSocketSubject<any>;
    private connectionObserver: Observer<boolean>;
    public connectionStatus: Observable<boolean>;

    private defaultResultSelector = (e: MessageEvent): IBorderMessage => {
        return JSON.parse(e.data);
    }

    private defaultSerializer = (data: IBorderMessage): string => {
        return JSON.stringify(data);
    }

    constructor(
        private url: string,
        private reconnectInterval = 5000,
        private reconnectAttempts = 10,
        private resultSelector?: (e: MessageEvent) => IBorderMessage,
        private serializer?: (data: IBorderMessage) => string,
    ) {
        super();

        this.connectionStatus = new Observable((observer) => {
            this.connectionObserver = observer;
        }).share().distinctUntilChanged();

        if (!resultSelector) {
            this.resultSelector = this.defaultResultSelector;
        }
        if (!this.serializer) {
            this.serializer = this.defaultSerializer;
        }

        this.wsSubjectConfig = {
            url: url,
            closeObserver: {
                next: (e: CloseEvent) => {
                    this.socket = null;
                    this.connectionObserver.next(false);
                }
            },
            openObserver: {
                next: (e: Event) => {
                    this.connectionObserver.next(true);
                }
            }
        };
        this.connect();
        this.connectionStatus.subscribe((isConnected) => {
            if (!this.reconnectionObservable && typeof (isConnected) === 'boolean' && !isConnected) {
                this.reconnect();
            }
        });
    }

    public connect(): void {
        this.socket = new WebSocketSubject(this.wsSubjectConfig);
        this.socket.subscribe(
            (m) => {
                this.next(m);
            },
            (error: Event) => {
                if (!this.socket) {
                    this.reconnect();
                }
            });
    }

    public reconnect(): void {
        this.reconnectionObservable = Observable.interval(this.reconnectInterval).takeWhile((v, index) => {
            return index < this.reconnectAttempts && !this.socket;
        });
        this.reconnectionObservable.subscribe(
            () => {
                this.connect();
            },
            null,
            () => {
                this.reconnectionObservable = null;
                if (!this.socket) {
                    this.complete();
                    this.connectionObserver.complete();
                }
            });
    }

    public send(data: any): void {
        this.socket.next(this.serializer(data));
    }
}
