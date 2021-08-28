import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RoslibService } from '../../roslib.service';

@Component({
    selector: 'app-change-lqr-rates',
    templateUrl: './change-lqr-rates.component.html',
    styleUrls: ['./change-lqr-rates.component.scss'],
})
export class ChangeLqrRatesComponent implements OnInit {
    actionServerRate = new FormControl(0, [Validators.required, Validators.min(0)]);
    lqrRate = new FormControl(0, [Validators.required, Validators.min(0)]);

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {}

    onClickActionServerRateSend(): void {
        this.rs.changeLqrActionServerRate(this.actionServerRate.value);
    }

    onClickLqrRateSend(): void {
        this.rs.changeLqrRate(this.lqrRate.value);
    }
}
