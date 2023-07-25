import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { RoslibService } from '../../roslib.service';

@Component({
    selector: 'app-change-lqr-pos-angle-threshold',
    templateUrl: './change-lqr-pos-angle-threshold.component.html',
    styleUrls: ['./change-lqr-pos-angle-threshold.component.scss'],
})
export class ChangeLqrPosAngleThresholdComponent implements OnInit {
    posThreshold = new UntypedFormControl(0, [Validators.required, Validators.min(0)]);
    angleThreshold = new UntypedFormControl(0, [Validators.required, Validators.min(0)]);

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {}

    onClickPositionThresholdSend(): void {
        this.rs.changeLqrPositionThreshold(this.posThreshold.value);
    }

    onClickAngleThresholdSend(): void {
        this.rs.changeLqrAngleThreshold(this.angleThreshold.value);
    }
}
