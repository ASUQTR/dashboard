/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
    NbComponentStatus,
    NbDialogService,
    NbMenuService,
    NbSidebarService,
} from '@nebular/theme';
import { Subscription } from 'rxjs';
import { GamepadService } from '../gamepad.service';
import { PopoverComponent } from '../popover/popover.component';
import { RosState } from '../ros-model.enum';
import { RoslibService } from '../roslib.service';
import { environment } from '../../environments/environment';
import compareVersions from 'compare-versions';
import { RestApiService } from '../rest-api.service';
import { UpdateAvailableDialogComponent } from '../update-available-dialog/update-available-dialog.component';

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
    updateAvailable = false;

    constructor(
        private rs: RoslibService,
        private gs: GamepadService,
        private cdr: ChangeDetectorRef,
        private sidebarService: NbSidebarService,
        private restApi: RestApiService,
        private dialogService: NbDialogService,
        private menuService: NbMenuService
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

        this.rosStateSubscription = this.rs.rosStateItem$.subscribe((newState) => {
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
        });

        setTimeout(() => this.verifyUpdate(this.cdr), 1000);
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true);
        return false;
    }

    async verifyUpdate(cdr: ChangeDetectorRef): Promise<void> {
        try {
            const packageJsonContent = await this.restApi
                .bitbucketGetVersionOfLatestReleaseBranch()
                .toPromise();
            const latestVersionOnBitbucket = packageJsonContent.version;
            console.log('Latest version: ', latestVersionOnBitbucket);
            this.updateAvailable =
                compareVersions(environment.version, latestVersionOnBitbucket) === -1;
        } catch (e) {
            console.log('Error: unable to reach Bitbucket', e);
        }

        cdr.detectChanges();
        if (!this.updateAvailable) {
            setInterval(() => this.verifyUpdate(cdr), 600000);
        }
    }

    openUpdateAvailableDialog() {
        this.dialogService.open(UpdateAvailableDialogComponent, {
            closeOnEsc: false,
            closeOnBackdropClick: false,
        });
    }

    ngOnDestroy() {
        this.rosStateSubscription.unsubscribe();
        this.gamepadConnectedSubscription.unsubscribe();
        this.gamepadDisconnectedSubscription.unsubscribe();
    }
}
