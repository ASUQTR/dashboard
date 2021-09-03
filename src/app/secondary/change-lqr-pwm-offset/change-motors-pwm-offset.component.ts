import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RoslibService } from '../../roslib.service';

@Component({
    selector: 'app-change-motors-pwm-offset',
    templateUrl: './change-motors-pwm-offset.component.html',
    styleUrls: ['./change-motors-pwm-offset.component.scss'],
})
export class ChangeMotorsPwmOffsetComponent implements OnInit {
    newPwmOffset = new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
    ]);

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {
        const motorsPwmOffsetParam = this.rs.getMotorsPwmOffset();
        motorsPwmOffsetParam.get((param) => {
            if (param) {
                this.newPwmOffset.setValue(param);
            }
        });
    }

    onClickPwmOffsetSend() {
        this.rs.changeMotorsPwmOffsetFactor(this.newPwmOffset.value);
    }
}
