import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RosService } from '../ros.service';

@Component({
    selector: 'app-control-lqr-parameters',
    templateUrl: './control-lqr-parameters.component.html',
    styleUrls: ['./control-lqr-parameters.component.scss'],
})
export class ControlLqrParametersComponent implements OnInit {
    matrixQ = new FormArray([
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
    ]);
    matrixR = new FormArray([
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
        new FormControl(0, [
            Validators.required,
            Validators.pattern('^\\d*\\.?\\d*$'),
            Validators.min(0),
            Validators.max(Math.pow(2, 127) * (2 - Math.pow(2, -23))),
        ]),
    ]);

    constructor(private rs: RosService) {}

    get matrixQ1() {
        return this.matrixQ.at(0);
    }

    get matrixQ2() {
        return this.matrixQ.at(1);
    }

    get matrixQ3() {
        return this.matrixQ.at(2);
    }

    get matrixQ4() {
        return this.matrixQ.at(3);
    }

    get matrixQ5() {
        return this.matrixQ.at(4);
    }

    get matrixQ6() {
        return this.matrixQ.at(5);
    }

    get matrixQ7() {
        return this.matrixQ.at(6);
    }

    get matrixQ8() {
        return this.matrixQ.at(7);
    }

    get matrixR1() {
        return this.matrixR.at(0);
    }

    get matrixR2() {
        return this.matrixR.at(1);
    }

    get matrixR3() {
        return this.matrixR.at(2);
    }

    get matrixR4() {
        return this.matrixR.at(3);
    }

    get matrixR5() {
        return this.matrixR.at(4);
    }

    get matrixR6() {
        return this.matrixR.at(5);
    }

    get matrixR7() {
        return this.matrixR.at(6);
    }

    get matrixR8() {
        return this.matrixR.at(7);
    }

    ngOnInit(): void {
        const matrixQParam = this.rs.getLqrParamsMatrixQ();
        matrixQParam.get((param) => {
            this.matrixQ.setValue(param);
        })
        const matrixRParam = this.rs.getLqrParamsMatrixR();
        matrixRParam.get((param) => {
            this.matrixR.setValue(param);
        })
    }

    sendNewValues() {
        this.rs.sendLqrParams(this.matrixQ.value, this.matrixR.value);
    }
}
