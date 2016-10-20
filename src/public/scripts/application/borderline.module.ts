/*---------------------------------------------------------------------------------------------
 * @license
 * Copyright Florian Guitton (f.guitton@imperial.ac.uk). All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { BorderlineComponent } from './borderline.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({

    bootstrap: [BorderlineComponent],
    declarations: [BorderlineComponent],
    imports: [
        BrowserModule,
        HttpModule,
        CommonModule,
        FormsModule,
    ],
})

export class BorderlineModule { }
