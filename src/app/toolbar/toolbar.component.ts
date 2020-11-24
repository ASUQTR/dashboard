/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { NbComponentStatus, NbSidebarService } from '@nebular/theme';
import ROSBRIDGE from 'roslib';
import { Subscription } from 'rxjs';
import { GamepadService } from '../gamepad.service';
import { PopoverComponent } from '../popover/popover.component';
import { RosState } from '../ros-model.enum';
import { RosService } from '../ros.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
    readonly successIcon = 'checkmark-circle-2';
    readonly failureIcon = 'close-circle';
    readonly successColor = 'success';
    readonly failureColor = 'danger';
    summaryStatusIcon = this.successIcon;
    summaryIconColor: NbComponentStatus = this.successColor;
    rosStatusIcon = this.successIcon;
    rosIconColor = this.successColor;
    rosbridgeConnected = RosState.Disconnected;
    gamepadConnected = false;
    gp: Gamepad;
    rosStateSubscription: Subscription;
    popoverComponent = PopoverComponent;
    gamepadConnectedSubscription: Subscription;
    gamepadDisconnectedSubscription: Subscription;
    constructor(
        private rs: RosService,
        private gs: GamepadService,
        private cdr: ChangeDetectorRef,
        private sidebarService: NbSidebarService
    ) {}

    ngOnInit(): void {
        this.gamepadConnectedSubscription = this.gs.onGamepadConnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.gamepadConnected = true;
                    this.gp = e.gamepad;
                    this.cdr.detectChanges();
                }
            }
        );
        this.gamepadDisconnectedSubscription = this.gs.onGamepadDisconnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.gamepadConnected = false;
                    this.gp = e.gamepad;
                    this.cdr.detectChanges();
                }
            }
        );

        this.rosStateSubscription = this.rs.rosStateItem$.subscribe(
            (newState) => {
                this.rosbridgeConnected = newState;
                switch (newState) {
                    case RosState.Connected:
                        this.rosStatusIcon = this.successIcon;
                        this.rosIconColor = this.successColor;
                        break;

                    case RosState.Disconnected:
                        break;

                    case RosState.Error:
                        this.rosStatusIcon = this.failureIcon;
                        this.rosIconColor = this.failureColor;
                        break;
                }
                this.cdr.detectChanges();
            }
        );
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(false);
        return false;
    }

    ngOnDestroy() {
        this.rosStateSubscription.unsubscribe();
        this.gamepadConnectedSubscription.unsubscribe();
        this.gamepadDisconnectedSubscription.unsubscribe();
    }
}
