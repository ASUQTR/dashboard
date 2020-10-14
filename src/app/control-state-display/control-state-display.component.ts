import { Component, OnDestroy, OnInit } from '@angular/core';
import { RosService } from '../ros.service';
import { ControlStateFeedbackMessage } from '../ros-model.enum';
import { Subscription } from 'rxjs';
import { NbComponentStatus } from '@nebular/theme';

@Component({
    selector: 'app-control-state-display',
    templateUrl: './control-state-display.component.html',
    styleUrls: ['./control-state-display.component.scss'],
})
export class ControlStateDisplayComponent implements OnInit, OnDestroy {
    private controlModeFeedbackSubscription: Subscription;
    controlMode = new ControlModeDisplay(false);

    constructor(private rs: RosService) {
        this.controlModeFeedbackSubscription = this.rs.controlModeFeedbackData.subscribe(
            (msg: ControlStateFeedbackMessage) => {
                if (msg) {
                    this.controlMode.updateState(msg.data);
                }
            }
        );
    }

    ngOnInit(): void {}

    ngOnDestroy() {
        this.controlModeFeedbackSubscription.unsubscribe();
    }
}

class ControlModeDisplay {
    readonly successIcon = 'checkmark-circle-2';
    readonly failureIcon = 'close-circle';
    readonly successColor = 'success';
    readonly failureColor = 'danger';
    private state: boolean;
    icon = this.failureIcon;
    iconColor: NbComponentStatus = 'danger';

    constructor(state: boolean) {
        this.state = state;
    }

    updateState(newState: boolean) {
        this.state = newState;
        if (newState) {
            this.icon = this.successIcon;
            this.iconColor = this.successColor;
        } else {
            this.icon = this.failureIcon;
            this.iconColor = this.failureColor;
        }
    }
}
