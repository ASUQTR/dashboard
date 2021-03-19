import { Component, OnInit } from '@angular/core';
import { RosService } from '../../ros.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-change-lqr-att-factor',
    templateUrl: './change-lqr-att-factor.component.html',
    styleUrls: ['./change-lqr-att-factor.component.scss'],
})
export class ChangeLqrAttFactorComponent implements OnInit {
    newAttenuationFactor = new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(1),
    ]);

    constructor(private rs: RosService) {}

    ngOnInit(): void {}

    onClickAttenuationFactorSend() {
        this.rs.changeLqrAttenuationFactor(this.newAttenuationFactor.value);
    }
}
