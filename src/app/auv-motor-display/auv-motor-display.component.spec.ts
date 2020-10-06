/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuvMotorDisplayComponent } from './auv-motor-display.component';

describe('AuvMotorDisplayComponent', () => {
    let component: AuvMotorDisplayComponent;
    let fixture: ComponentFixture<AuvMotorDisplayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AuvMotorDisplayComponent],
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
