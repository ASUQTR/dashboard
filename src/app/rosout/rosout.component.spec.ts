/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosoutComponent } from './rosout.component';

describe('RosoutComponent', () => {
    let component: RosoutComponent;
    let fixture: ComponentFixture<RosoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RosoutComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RosoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
