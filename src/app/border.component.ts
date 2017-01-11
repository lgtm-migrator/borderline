import { Component } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs/Rx';

import { BorderDispatcherService } from './injectables/bl.dispatcher.service';

@Component({
    selector: 'bl-root',
    templateUrl: './border.component.html',
    styleUrls: ['./border.component.scss']
})
export class BorderComponent {

    private dispatcher: BorderDispatcherService;

    constructor(dispatcher: BorderDispatcherService) {
        this.dispatcher = dispatcher;
        this.dispatcher.advertise('plop', null);
    }
}
