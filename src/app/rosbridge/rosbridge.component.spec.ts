/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RosbridgeComponent } from './rosbridge.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('RosbridgeComponent', () => {
    let component: RosbridgeComponent;
    let fixture: ComponentFixture<RosbridgeComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [RosbridgeComponent],
                imports: [
                    HttpClientModule,
                    NbToastrModule.forRoot(),
                    NbThemeModule.forRoot(),
                    NbLayoutModule,
                    NbEvaIconsModule,
                    NbIconModule,
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(RosbridgeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
