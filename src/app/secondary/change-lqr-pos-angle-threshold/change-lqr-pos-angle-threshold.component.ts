import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RosService } from '../../ros.service';

@Component({
    selector: 'app-change-lqr-pos-angle-threshold',
    templateUrl: './change-lqr-pos-angle-threshold.component.html',
    styleUrls: ['./change-lqr-pos-angle-threshold.component.scss'],
})
export class ChangeLqrPosAngleThresholdComponent implements OnInit {
    posThreshold = new FormControl(0, [Validators.required, Validators.min(0)]);
    angleThreshold = new FormControl(0, [Validators.required, Validators.min(0)]);

    constructor(private rs: RosService) {}

    ngOnInit(): void {}

    onClickPositionThresholdSend(): void {
        this.rs.changeLqrPositionThreshold(this.posThreshold.value);
    }

    onClickAngleThresholdSend(): void {
        this.rs.changeLqrAngleThreshold(this.angleThreshold.value);
    }
}
