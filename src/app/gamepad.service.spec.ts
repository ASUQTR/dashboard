/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { TestBed } from '@angular/core/testing';

import { GamepadService } from './gamepad.service';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { RouterTestingModule } from '@angular/router/testing';

describe('GamepadService', () => {
    let service: GamepadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
                RouterTestingModule.withRoutes([]),
            ],
        });
        service = TestBed.inject(GamepadService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
