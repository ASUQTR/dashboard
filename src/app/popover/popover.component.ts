/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectionStatus } from '../connection-status.model';
import { GamepadService } from '../gamepad.service';
import { RosState } from '../ros-model.enum';
import { RosService } from '../ros.service';

@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
    readonly successIcon = 'checkmark-circle-2';
    readonly failureIcon = 'close-circle';
    readonly successColor = 'success';
    readonly failureColor = 'danger';
    statusList: Array<ConnectionStatus> = [
        {
            statusIcon: this.failureIcon,
            statusIconColor: this.failureColor,
            connected: 0,
            statusText: 'Connecting to ROS server...',
        },
        {
            statusIcon: this.failureIcon,
            statusIconColor: this.failureColor,
            connected: 0,
            statusText: 'Waiting for gamepad...',
        },
    ];
    rosStateSubscription: Subscription;
    gamepadConnected: boolean;
    gp: Gamepad;
    rosbridgeConnected: RosState;
    rosStatusIcon: any;
    rosIconColor: any;
    gamepadConnectedSubscription: any;
    gamepadDisconnectedSubscription: any;
    constructor(
        public gs: GamepadService,
        public rs: RosService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.gamepadConnectedSubscription = this.gs.onGamepadConnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.statusList[1].connected = 1;
                    this.statusList[1].statusText = 'Gamepad connected';
                    this.statusList[1].statusIcon = this.successIcon;
                    this.statusList[1].statusIconColor = this.successColor;
                    this.gp = e.gamepad;
                    this.cdr.detectChanges();
                }
            }
        );
        this.gamepadDisconnectedSubscription = this.gs.onGamepadDisconnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.statusList[1].connected = 0;
                    this.statusList[1].statusText = 'Waiting for gamepad...';
                    this.statusList[1].statusIcon = this.failureIcon;
                    this.statusList[1].statusIconColor = this.failureColor;
                    this.gp = e.gamepad;
                    this.cdr.detectChanges();
                }
            }
        );

        this.rosStateSubscription = this.rs.rosStateItem$.subscribe(
            (newState) => {
                this.statusList[0].statusText = this.rs.statusText;
                this.statusList[0].connected = newState;
                switch (newState) {
                    case RosState.Connected:
                        this.statusList[0].statusIcon = this.successIcon;
                        this.statusList[0].statusIconColor = this.successColor;
                        break;

                    case RosState.Disconnected:
                        this.statusList[0].statusIcon = this.failureIcon;
                        this.statusList[0].statusIconColor = this.failureColor;
                        break;

                    case RosState.Error:
                        this.statusList[0].statusIcon = this.failureIcon;
                        this.statusList[0].statusIconColor = this.failureColor;
                        break;
                }
                this.cdr.detectChanges();
            }
        );
    }

    ngOnDestroy() {
        this.rosStateSubscription.unsubscribe();
        this.gamepadConnectedSubscription.unsubscribe();
        this.gamepadDisconnectedSubscription.unsubscribe();
    }
}
