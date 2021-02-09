/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GamepadComponent } from './gamepad.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { RouterTestingModule } from '@angular/router/testing';

describe('GamepadComponent', () => {
    let component: GamepadComponent;
    let fixture: ComponentFixture<GamepadComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [GamepadComponent],
                imports: [
                    HttpClientModule,
                    NbToastrModule.forRoot(),
                    NbThemeModule.forRoot(),
                    NbLayoutModule,
                    NbEvaIconsModule,
                    NbIconModule,
                    RouterTestingModule.withRoutes([]),
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(GamepadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
