import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Vector3Message } from 'ngx-roslib';
import { NbTrigger } from '@nebular/theme';

@Component({
    selector: 'app-nav-request',
    templateUrl: './nav-request.component.html',
    styleUrls: ['./nav-request.component.scss'],
})
export class NavRequestComponent implements OnInit {
    @Input() title: string;
    @Input() tooltipMessage: string;
    @Input() dataSource: Subject<Vector3Message>;
    newPositionX = new FormControl();
    newPositionY = new FormControl();
    newPositionZ = new FormControl();
    readonly hint: NbTrigger = NbTrigger.HINT;
    readonly noop: NbTrigger = NbTrigger.NOOP;

    constructor() {}

    ngOnInit(): void {}

    requestPosition(): void {
        this.dataSource.next({
            x: this.newPositionX.value ?? 0,
            y: this.newPositionY.value ?? 0,
            z: this.newPositionZ.value ?? 0,
        });
    }
}
