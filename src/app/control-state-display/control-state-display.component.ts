import { Component, OnDestroy, OnInit } from '@angular/core';
import { RosService } from '../ros.service';
import { LqrActiveFeedbackMessage } from '../ros-model.enum';
import { Subscription } from 'rxjs';
import { NbComponentStatus } from '@nebular/theme';

@Component({
    selector: 'app-control-state-display',
    templateUrl: './control-state-display.component.html',
    styleUrls: ['./control-state-display.component.scss'],
})
export class ControlStateDisplayComponent implements OnInit, OnDestroy {
    private lqrActiveFeedbackSubscription: Subscription;
    lqrActive = new LqrActiveDisplay(false);

    constructor(private rs: RosService) {
        this.lqrActiveFeedbackSubscription = this.rs.lqrActiveFeedbackData.subscribe(
            (msg: LqrActiveFeedbackMessage) => {
                if (msg) {
                    this.lqrActive.updateState(msg.data);
                }
            }
        );
    }

    ngOnInit(): void {}

    ngOnDestroy() {
        this.lqrActiveFeedbackSubscription.unsubscribe();
    }
}

class LqrActiveDisplay {
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
