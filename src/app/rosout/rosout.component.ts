/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnInit } from '@angular/core';
import { RosService } from '../ros.service';
import { RosoutLevel, RosoutMessage } from '../ros-model.enum';

@Component({
    selector: 'app-rosout',
    templateUrl: './rosout.component.html',
    styleUrls: ['./rosout.component.scss'],
})
export class RosoutComponent implements OnInit {
    messages = new Array<RosoutMessage>();
    readonly levelInfo = RosoutLevel.INFO;
    readonly levelDebug = RosoutLevel.DEBUG;
    readonly levelError = RosoutLevel.ERROR;
    readonly levelFatal = RosoutLevel.FATAL;
    readonly levelWarn = RosoutLevel.WARN;
    rosoutLevel = RosoutLevel;
    date: Date;
    constructor(private rs: RosService) {}

    ngOnInit(): void {
        this.rs.rosoutData.subscribe((msg) => {
            if (msg) {
                this.messages.push(msg);
            }
        });
    }
}
