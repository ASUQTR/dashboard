/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { TestBed } from '@angular/core/testing';

import { RosService } from './ros.service';

describe('RosService', () => {
    let service: RosService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RosService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
