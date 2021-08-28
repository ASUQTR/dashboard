/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnInit } from '@angular/core';
import { RoslibService } from '../roslib.service';

@Component({
    selector: 'app-rosbridge',
    templateUrl: './rosbridge.component.html',
    styleUrls: ['./rosbridge.component.scss'],
})
export class RosbridgeComponent implements OnInit {
    constructor(public rb: RoslibService) {}

    ngOnInit(): void {}
}
