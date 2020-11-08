/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuvMotorDisplayComponent } from './auv-motor-display.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('AuvMotorDisplayComponent', () => {
    let component: AuvMotorDisplayComponent;
    let fixture: ComponentFixture<AuvMotorDisplayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AuvMotorDisplayComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuvMotorDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
