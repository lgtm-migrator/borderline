/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { BorderComponent } from './border.component';

describe('BorderComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BorderComponent
            ],
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(BorderComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('should render title in a h1 tag', async(() => {
        let fixture = TestBed.createComponent(BorderComponent);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('#bl-cover-message').textContent).toContain('Loading borderline components');
    }));
});
