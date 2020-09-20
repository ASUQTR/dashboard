import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import ROSBRIDGE from 'roslib';
import { Subscription } from 'rxjs';
import { GamepadService } from '../gamepad.service';
import { PopoverComponent } from '../popover/popover.component';
import { RosState } from '../ros-state.enum';
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
    summaryIconColor = this.successColor;
    rosStatusIcon = this.successIcon;
    rosIconColor = this.successColor;
    gamepadStatusIcon = this.successIcon;
    gamepadIconColor = this.successColor;
    @Input() rosBridge: ROSBRIDGE.Ros;
    @Input() gamepad: Gamepad;
    rosbridgeConnected: RosState = RosState.Disconnected;
    gamepadConnected = false;
    gp: Gamepad;
    rosStateSubscription: Subscription;
    popoverComponent = PopoverComponent;
    constructor(
        private rs: RosService,
        private gs: GamepadService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.gs.onGamepadConnected.subscribe((e: GamepadEvent) => {
            this.gamepadConnected = true;
            this.gp = e.gamepad;
            this.cdr.detectChanges();
        });
        this.gs.onGamepadDisconnected.subscribe((e: GamepadEvent) => {
            this.gamepadConnected = false;
            this.gp = e.gamepad;
            this.cdr.detectChanges();
        });

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

    ngOnDestroy() {
        this.rosStateSubscription.unsubscribe();
    }
}
