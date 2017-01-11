import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BorderComponent } from './border.component';
import { BorderCoverComponent } from './miscellaneous/bl.cover';

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
    providers: [],
    bootstrap: [BorderComponent]
})
export class BorderModule { }
