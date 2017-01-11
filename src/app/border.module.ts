import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BorderComponent } from './border.component';
import { BorderWebsocketService } from './injectables/bl.websocket.service';
import { BorderDispatcherService } from './injectables/bl.dispatcher.service';
import { BorderCoverComponent } from './miscellaneous/bl.cover.component';

@NgModule({
    declarations: [
        BorderComponent,
        BorderCoverComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [BorderWebsocketService, BorderDispatcherService],
    bootstrap: [BorderComponent]
})
export class BorderModule { }
